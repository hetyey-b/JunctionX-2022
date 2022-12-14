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
    RecommendationResponse,
    AccommodationType,
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


def to_curr(cost_in_eur: float, curr: Currency) -> float:
    if curr == Currency.EUR:
        return cost_in_eur
    elif curr == Currency.HUF:
        return cost_in_eur * eur_to_huf


def rent_to_acc_per_night(cost: float, acc: AccommodationType) -> float:
    cost_per_day = cost / 31
    if acc == AccommodationType.HOTEL:
        return cost_per_day * 1.5
    elif acc == AccommodationType.AIRBNB:
        return cost_per_day * 1.3
    assert False


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
        return CityExtraData.parse_obj(extra[0])
    raise HTTPException(HTTPStatus.BAD_REQUEST, f"{name} or {currency} is bad")


def get_cities_response() -> CitiesResponse:
    return CitiesResponse(cities=list(get_cities().values()))


def get_extra_data_response(name: str, currency: Currency) -> ExtraDataResponse:
    return ExtraDataResponse(extra=get_extra_data(name, currency.value))


def add_costs(name: str, outings: int, people: int, *costs: Cost):
    c = Cost(name=name, mean=0, low=0, high=0)
    for cost in costs:
        c.mean += cost.mean
        c.low += cost.low
        c.high += cost.high
    c.mean *= outings * people
    c.low *= outings * people
    c.high *= outings * people
    return c


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
    return TravelResponse(
        distance=distance,
        airplane=Travel(
            time=str(datetime.timedelta(seconds=distance / airplane_speed)),
            currency=currency,
            cost=to_curr(distance * plane_cost_per_km_in_eur, currency),
        ),
        car=Travel(
            time=str(datetime.timedelta(seconds=distance / car_speed)),
            currency=currency,
            cost=to_curr(distance * car_cost_per_km_in_eur, currency),
        ),
        transit=Travel(
            time=str(datetime.timedelta(seconds=distance / transit_speed)),
            currency=currency,
            cost=to_curr(distance * transit_cost_per_km_in_eur, currency),
        ),
    )


def find(ls, key, value):
    for obj in ls:
        if hasattr(obj, key) and getattr(obj, key) == value:
            return obj
    raise Exception()


def get_relevant_recommendation_data(
    budget: BudgetRequest, localtion: str, curr: Currency, extra: CityExtraData
):
    data = {}
    if budget.people > 3:
        cheap_accommodation = find(
            extra.costs["Rent Per Month"],
            "name",
            "Apartment (3 bedrooms) Outside of Centre",
        )
        expensive_accommodation = find(
            extra.costs["Rent Per Month"],
            "name",
            "Apartment (3 bedrooms) in City Centre",
        )
        expensive_accommodation.mean = expensive_accommodation.mean / 3 * budget.people
        expensive_accommodation.low = expensive_accommodation.low / 3 * budget.people
        expensive_accommodation.high = expensive_accommodation.high / 3 * budget.people
    else:
        cheap_accommodation = find(
            extra.costs["Rent Per Month"],
            "name",
            "Apartment (1 bedroom) Outside of Centre",
        )
        expensive_accommodation = find(
            extra.costs["Rent Per Month"],
            "name",
            "Apartment (1 bedroom) in City Centre",
        )
    data["accommodation"] = [
        {
            "name": f"{budget.accommodation.value} Outside of Centre",
            "mean": rent_to_acc_per_night(
                cheap_accommodation.mean, budget.accommodation
            )
            * budget.nights,
            "low": rent_to_acc_per_night(cheap_accommodation.low, budget.accommodation)
            * budget.nights,
            "high": rent_to_acc_per_night(
                cheap_accommodation.high, budget.accommodation
            )
            * budget.nights,
        },
        {
            "name": f"{budget.accommodation.value} in City Centre",
            "mean": rent_to_acc_per_night(
                expensive_accommodation.mean, budget.accommodation
            )
            * budget.nights,
            "low": rent_to_acc_per_night(
                expensive_accommodation.low, budget.accommodation
            )
            * budget.nights,
            "high": rent_to_acc_per_night(
                expensive_accommodation.high, budget.accommodation
            )
            * budget.nights,
        },
    ]
    travels = get_travel(localtion, extra.name, curr)
    data["travel"] = [
        {
            "name": "Travel by airplane",
            "mean": travels.airplane.cost,
            "low": travels.airplane.cost * 0.60,
            "high": travels.airplane.cost * 1.5,
        },
        {
            "name": "Travel by Car",
            "mean": travels.car.cost,
            "low": travels.car.cost * 0.9,
            "high": travels.car.cost * 1.41,
        },
        {
            "name": "Travel by mass transit",
            "mean": travels.transit.cost,
            "low": travels.transit.cost * 0.8,
            "high": travels.transit.cost * 1.15,
        },
    ]
    if budget.outings < 1:
        return data

    fast_food = find(
        extra.costs["Restaurants"],
        "name",
        "McMeal at McDonalds (or Equivalent Combo Meal)",
    )
    cheap_restaurant = find(
        extra.costs["Restaurants"],
        "name",
        "Meal, Inexpensive Restaurant",
    )
    normal_restaurant = find(
        extra.costs["Restaurants"],
        "name",
        "Meal for 2 People, Mid-range Restaurant, Three-course",
    )
    normal_restaurant.mean /= 2
    normal_restaurant.low /= 2
    normal_restaurant.high /= 2
    cappuccino = find(
        extra.costs["Restaurants"],
        "name",
        "Cappuccino (regular)",
    )
    domestic_bear_restaurant = find(
        extra.costs["Restaurants"],
        "name",
        "Domestic Beer (0.5 liter draught)",
    )
    imported_bear_restaurant = find(
        extra.costs["Restaurants"],
        "name",
        "Imported Beer (0.33 liter bottle)",
    )
    domestic_bear_market = find(
        extra.costs["Markets"],
        "name",
        "Domestic Beer (0.5 liter bottle)",
    )
    chicken = find(
        extra.costs["Markets"],
        "name",
        "Chicken Fillets (1kg)",
    )
    potato = find(
        extra.costs["Markets"],
        "name",
        "Potato (1kg)",
    )
    data["outings"] = [
        add_costs(
            "Frugal",
            budget.outings,
            budget.people,
            fast_food,
            domestic_bear_market,
            chicken,
            potato,
        ),
        add_costs(
            "Normal",
            budget.outings,
            budget.people,
            cheap_restaurant,
            domestic_bear_restaurant,
            cappuccino,
        ),
        add_costs(
            "Lavish",
            budget.outings,
            budget.people,
            normal_restaurant,
            cappuccino,
            imported_bear_restaurant,
        ),
    ]

    return data


def get_recommendations(budget: BudgetRequest, location: str, currency: Currency):
    recommendations = []
    for city_name, city in get_cities().items():
        if location == city_name:
            recommendation = Recommendation(city=city, budget=budget, data=[])
            recommendations.append(recommendation)
            continue
        extra = get_extra_data(city_name, currency.value)
        relevant_extra = get_relevant_recommendation_data(
            budget, location, currency, extra
        )
        recommendation = Recommendation(city=city, budget=budget, data=relevant_extra)
        recommendations.append(recommendation)
    return RecommendationResponse(recommendations=recommendations)
