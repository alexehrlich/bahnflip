"""
Geo coordinate lookup for German train stations via Wikidata SPARQL.

Uses the DS100/RIL100 station code (bhf_id) to query Wikidata property P8671,
returning latitude and longitude from P625 (coordinate location).

Results are persisted to geo_cache.json so Wikidata is only queried once per
station — subsequent startups load coordinates from disk instantly.
"""
import json
import logging
import re
import time
from pathlib import Path

import requests

logger = logging.getLogger(__name__)

WIKIDATA_ENDPOINT = "https://query.wikidata.org/sparql"
_USER_AGENT = "bahnflip/0.1 (https://github.com/alexehrlich/bahnflip)"
_CACHE_FILE = Path(__file__).parent / "geo_cache.json"

_SPARQL_TEMPLATE = """
SELECT ?lat ?lon WHERE {{
  ?station wdt:P8671 "{bhf_id}" ;
           p:P625 ?coordStatement .
  ?coordStatement psv:P625 ?coord .
  ?coord wikibase:geoLatitude ?lat ;
         wikibase:geoLongitude ?lon .
}}
LIMIT 1
"""

_BHF_ID_PATTERN = re.compile(r"^[A-Z0-9]+$")

# In-memory cache, pre-loaded from disk at import time
_cache: dict[str, tuple[float, float]] = {}

if _CACHE_FILE.exists():
    _cache = {k: tuple(v) for k, v in json.loads(_CACHE_FILE.read_text()).items()}


def _save_cache() -> None:
    _CACHE_FILE.write_text(json.dumps({k: list(v) for k, v in _cache.items()}, indent=2))


def is_cached(bhf_id: str) -> bool:
    return bhf_id.upper() in _cache


def lookup_geo(bhf_id: str) -> tuple[float, float]:
    bhf_id = bhf_id.upper()

    if not _BHF_ID_PATTERN.match(bhf_id):
        raise ValueError(f"Invalid bhf_id format: '{bhf_id}'")

    if bhf_id in _cache:
        return _cache[bhf_id]

    sparql = _SPARQL_TEMPLATE.format(bhf_id=bhf_id)
    t0 = time.monotonic()

    try:
        response = requests.get(
            WIKIDATA_ENDPOINT,
            params={"query": sparql, "format": "json"},
            headers={"User-Agent": _USER_AGENT},
            timeout=10,
        )
        response.raise_for_status()
        bindings = response.json()["results"]["bindings"]
    except requests.RequestException as e:
        raise ValueError(f"Network error during geo lookup: {e}") from e
    except (KeyError, ValueError) as e:
        raise ValueError(f"Unexpected Wikidata response format: {e}") from e

    if not bindings:
        raise ValueError(f"Station '{bhf_id}' not found in Wikidata")

    try:
        lat = float(bindings[0]["lat"]["value"])
        lon = float(bindings[0]["lon"]["value"])
    except (KeyError, ValueError, IndexError) as e:
        raise ValueError(f"Could not parse coordinates from Wikidata response: {e}") from e

    _cache[bhf_id] = (lat, lon)
    _save_cache()
    logger.info("Geo lookup OK  %-6s  lat=%.5f lon=%.5f  (%d ms)", bhf_id, lat, lon, (time.monotonic() - t0) * 1000)
    return (lat, lon)
