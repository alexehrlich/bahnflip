import os
import requests
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta
from pydantic import BaseModel
from dataclasses import dataclass


@dataclass
class ArrivalStatus:
    cancelled:  bool        = False
    delay:      timedelta   = timedelta() 

class TrainView(BaseModel):
    train_name: str
    delay: int

BASE_URL = "https://apis.deutschebahn.com/db-api-marketplace/apis/timetables/v1"
HEADERS  = {
    "DB-Client-Id": "PLACEHOLDER",
    "DB-Api-Key":   "PLACEHOLDER",
    "accept":       "application/xml",
}

FERNVERKEHR = {"ICE", "IC", "EC", "TGV", "RJ", "RJX"}

def _parse_time(ts: str) -> datetime:
    """YYMMDDhhmm -> datetime"""
    return datetime.strptime(ts, "%y%m%d%H%M")
    

def _get_station_info(ril100_code: str) -> tuple[str, str]:
    """
    Get the unique eva number for a given ril100
    """
    r = requests.get(f"{BASE_URL}/station/{ril100_code}", headers=HEADERS, timeout=10)
    r.raise_for_status()

    root = ET.fromstring(r.text)
    station = root.find(".//station")
    if station is None:
        raise ValueError("Bahnhof nicht gefunden.")
    return (station.attrib["eva"], station.attrib["name"])


def _get_last_planned_train(eva: str, time=None):
    """
    Get the last planned long distance train before {time}
    for the passed station.
    Maybe cache because its static?!
    """
    if time is None:
        time = datetime.now()

    candidates = []

    print(f"Request for time: {time}")
    for hour_offset in [0, -1]:
        t = time + timedelta(hours=hour_offset)
        date = t.strftime("%y%m%d")
        hour = t.strftime("%H")
        r = requests.get(f"{BASE_URL}/plan/{eva}/{date}/{hour}", headers=HEADERS, timeout=10)
        r.raise_for_status()

        root = ET.fromstring(r.text)

        # iterate over the timetable elements
        for s in root.findall("s"):
            train_line = s.find("tl")
            arrival = s.find("ar")

            if train_line is None or train_line.attrib.get("c") not in FERNVERKEHR:
                continue
            if arrival is None or _parse_time(arrival.attrib.get("pt")) > time:
                continue
            candidates.append(
                {
                    "id": s.attrib.get("id"),
                    "type": train_line.attrib.get("c"),
                    "train_number": train_line.attrib.get("n"),
                    "planned_arrival": _parse_time(arrival.attrib.get("pt")),
                }
            )

    if not candidates:
        return None

    return sorted(candidates, key=lambda t: t["planned_arrival"], reverse=True)[0]


def _get_possible_delay(eva: str, id: str, planned_arrival: datetime) -> ArrivalStatus:
    r = requests.get(f"{BASE_URL}/fchg/{eva}", headers=HEADERS, timeout=10)
    r.raise_for_status()

    root = ET.fromstring(r.text)
    for s in root.findall("s"):
        parsed_id = s.attrib.get("id")
        if parsed_id != id:
            continue

        print(f"Found change for: {id}\n")
        arrival = s.find("ar")
        if arrival is None:
            print("No changes on arrival for this train")
            return ArrivalStatus()

        cs = arrival.get("cs")
        if cs == "c":
            print("Zug ausgefallen")
            return ArrivalStatus(cancelled=True)

        changed_time = arrival.attrib.get("ct")

        if changed_time is None:
            print("No changed time --> no delay")
            return ArrivalStatus()

        return ArrivalStatus(delay=_parse_time(changed_time) - planned_arrival)

    return ArrivalStatus()


def get_latest_train(ril100: str) -> TrainView:
    station_info = _get_station_info(ril100)
    eva = station_info[0]
    station_name = station_info[1]
    print(f"Found eva: {eva} for ril: {ril100} | {station_name}")
    last_train = _get_last_planned_train(eva)
    print(f"Last train: {last_train}\n")
    if not last_train:
        raise ValueError("Did not find any timetable data")
    delay_info = _get_possible_delay(eva, last_train["id"], last_train["planned_arrival"])
    combined_train_name = f"{last_train['type']} {last_train['train_number']}"
    if delay_info.cancelled:
        print(f"{combined_train_name} was canceleld")
        delay = -1
    else:
        delay = delay_info.delay.total_seconds() / 60
        print(f"{combined_train_name} has {delay} minutes delay")

    return TrainView(train_name=combined_train_name, delay=int(delay))


def main():
    get_latest_train("AA")


if __name__ == "__main__":
    main()
