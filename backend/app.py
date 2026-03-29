import random

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from bahnhofs import BHF_ID_MAP, BHF_LIST, ID_BHF_MAP, ID_LIST

app = FastAPI()


class TrainView(BaseModel):
    train_name: str
    train_id: str
    delay: int


class FlipView(BaseModel):
    bhf_name: str
    bhf_id: str
    next_train: TrainView


@app.get("/flip")
def perform_flip(bahnhof: str | None = None) -> FlipView:

    if bahnhof is None:
        bahnhof_id = random.choice(ID_LIST)  # noqa: S311
    else:
        bahnhof_id = BHF_ID_MAP.get(bahnhof)
        if bahnhof_id is None:
            raise HTTPException(status_code=404, detail=f"Bahnhof '{bahnhof}' not found!")
    bahnhof_name = ID_BHF_MAP[bahnhof_id]
    # TODO scrape delays for given bahnhof

    train_view = TrainView(train_name="Sonnenallee Express", train_id="ICE-123", delay=1)
    return FlipView(bhf_id=bahnhof_id, bhf_name=bahnhof_name, next_train=train_view)


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
        raise HTTPException(status_code=404, detail=f"ID '{bahnhof_id}' not found!")
    return bahnhof


@app.get("/id")
def get_id(bahnhof: str) -> str:
    bahnhof_id = BHF_ID_MAP.get(bahnhof)
    if bahnhof_id is None:
        raise HTTPException(status_code=404, detail=f"Bahnhof '{bahnhof}' not found!")
    return bahnhof_id
