import random

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from bahnhofs import BHF_LIST, NAME_MAP, BahnhofView

app = FastAPI()

class FlipView(BaseModel):
    bahnhof: BahnhofView
    next_train: TrainView

@app.get("/flip")
def perform_flip(bahnhof: str | None = None) -> FlipView:

    if bahnhof is None:
        bahnhof_view = random.choice(BHF_LIST)  # noqa: S311
    else:
        bahnhof_view = NAME_MAP.get(bahnhof)
        if bahnhof_view is None:
            raise HTTPException(status_code=404, detail=f"Bahnhof '{bahnhof}' not found!")

    # TODO scrape delays for given bahnhof
    train_view = TrainView(train_name="Sonnenallee Express", train_id="ICE-123", delay=1)
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
