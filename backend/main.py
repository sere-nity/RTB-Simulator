from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from datetime import datetime

from config import DEFAULT_CAMPAIGN_CONFIG, CAMPAIGN_META
from auction_engine import (
    generate_bid_request,
    calculate_bid,
    apply_koa,
    run_auction,
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Campaign config (will be updated via API)
campaign_config = {**DEFAULT_CAMPAIGN_CONFIG}
campaign_meta = {**CAMPAIGN_META}

# Track metrics
metrics = {
    "auctions": 0,
    "wins": 0,
    "total_savings": 0,
}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    global metrics
    await websocket.accept()

    try:
        while True:
            request = generate_bid_request()
            bid_calc = calculate_bid(request, campaign_config)
            koa_result = apply_koa(bid_calc["calculated_value"], campaign_config)
            auction_result = run_auction(koa_result["final_bid"], request["floor_price"])

            metrics["auctions"] += 1
            if auction_result["won"]:
                metrics["wins"] += 1
                metrics["total_savings"] += koa_result["savings"]

            result = {
                "auction_id": request["id"],
                "timestamp": datetime.now().isoformat(),
                "request": request,
                "bid_calculation": bid_calc,
                "koa": koa_result,
                "result": auction_result,
                "metrics": {
                    "auctions": metrics["auctions"],
                    "wins": metrics["wins"],
                    "win_rate": round(metrics["wins"] / metrics["auctions"] * 100, 1) if metrics["auctions"] > 0 else 0,
                    "total_savings": round(metrics["total_savings"], 2),
                    "avg_savings": round(metrics["total_savings"] / metrics["wins"], 2) if metrics["wins"] > 0 else 0,
                },
            }

            await websocket.send_json(result)
            await asyncio.sleep(1.5)

    except Exception as e:
        print(f"WebSocket error: {e}")


@app.get("/config")
async def get_config():
    return {**campaign_config, "meta": campaign_meta}


@app.post("/config")
async def update_config(new_config: dict):
    global campaign_config
    if "meta" in new_config:
        campaign_meta.update(new_config.pop("meta"))
    campaign_config.update(new_config)
    return {**campaign_config, "meta": campaign_meta}


@app.get("/metrics")
async def get_metrics():
    return metrics


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
