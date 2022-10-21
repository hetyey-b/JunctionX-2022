import csv
import time

import requests

from server.app.database import (
    create_city,
    get_cities,
    create_city_extra,
    has_extra_data,
)
from server.app.shemas import Cost, Currency

CITIES = "cities.csv"


def load_cities():
    with open(CITIES, "r", encoding="utf-8") as f:
        headers = None
        for line in csv.reader(f.readlines()):
            if headers is None:
                headers = line
                continue
            create_city(line[1], line[2], float(line[3]), float(line[4]))
    print(f"{len(get_cities())} cities loaded!")


rorm = True


def category_map(cost: str):
    if cost == "Imported Beer (0.33 liter bottle)":
        if rorm:
            return "Restaurants"
        else:
            return "Markets"

    return {
        "Meal, Inexpensive Restaurant": "Restaurants",
        "Meal for 2 People, Mid-range Restaurant, Three-course": "Restaurants",
        "McMeal at McDonalds (or Equivalent Combo Meal)": "Restaurants",
        "Domestic Beer (0.5 liter draught)": "Restaurants",
        "Cappuccino (regular)": "Restaurants",
        "Coke/Pepsi (0.33 liter bottle)": "Restaurants",
        "Water (0.33 liter bottle)": "Restaurants",
        "Milk (regular), (1 liter)": "Markets",
        "Loaf of Fresh White Bread (500g)": "Markets",
        "Rice (white), (1kg)": "Markets",
        "Eggs (regular) (12)": "Markets",
        "Local Cheese (1kg)": "Markets",
        "Chicken Fillets (1kg)": "Markets",
        "Beef Round (1kg) (or Equivalent Back Leg Red Meat)": "Markets",
        "Apples (1kg)": "Markets",
        "Banana (1kg)": "Markets",
        "Oranges (1kg)": "Markets",
        "Tomato (1kg)": "Markets",
        "Potato (1kg)": "Markets",
        "Onion (1kg)": "Markets",
        "Lettuce (1 head)": "Markets",
        "Water (1.5 liter bottle)": "Markets",
        "Bottle of Wine (Mid-Range)": "Markets",
        "Domestic Beer (0.5 liter bottle)": "Markets",
        "Cigarettes 20 Pack (Marlboro)": "Markets",
        "One-way Ticket (Local Transport)": "Transportation",
        "Monthly Pass (Regular Price)": "Transportation",
        "Taxi Start (Normal Tariff)": "Transportation",
        "Taxi 1km (Normal Tariff)": "Transportation",
        "Taxi 1hour Waiting (Normal Tariff)": "Transportation",
        "Gasoline (1 liter)": "Transportation",
        "Volkswagen Golf 1.4 90 KW Trendline (Or Equivalent New Car)": "Transportation",
        "Toyota Corolla Sedan 1.6l 97kW Comfort (Or Equivalent New Car)": "Transportation",
        "Basic (Electricity, Heating, Cooling, Water, Garbage) for 85m2 Apartment": "Utilities (Monthly)",
        "1 min. of Prepaid Mobile Tariff Local (No Discounts or Plans)": "Utilities (Monthly)",
        "Internet (60 Mbps or More, Unlimited Data, Cable/ADSL)": "Utilities (Monthly)",
        "Fitness Club, Monthly Fee for 1 Adult": "Sports And Leisure",
        "Tennis Court Rent (1 Hour on Weekend)": "Sports And Leisure",
        "Cinema, International Release, 1 Seat": "Sports And Leisure",
        "International Primary School, Yearly for 1 Child": "Childcare",
        "Preschool (or Kindergarten), Full Day, Private, Monthly for 1 Child": "Childcare",
        "1 Pair of Jeans (Levis 501 Or Similar)": "Clothing And Shoes",
        "1 Summer Dress in a Chain Store (Zara, H&M, ...)": "Clothing And Shoes",
        "1 Pair of Nike Running Shoes (Mid-Range)": "Clothing And Shoes",
        "1 Pair of Men Leather Business Shoes": "Clothing And Shoes",
        "Apartment (1 bedroom) in City Centre": "Rent Per Month",
        "Apartment (1 bedroom) Outside of Centre": "Rent Per Month",
        "Apartment (3 bedrooms) in City Centre": "Rent Per Month",
        "Apartment (3 bedrooms) Outside of Centre": "Rent Per Month",
        "Price per Square Meter to Buy Apartment in City Centre": "Buy Apartment Price",
        "Price per Square Meter to Buy Apartment Outside of Centre": "Buy Apartment Price",
        "Average Monthly Net Salary (After Tax)": "Salaries And Financing",
        "Mortgage Interest Rate in Percentages (%), Yearly, for 20 Years Fixed-Rate": "Salaries And Financing",
    }[cost]


def create_costs(data):
    costs = {}
    for cost in data["costs"]:
        name = cost["item"]
        category = category_map(name)
        mean = float(cost["cost"].replace(",", ""))
        low = 0
        high = 0
        if "range" in cost:
            if "low" in cost["range"] and cost["range"]["low"]:
                low = float(cost["range"]["low"].replace(",", ""))
            if "high" in cost["range"] and cost["range"]["high"]:
                high = float(cost["range"]["high"].replace(",", ""))
        if category not in costs:
            costs[category] = []
        costs[category].append(Cost(name=name, mean=mean, low=low, high=high))
    return costs


def get_extra_city_data(city: str, curr: str):
    print("loading ", city, curr)
    resp = requests.get(f"http://localhost:3000/:{city}?currency={curr}")
    data = resp.json()
    name = data["city"]
    currency = data["currency"]
    costs = create_costs(data)
    create_city_extra(name=name, currency=Currency(currency), costs=costs)


if __name__ == "__main__":
    load_cities()
    cities = get_cities()
    for city_name in cities:
        currencies = ["HUF", "EUR"]
        for curr in currencies:
            if has_extra_data(city_name, curr):
                print("already has", city_name, curr)
                continue
            get_extra_city_data(city_name, curr)
