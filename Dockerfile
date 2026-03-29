FROM python:3 AS build-stage

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN pip install uv

COPY backend/pyproject.toml ./
COPY backend/src ./src

RUN uv venv .venv && uv pip install --system .

COPY frontend/dist ./static/

FROM python:3 AS runtime-stage

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN pip install uv

COPY --from=build-stage /app/.venv /app/.venv
COPY --from=build-stage /app/src /app/src
COPY --from=build-stage /app/static /app/static

ENV PATH="/app/.venv/bin:$PATH"

EXPOSE 8000

CMD ["uvicorn", "src.app:app", "--host", "0.0.0.0", "--port", "8000"]
