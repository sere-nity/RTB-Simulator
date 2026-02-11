"""Default campaign settings for RTB Simulator."""

DEFAULT_CAMPAIGN_CONFIG = {
    "base_bid": 2.00,
    "max_bid": 5.00,
    "audience_factors": {
        "sports_fan": 1.5,
        "high_income": 1.2,
        "tech_enthusiast": 1.3,
        "young_adult": 1.1,
    },
    "audience_enabled": {
        "sports_fan": True,
        "high_income": True,
        "tech_enthusiast": False,
        "young_adult": False,
    },
    "geo_factors": {
        "UK": 0.9,
        "US": 1.2,
        "EU": 1.0,
    },
    "geo_enabled": {
        "UK": True,
        "US": True,
        "EU": False,
    },
    "koa_enabled": True,
}

CAMPAIGN_META = {
    "name": "Holiday Shopping",
    "budget": 1000,
    "spent": 0,
}
