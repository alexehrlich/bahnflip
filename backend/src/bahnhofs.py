# https://www.dbinfrago.com/resource/blob/13131484/1ce28c8767d41904e597e6f99e0bba39/INB-2026-Anlage-5-1b-data.pdf
# https://stellwerke.info/stw/

from pydantic import BaseModel

from geo_service import lookup_geo


class BahnhofView(BaseModel):
    bhf_name: str
    bhf_id: str
    geo_lat: float = 0.0
    geo_lon: float = 0.0

    @classmethod
    def from_id(cls, bahnhof_id: str) -> BahnhofView:
        if bahnhof_id not in ID_MAP:
            raise ValueError(f"ID {bahnhof_id} not found!")
        return ID_MAP[bahnhof_id]

    @classmethod
    def from_name(cls, bahnhof_name: str) -> BahnhofView:
        if bahnhof_name not in NAME_MAP:
            raise ValueError(f"Name {bahnhof_name} not found!")
        return NAME_MAP[bahnhof_name]

BHF_LIST = [
    BahnhofView(bhf_id="AA", bhf_name="Hamburg-Altona"),
    BahnhofView(bhf_id="AHAR", bhf_name="Hamburg-Harburg"),
    BahnhofView(bhf_id="AH", bhf_name="Hamburg Hbf"),
    BahnhofView(bhf_id="BFBI", bhf_name="Flughafen BER"),
    BahnhofView(bhf_id="BFRI", bhf_name="Berlin Friedrichstraße"),
    BahnhofView(bhf_id="BGS", bhf_name="Berlin-Gesundbrunnen"),
    BahnhofView(bhf_id="BHF", bhf_name="Berlin Ostbahnhof"),
    BahnhofView(bhf_id="BL", bhf_name="Berlin Hauptbahnhof"),
    BahnhofView(bhf_id="BLO", bhf_name="Berlin-Lichtenberg"),
    BahnhofView(bhf_id="BOKR", bhf_name="Berlin Ostkreuz (Stadtbahn-F)"),
    BahnhofView(bhf_id="BPAF", bhf_name="Berlin Südkreuz"),
    BahnhofView(bhf_id="BPD", bhf_name="Potsdam Hbf"),
    BahnhofView(bhf_id="BSPD", bhf_name="Berlin-Spandau"),
    BahnhofView(bhf_id="BZOO", bhf_name="Berlin Zoologischer Garten"),
    BahnhofView(bhf_id="EDG", bhf_name="Duisburg Hbf"),
    BahnhofView(bhf_id="EDO", bhf_name="Dortmund Hbf"),
    BahnhofView(bhf_id="EE", bhf_name="Essen Hbf"),
    BahnhofView(bhf_id="FF", bhf_name="Frankfurt (Main) Hbf"),
    BahnhofView(bhf_id="FFLF", bhf_name="Frankfurt am Main Flughafen Fernbahnhof"),
    BahnhofView(bhf_id="FMZ", bhf_name="Mainz Hbf"),
    BahnhofView(bhf_id="HB", bhf_name="Bremen Hbf"),
    BahnhofView(bhf_id="HH", bhf_name="Hannover Hbf"),
    BahnhofView(bhf_id="KB", bhf_name="Bonn Hbf"),
    BahnhofView(bhf_id="KD", bhf_name="Düsseldorf Hbf"),
    BahnhofView(bhf_id="KK", bhf_name="Köln Hbf"),
    BahnhofView(bhf_id="KKDZ", bhf_name="Köln Messe/Deutz"),
    BahnhofView(bhf_id="LL", bhf_name="Leipzig Hbf"),
    BahnhofView(bhf_id="MH", bhf_name="München Hbf"),
    BahnhofView(bhf_id="MOP", bhf_name="München Ost Pbf"),
    BahnhofView(bhf_id="MP", bhf_name="München-Pasing"),
    BahnhofView(bhf_id="NN", bhf_name="Nürnberg Hbf"),
    BahnhofView(bhf_id="RF", bhf_name="Freiburg (Breisgau) Hbf"),
    BahnhofView(bhf_id="RKAB", bhf_name="Karlsruhe Albtalbahnhof"),
    BahnhofView(bhf_id="RK", bhf_name="Karlsruhe Hbf"),
    BahnhofView(bhf_id="RM", bhf_name="Mannheim Hbf"),
    BahnhofView(bhf_id="TS", bhf_name="Stuttgart Hbf"),
]


for _station in BHF_LIST:
    try:
        _station.geo_lat, _station.geo_lon = lookup_geo(_station.bhf_id)
    except ValueError:
        pass

ID_MAP = {b.bhf_id: b for b in BHF_LIST}
NAME_MAP = {b.bhf_name: b for b in BHF_LIST}
