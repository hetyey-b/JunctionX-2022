import uvicorn

from fastapi import FastAPI

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
        port=8000,
        host="0.0.0.0",
        log_level="info",
        workers=1,
    )
