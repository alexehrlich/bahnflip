import random
import secrets

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from bahnhofs import BHF_LIST, ID_LIST, ID_MAP, NAME_LIST, NAME_MAP, BahnhofView
from fetch_delay_data import HEADERS, TrainView, get_latest_train

app = FastAPI()


class FlipView(BaseModel):
    bahnhof: BahnhofView
    next_train: TrainView

    @classmethod
    def random(cls, bahnhof_view: BahnhofView) -> FlipView:
        nr = secrets.randbelow(999)
        train_view = TrainView(train_name=f"MockTrain ICE-{nr}", delay=secrets.choice([-1, 5, 10, 15, 60]))  # noqa: S311
        return FlipView(bahnhof=bahnhof_view, next_train=train_view)


def __mock_flip(bahnhof_view: BahnhofView) -> FlipView:
    r = random.random()  # noqa: S311
    if r < 0.1:
        _err = secrets.choice([0, 1])
        if _err == 0:
            raise HTTPException(status_code=404, detail="Mocking 404")
        if _err == 1:
            raise HTTPException(status_code=500, detail="Mocking 500")
    return FlipView.random(bahnhof_view)


@app.get("/flip")
def perform_flip(bahnhof: str | None = None) -> FlipView:

    bahnhof_view = None
    if bahnhof is None:
        bahnhof_view = secrets.choice(BHF_LIST)
    elif bahnhof in ID_LIST:
        bahnhof_view = ID_MAP.get(bahnhof)
    elif bahnhof in NAME_LIST:
        bahnhof_view = NAME_MAP.get(bahnhof)

    if bahnhof_view is None:
        raise HTTPException(status_code=404, detail=f"Bahnhof '{bahnhof}' not found!")

    # Mocking
    if HEADERS["DB-Client-Id"] == "PLACEHOLDER" or HEADERS["DB-Api-Key"] == "PLACEHOLDER":
        return __mock_flip(bahnhof_view)

    try:
        train_view = get_latest_train(bahnhof_view.bhf_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e)) from e
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

