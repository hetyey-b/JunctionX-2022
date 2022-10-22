import datetime
from enum import Enum

from pydantic import BaseModel


class Currency(Enum):
    EUR = "EUR"
    HUF = "HUF"


class Cost(BaseModel):
    name: str
    mean: float
    low: float
    high: float


class CityExtraData(BaseModel):
    name: str
    currency: Currency
    costs: dict[str, list[Cost]]


class City(BaseModel):
    name: str
    country: str
    lat: float
    long: float


class CityResponse(BaseModel):
    city: City
    extra: CityExtraData


class CitiesResponse(BaseModel):
    cities: list[CityResponse]


class Travel(BaseModel):
    time: str
    currency: Currency
    cost: float


class TravelResponse(BaseModel):
    distance: float
    airplane: Travel
    car: Travel
    transit: Travel
