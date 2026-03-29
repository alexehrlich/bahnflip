# https://www.dbinfrago.com/resource/blob/13131484/1ce28c8767d41904e597e6f99e0bba39/INB-2026-Anlage-5-1b-data.pdf

ID_BHF_MAP = {
    "AA": "Hamburg-Altona",
    "AH": "Hamburg Hbf",
    "AHAR": "Hamburg-Harburg",
    "BFBI": "Flughafen BER",
    "BFRI": "Berlin Friedrichstraße",
    "BGS": "Berlin-Gesundbrunnen",
    "BHF": "Berlin Ostbahnhof",
    "BL": "Berlin Hauptbahnhof",
    "BLO": "Berlin-Lichtenberg",
    "BOKN": "Berlin Ostkreuz (Ringbahn-F)",
    "BOKR": "Berlin Ostkreuz (Stadtbahn-F)",
    "BPAF": "Berlin Südkreuz",
    "BSPD": "Berlin-Spandau",
    "BPD": "Potsdam Hbf",
    "BZOO": "Berlin Zoologischer Garten",
    "EDG": "Duisburog Hbf",
    "EDO": "Dortmund Hbf",
    "EE": "Essen Hbf",
    "EMSTP": "Münster (Westf) Pbf",
    "FF": "Frankfurt (Main) Hbf",
    "FFLF": "Frankfurt am Main Flughafen Fernbahnhof",
    "FMZ": "Mainz Hbf",
    "HB": "Bremen Hbf",
    "HH": "Hannover Hbf",
    "KB": "Bonn Hbf",
    "KD": "Düsseldorf Hbf",
    "KK": "Köln Hbf",
    "KKDZ": "Köln Messe/Deutz",
    "LL": "Leipzig Hbf",
    "MH": "München Hbf",
    "MKA": "Mü Karlsplatz",
    "MMP": "München Marienplat",
    "MOP": "München Ost Pbf",
    "MP": "München-Pasing",
    "NN": "Nürnberg Hbf",
    "RF": "Freiburg (Breisgau) Hbf",
    "RK": "Karlsruhe Hbf",
    "RKAB": "Karlsruhe Albtalbahnhof",
    "RM": "Mannheim Hbf",
    "TS": "Stuttgart Hbf",
}


BHF_ID_MAP = {v: k for k, v in ID_BHF_MAP.items()}

BHF_LIST = list(BHF_ID_MAP.keys())
ID_LIST = list(ID_BHF_MAP.keys())
