import random

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from bahnhofs import BHF_LIST, ID_LIST, ID_MAP, NAME_LIST, NAME_MAP, BahnhofView
from scrape import HEADERS, TrainView, get_latest_train

app = FastAPI()


class FlipView(BaseModel):
    bahnhof: BahnhofView
    next_train: TrainView

    @classmethod
    def random(cls) -> FlipView:
        bahnhof_view = BahnhofView(bhf_name="MockBahnhof", bhf_id="MOCK", geo_lat=0.0, geo_lon=0.0)
        train_view = TrainView(train_name="MockTrain", delay=random.choice([-1, 5, 10, 15]))  # noqa: S311
        return FlipView(bahnhof=bahnhof_view, next_train=train_view)


def __mock_flip() -> FlipView:
    _func = random.choice([0, 1, 2])  # noqa: S311
    if _func == 1:
        raise HTTPException(status_code=404, detail="Mocking 404")
    if _func == 2:
        raise HTTPException(status_code=500, detail="Mocking 500")
    return FlipView.random()


@app.get("/flip")
def perform_flip(bahnhof: str | None = None) -> FlipView:

    # Mocking
    if HEADERS["DB-Client-Id"] == "PLACEHOLDER" or HEADERS["DB-Api-Key"] == "PLACEHOLDER":
        return __mock_flip()

    bahnhof_view = None
    if bahnhof is None:
        bahnhof_view = random.choice(BHF_LIST)  # noqa: S311
    elif bahnhof in ID_LIST:
        bahnhof_view = ID_MAP.get(bahnhof)
    elif bahnhof in NAME_LIST:
        bahnhof_view = NAME_MAP.get(bahnhof)
    if bahnhof_view is None:
        raise HTTPException(status_code=404, detail=f"Bahnhof '{bahnhof}' not found!")

    get_latest_train(bahnhof_view.bhf_id)

    train_view = TrainView(train_name="ICE-123", delay=1)
    return FlipView(bahnhof=bahnhof_view, next_train=train_view)


@app.get("/list")
def get_list() -> list[BahnhofView]:

    return BHF_LIST


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

