import datetime
import os
from enum import Enum
from http import HTTPStatus

import geopy.distance
from starlette.exceptions import HTTPException
from tinydb import TinyDB, Query
from server.app.shemas import (
    City,
    Cost,
    CityExtraData,
    CitiesResponse,
    Currency,
    TravelResponse,
    Travel,
    ExtraDataResponse,
    BudgetRequest,
    Recommendation,
)
from server.app.utils import get_git_root


db = TinyDB(f"{get_git_root(os.getcwd())}/server/app/data/db.json")
cities_table = db.table("cities")
cities_extra_data_table = db.table("cities_extra_data")

airplane_speed = 0.222222
car_speed = 0.0305556
transit_speed = 0.02270889

car_cost_per_km_in_eur = 0.2207
transit_cost_per_km_in_eur = 0.175
plane_cost_per_km_in_eur = 0.2500

eur_to_huf = 411


def create_city(
    name: str,
    country: str,
    lat: float,
    long: float,
):
    city_query = Query()
    if cities_table.search(city_query.name == name):
        return
    city = City(name=name, country=country, lat=lat, long=long)
    cities_table.insert(city.dict())


def get_city(name: str) -> City | None:
    city_query = Query()
    docs = cities_table.search(city_query.name == name)
    if len(docs) == 1:
        return City.parse_obj(docs[0])
    return None


def get_cities() -> dict[str, City]:
    return {city["name"]: City.parse_obj(city) for city in cities_table.all()}


def create_city_extra(
    name: str,
    currency: Currency,
    costs: dict[str, list[Cost]],
):
    city_extra_data = CityExtraData(name=name, currency=currency, costs=costs)
    cities_extra_data_table.insert(
        {
            key: (val.value if isinstance(val, Enum) else val)
            for key, val in city_extra_data.dict().items()
        }
    )


def get_cities_extra() -> dict[str, CityExtraData]:
    return {
        (extra["name"], extra["currency"]): CityExtraData.parse_obj(extra)
        for extra in cities_extra_data_table.all()
    }


def get_extra_data(name: str, currency: str) -> CityExtraData:
    extra_query = Query()
    extra = cities_extra_data_table.search(
        (extra_query.name == name) & (extra_query.currency == currency)
    )
    if len(extra) == 1:
        print(extra[0])
        return CityExtraData.parse_obj(extra[0])
    raise HTTPException(HTTPStatus.BAD_REQUEST, f"{name} or {currency} is bad")


def get_cities_response() -> CitiesResponse:
    return CitiesResponse(cities=list(get_cities().values()))


def get_extra_data_response(name: str, currency: Currency) -> ExtraDataResponse:
    return ExtraDataResponse(extra=get_extra_data(name, currency.value))


def get_travel(city_from_name: str, city_to_name: str, currency: Currency):
    city_from = get_city(city_from_name)
    if not city_from:
        raise HTTPException(HTTPStatus.BAD_REQUEST, f"{city_from_name} does not exist")
    city_to = get_city(city_to_name)
    if not city_to:
        raise HTTPException(HTTPStatus.BAD_REQUEST, f"{city_to_name} does not exist")

    distance = geopy.distance.geodesic(
        (city_from.lat, city_from.long), (city_to.lat, city_to.long)
    ).km
    if currency == Currency.EUR:
        return TravelResponse(
            distance=distance,
            airplane=Travel(
                time=str(datetime.timedelta(seconds=distance / airplane_speed)),
                currency=currency,
                cost=distance * plane_cost_per_km_in_eur,
            ),
            car=Travel(
                time=str(datetime.timedelta(seconds=distance / car_speed)),
                currency=currency,
                cost=distance * car_cost_per_km_in_eur,
            ),
            transit=Travel(
                time=str(datetime.timedelta(seconds=distance / transit_speed)),
                currency=currency,
                cost=distance * transit_cost_per_km_in_eur,
            ),
        )
    elif currency == Currency.HUF:
        return TravelResponse(
            distance=distance,
            airplane=Travel(
                time=str(datetime.timedelta(seconds=distance / airplane_speed)),
                currency=currency,
                cost=distance * plane_cost_per_km_in_eur * eur_to_huf,
            ),
            car=Travel(
                time=str(datetime.timedelta(seconds=distance / car_speed)),
                currency=currency,
                cost=distance * car_cost_per_km_in_eur * eur_to_huf,
            ),
            transit=Travel(
                time=str(datetime.timedelta(seconds=distance / transit_speed)),
                currency=currency,
                cost=distance * transit_cost_per_km_in_eur * eur_to_huf,
            ),
        )


def find(ls, key, value):
    for obj in ls:
        if key in obj and obj[key] == value:
            return obj
    return None


def get_relevant_recommendation_data(budget: BudgetRequest, extra: CityExtraData):
    daily_cost = 0
    if budget.people > 3:
        pass
    else:
        pass


def get_recommendations(budget: BudgetRequest, currency: Currency):
    recommendations = []
    for city_name, city in get_cities().items():
        extra = get_extra_data(city_name, currency.value)
        relevant_extra = get_relevant_recommendation_data(budget, extra)
        recommendation = Recommendation()
        recommendations.append(recommendation)
    return recommendations
