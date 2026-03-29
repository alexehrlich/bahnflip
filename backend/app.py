import random
from uuid import UUID

from fastapi import FastAPI, HTTPException

from bahnhofs import BHFS_LIST, ID_BHF_MAP, BHF_ID_MAP

app = FastAPI()


@app.get("/flip")
def do_flip(bahnhof: str | None = None):

    if bahnhof is None:
        bahnhof = random.choice(BHFS_LIST)  # noqa: S311

    # TODO scrape delays for given bahnhof

    return {"Bahnhof": bahnhof}


@app.get("/list")
def get_list() -> list[str]:

    return BHFS_LIST


@app.get("/map")
def get_map() -> dict[UUID, str]:

    return ID_BHF_MAP



@app.get("/bhf")
def get_bhf(uuid: UUID) -> str:
    bahnhof = ID_BHF_MAP.get(uuid)
    if bahnhof is None:
        raise HTTPException(status_code=404, detail=f"ID '{uuid}' not present!")
    return bahnhof

@app.get("/uuid")
def get_uuid(bahnhof: str) -> UUID:
    uuid= BHF_ID_MAP.get(bahnhof)
    if uuid is None:
        raise HTTPException(status_code=404, detail=f"Bahnhof '{bahnhof}' not present!")
    return uuid
