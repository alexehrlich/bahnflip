import random

from fastapi import FastAPI, HTTPException

from bahnhofs import BHF_ID_MAP, BHF_LIST, ID_BHF_MAP

app = FastAPI()


@app.get("/flip")
def do_flip(bahnhof: str | None = None):

    if bahnhof is None:
        bahnhof = random.choice(BHF_LIST)  # noqa: S311

    # TODO scrape delays for given bahnhof

    return {"Bahnhof": bahnhof}


@app.get("/list")
def get_list() -> list[str]:

    return BHF_LIST


@app.get("/map")
def get_map() -> dict[str, str]:

    return ID_BHF_MAP



@app.get("/bhf")
def get_bhf(bahnhof_id: str) -> str:
    bahnhof = ID_BHF_MAP.get(bahnhof_id)
    if bahnhof is None:
        raise HTTPException(status_code=404, detail=f"ID '{bahnhof_id}' not present!")
    return bahnhof

@app.get("/id")
def get_uuid(bahnhof: str) -> str:
    bahnhof_id= BHF_ID_MAP.get(bahnhof)
    if bahnhof_id is None:
        raise HTTPException(status_code=404, detail=f"Bahnhof '{bahnhof}' not present!")
    return bahnhof_id
