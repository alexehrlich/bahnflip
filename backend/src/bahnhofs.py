# https://www.dbinfrago.com/resource/blob/13131484/1ce28c8767d41904e597e6f99e0bba39/INB-2026-Anlage-5-1b-data.pdf
# https://stellwerke.info/stw/

from pydantic import BaseModel


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
        if bahnhof_name not in ID_MAP:
            raise ValueError(f"Name {bahnhof_name} not found!")
        return ID_MAP[bahnhof_name]

BHF_LIST =[
    BahnhofView(bhf_id="AA", bhf_name="Hamburg-Altona", geo_lat=53.55657, geo_lon=9.93598),
    BahnhofView(bhf_id="AH", bhf_name="Hamburg Hbf", geo_lat=53.54739, geo_lon=10.00916),
    BahnhofView(bhf_id="AHAR", bhf_name="Hamburg-Harburg", geo_lat=53.45569, geo_lon=9.99083),
    BahnhofView(bhf_id="BFBI", bhf_name="Flughafen BER", geo_lat=52.36319, geo_lon=13.44924),
    BahnhofView(bhf_id="BFRI", bhf_name="Berlin Friedrichstraße", geo_lat=52.52059, geo_lon=13.38692),
    BahnhofView(bhf_id="BGS", bhf_name="Berlin-Gesundbrunnen", geo_lat=52.54883, geo_lon=13.39886),
    BahnhofView(bhf_id="BHF", bhf_name="Berlin Ostbahnhof", geo_lat=52.51066, geo_lon=13.43350),
    BahnhofView(bhf_id="BL", bhf_name="Berlin Hauptbahnhof", geo_lat=52.52709, geo_lon=13.36799),
    BahnhofView(bhf_id="BLO", bhf_name="Berlin-Lichtenberg", geo_lat=52.50967, geo_lon=13.49653),
    BahnhofView(bhf_id="BOKR", bhf_name="Berlin Ostkreuz (Stadtbahn-F)", geo_lat=52.51066, geo_lon=13.43350),
    BahnhofView(bhf_id="BPAF", bhf_name="Berlin Südkreuz", geo_lat=52.47607, geo_lon=13.36617),
    BahnhofView(bhf_id="BSPD", bhf_name="Berlin-Spandau", geo_lat=52.52974, geo_lon=13.22396),
    BahnhofView(bhf_id="BPD", bhf_name="Potsdam Hbf", geo_lat=52.39154, geo_lon=13.06670),
    BahnhofView(bhf_id="BZOO", bhf_name="Berlin Zoologischer Garten", geo_lat=52.50868, geo_lon=13.33343),
    BahnhofView(bhf_id="EDG", bhf_name="Duisburg Hbf", geo_lat=51.41184, geo_lon=6.77521),
    BahnhofView(bhf_id="EDO", bhf_name="Dortmund Hbf", geo_lat=51.51797, geo_lon=7.45926),
    BahnhofView(bhf_id="EE", bhf_name="Essen Hbf", geo_lat=51.45156, geo_lon=7.01968),
    BahnhofView(bhf_id="FF", bhf_name="Frankfurt (Main) Hbf", geo_lat=50.10225, geo_lon=8.64860),
    BahnhofView(bhf_id="FFLF", bhf_name="Frankfurt am Main Flughafen Fernbahnhof", geo_lat=50.04567, geo_lon=8.54051),
    BahnhofView(bhf_id="FMZ", bhf_name="Mainz Hbf", geo_lat=50.00468, geo_lon=8.25569),
    BahnhofView(bhf_id="HB", bhf_name="Bremen Hbf", geo_lat=53.08556, geo_lon=8.81201),
    BahnhofView(bhf_id="HH", bhf_name="Hannover Hbf", geo_lat=52.37424, geo_lon=9.74655),
    BahnhofView(bhf_id="KB", bhf_name="Bonn Hbf", geo_lat=50.73780, geo_lon=7.07361),
    BahnhofView(bhf_id="KD", bhf_name="Düsseldorf Hbf", geo_lat=51.21993, geo_lon=6.79288),
    BahnhofView(bhf_id="KK", bhf_name="Köln Hbf", geo_lat=50.94276, geo_lon=6.95903),
    BahnhofView(bhf_id="KKDZ", bhf_name="Köln Messe/Deutz", geo_lat=50.94082, geo_lon=6.97452),
    BahnhofView(bhf_id="LL", bhf_name="Leipzig Hbf", geo_lat=51.35830, geo_lon=12.39752),
    BahnhofView(bhf_id="MH", bhf_name="München Hbf", geo_lat=48.14164, geo_lon=11.54897),
    BahnhofView(bhf_id="MOP", bhf_name="München Ost Pbf", geo_lat=48.13114, geo_lon=11.61142),
    BahnhofView(bhf_id="MP", bhf_name="München-Pasing", geo_lat=48.15185, geo_lon=11.44889),
    BahnhofView(bhf_id="NN", bhf_name="Nürnberg Hbf", geo_lat=49.44956, geo_lon=11.10960),
    BahnhofView(bhf_id="RF", bhf_name="Freiburg (Breisgau) Hbf", geo_lat=47.99709, geo_lon=7.83991),
    BahnhofView(bhf_id="RK", bhf_name="Karlsruhe Hbf", geo_lat=48.99192, geo_lon=8.39826),
    BahnhofView(bhf_id="RKAB", bhf_name="Karlsruhe Albtalbahnhof", geo_lat=48.99170, geo_lon=8.39481),
    BahnhofView(bhf_id="RM", bhf_name="Mannheim Hbf", geo_lat=49.47944, geo_lon=8.46958),
    BahnhofView(bhf_id="TS", bhf_name="Stuttgart Hbf", geo_lat=48.78751, geo_lon=9.18642),
]


ID_MAP = {b.bhf_id: b for b in BHF_LIST}
ID_LIST = [b.bhf_id for b in BHF_LIST]
NAME_MAP = {b.bhf_name: b for b in BHF_LIST}
