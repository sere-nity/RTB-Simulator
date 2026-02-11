"""Bid calculation, Koa logic, and auction execution."""

import random
from typing import Any

# Rolling average for predictive clearing (module-level for Koa)
recent_clearings: list[float] = []


def generate_bid_request() -> dict[str, Any]:
    sites = ["espn.com", "bbc.co.uk", "techcrunch.com", "nytimes.com", "reddit.com"]
    devices = ["mobile", "desktop"]
    geos = ["UK", "US", "EU"]
    all_segments = ["sports_fan", "high_income", "tech_enthusiast", "young_adult"]

    return {
        "id": f"req_{random.randint(10000, 99999)}",
        "site": random.choice(sites),
        "device": random.choice(devices),
        "geo": random.choice(geos),
        "segments": random.sample(all_segments, k=random.randint(1, 3)),
        "floor_price": round(random.uniform(1.0, 3.0), 2),
    }


def calculate_bid(request: dict[str, Any], config: dict[str, Any]) -> dict[str, Any]:
    base = config["base_bid"]

    # Apply audience factors (only for enabled segments that match request)
    audience_multiplier = 1.0
    audience_breakdown = []
    audience_enabled = config.get("audience_enabled", {})
    for segment in request["segments"]:
        if segment in config["audience_factors"] and audience_enabled.get(segment, True):
            factor = config["audience_factors"][segment]
            audience_multiplier *= factor
            audience_breakdown.append({"segment": segment, "factor": factor})

    # Apply geo factor (only if region is enabled)
    geo_enabled = config.get("geo_enabled", {})
    geo_factor = 1.0
    if geo_enabled.get(request["geo"], True):
        geo_factor = config["geo_factors"].get(request["geo"], 1.0)

    # Calculate raw value
    calculated_value = base * audience_multiplier * geo_factor
    calculated_value = min(calculated_value, config["max_bid"])

    return {
        "base_bid": base,
        "audience_breakdown": audience_breakdown,
        "audience_multiplier": round(audience_multiplier, 2),
        "geo": request["geo"],
        "geo_factor": geo_factor,
        "calculated_value": round(calculated_value, 2),
    }


def apply_koa(calculated_value: float, config: dict[str, Any]) -> dict[str, Any]:
    global recent_clearings

    if not config.get("koa_enabled", True):
        return {
            "enabled": False,
            "final_bid": calculated_value,
            "explanation": "Koa is OFF. Bidding full calculated value.",
            "savings": 0,
            "predicted_clearing": None,
        }

    # Predict clearing price (rolling average + noise)
    if len(recent_clearings) > 5:
        avg_clearing = sum(recent_clearings[-10:]) / len(recent_clearings[-10:])
        predicted_clearing = avg_clearing * random.uniform(0.9, 1.1)
    else:
        predicted_clearing = calculated_value * 0.75

    predicted_clearing = round(predicted_clearing, 2)

    # Bid just above predicted clearing
    smart_bid = min(predicted_clearing * 1.05, calculated_value)
    smart_bid = round(smart_bid, 2)

    savings = round(calculated_value - smart_bid, 2)

    explanation = (
        f"Predicted clearing: ${predicted_clearing:.2f}. "
        f"Bidding ${smart_bid:.2f} to win while saving ${savings:.2f} per impression."
    )

    return {
        "enabled": True,
        "predicted_clearing": predicted_clearing,
        "final_bid": smart_bid,
        "savings": savings,
        "explanation": explanation,
    }


def run_auction(final_bid: float, floor_price: float) -> dict[str, Any]:
    global recent_clearings

    won = final_bid >= floor_price

    if won:
        clearing_price = floor_price
        recent_clearings.append(clearing_price)
        if len(recent_clearings) > 50:
            recent_clearings = recent_clearings[-50:]

    return {
        "won": won,
        "clearing_price": floor_price if won else None,
    }
