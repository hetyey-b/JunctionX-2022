from http import HTTPStatus

import uvicorn

from fastapi import FastAPI
from starlette.exceptions import HTTPException

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
    RecommendationResponse,
)
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.exceptions import ExceptionMiddleware

from server.app.wise import (
    topup_balance,
    create_saving_account,
    get_savings,
    delete_balance,
)

app = FastAPI()
app.add_middleware(ExceptionMiddleware)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"])
app.add_middleware(GZipMiddleware, minimum_size=1000)


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


@app.post("/recommendations", response_model=RecommendationResponse)
def get_travel_recommendations(
    budget: BudgetRequest, location: str, currency: Currency = Currency.HUF
):
    if budget.people < 1:
        raise HTTPException(HTTPStatus.BAD_REQUEST, "At least 1 person")
    if budget.budget <= 1:
        raise HTTPException(HTTPStatus.BAD_REQUEST, "Need some money in the budget")
    if budget.nights < 1:
        raise HTTPException(HTTPStatus.BAD_REQUEST, "At least 1 night")
    if budget.outings < 0:
        raise HTTPException(HTTPStatus.BAD_REQUEST, "Cannot have negative outings")

    return get_recommendations(budget, location, currency)


@app.post("/create-savings", response_model=int, status_code=HTTPStatus.CREATED)
def create_savings_account(
    token: str, account_name: str, currency: Currency = Currency.HUF
):
    return create_saving_account(token, account_name, currency)


@app.get("/savings")
def get_savings_balance(token: str, balance_id: int | None = None):
    return get_savings(token, balance_id)


@app.delete("/savings")
def delete__balance(token: str, balance_id: int):
    return delete_balance(token, balance_id)


@app.get("/topup")
def topop_account(
    token: str, balance_id: int, amount: float, currency: Currency = Currency.HUF
):
    return topup_balance(token, balance_id, amount, currency)


if __name__ == "__main__":
    uvicorn.run(
        "server.app.main:app",
        reload=True,
        port=8000,
        host="0.0.0.0",
        log_level="info",
        workers=1,
    )
