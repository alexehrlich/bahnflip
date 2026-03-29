import random

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from bahnhofs import BHF_ID_MAP, BHF_LIST, ID_BHF_MAP, ID_LIST

app = FastAPI()


class TrainView(BaseModel):
    train_name: str
    train_id: str
    delay: int


class BahnhofView(BaseModel):
    bhf_name: str
    bhf_id: str
    geo_lat: float = 0.0
    geo_lon: float = 0.0

    @classmethod
    def from_id(cls, bahnhof_id: str) -> BahnhofView:
        bahnhof_name = ID_BHF_MAP.get(bahnhof_id)
        if bahnhof_name is None:
            raise ValueError(f"ID {bahnhof_id} not found!")
        return BahnhofView(bhf_name=bahnhof_name, bhf_id=bahnhof_id)

    @classmethod
    def from_name(cls, bahnhof_name: str) -> BahnhofView:
        bahnhof_id = BHF_ID_MAP.get(bahnhof_name)
        if bahnhof_id is None:
            raise ValueError(f"ID {bahnhof_name} not found!")
        return BahnhofView(bhf_name=bahnhof_name, bhf_id=bahnhof_id)


class FlipView(BaseModel):
    bahnhof: BahnhofView
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

    bahnhof_view = BahnhofView(bhf_id=bahnhof_id, bhf_name=bahnhof_name)
    train_view = TrainView(train_name="Sonnenallee Express", train_id="ICE-123", delay=1)
    return FlipView(bahnhof=bahnhof_view, next_train=train_view)


@app.get("/list")
def get_list() -> list[str]:

    return BHF_LIST


@app.get("/map")
def get_map() -> dict[str, str]:

    return ID_BHF_MAP


@app.get("/bhf")
def get_bhf(bahnhof_id: str) -> BahnhofView:
    try:
        view = BahnhofView.from_id(bahnhof_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e)) from e
    return view


@app.get("/id")
def get_id(bahnhof_name: str) -> BahnhofView:
    try:
        view = BahnhofView.from_name(bahnhof_name)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e)) from e
    return view
