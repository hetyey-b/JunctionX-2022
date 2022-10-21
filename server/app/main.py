import uvicorn

from fastapi import FastAPI

from env import settings
from server.app.database import get_cities_response, get_travel
from server.app.shemas import CitiesResponse, Currency, TravelResponse

app = FastAPI()


@app.get("/cities/", response_model=CitiesResponse)
def get_cities_endpoint(currency: Currency = Currency.HUF):
    return get_cities_response(currency)


@app.get("/travel/{city_from}/{city_to}", response_model=TravelResponse)
def get_travel_endpoint(
    city_from: str, city_to: str, currency: Currency = Currency.HUF
):
    return get_travel(
        city_from,
        city_to,
        currency,
    )


if __name__ == "__main__":
    uvicorn.run(
        "server.app.main:app",
        reload=True,
        port=settings.SERVER_PORT,
        log_level=settings.LOG_LEVEL,
        workers=1,
    )
