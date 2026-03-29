import random
from typing import Any

from fastapi import FastAPI
from fastapi.exceptions import HTTPException

from bahnhofs import FERNVERKEHR_BHFS

app = FastAPI()



@app.get("/flip")
def do_flip(bahnhof: str | None = None):

    if bahnhof is None:
        bahnhof = random.choice(FERNVERKEHR_BHFS)  # noqa: S311


    return {"Bahnhof": bahnhof}

@app.get("/list")
def get_list() -> list[str]:


    return FERNVERKEHR_BHFS





