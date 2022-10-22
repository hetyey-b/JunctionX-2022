import uvicorn

from fastapi import FastAPI

from server.app.database import (
    get_cities_response,
    get_travel,
    get_extra_data_response,
    get_recommendations,
)
from server.app.shemas import (
    CitiesResponse,
    Currency,
    TravelResponse,
    ExtraDataResponse,
    BudgetRequest,
)
from fastapi.middleware.gzip import GZipMiddleware
from starlette.middleware.exceptions import ExceptionMiddleware

app = FastAPI()
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(ExceptionMiddleware)


@app.get("/cities/", response_model=CitiesResponse)
def get_cities_endpoint():
    return get_cities_response()


@app.get("/cities/{city_name}", response_model=ExtraDataResponse)
def get_extra_data(city_name: str, currency: Currency = Currency.HUF):
    return get_extra_data_response(city_name, currency)


@app.get("/travel/{city_from}/{city_to}", response_model=TravelResponse)
def get_travel_endpoint(
    city_from: str, city_to: str, currency: Currency = Currency.HUF
):
    return get_travel(
        city_from,
        city_to,
        currency,
    )


@app.get("/recommendations/", response_model=BudgetRequest)
def get_travel_recommendations(
    budget: BudgetRequest, currency: Currency = Currency.HUF
):
    return get_recommendations(budget, currency)


if __name__ == "__main__":
    uvicorn.run(
        "server.app.main:app",
        reload=True,
        port=8000,
        host="0.0.0.0",
        log_level="info",
        workers=1,
    )
