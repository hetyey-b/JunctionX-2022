import datetime
from enum import Enum

from pydantic import BaseModel


class Currency(Enum):
    EUR = "EUR"
    HUF = "HUF"


class AccommodationType(Enum):
    HOTEL = "HOTEL"
    AIRBNB = "AIRBNB"


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


class CitiesResponse(BaseModel):
    cities: list[City]


class ExtraDataResponse(BaseModel):
    extra: CityExtraData


class Travel(BaseModel):
    time: str
    currency: Currency
    cost: float


class TravelResponse(BaseModel):
    distance: float
    airplane: Travel
    car: Travel
    transit: Travel


class BudgetRequest(BaseModel):
    budget: float
    people: int
    nights: int
    accommodation: AccommodationType
    outings: int


class Recommendation(BaseModel):
    city: City
    budget: BudgetRequest
    data: dict[str, list[Cost]]


class RecommendationResponse(BaseModel):
    recommendations: list[Recommendation]
