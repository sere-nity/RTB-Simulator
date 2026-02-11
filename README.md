# RTB Auction Simulator

Demonstrating The Trade Desk's Kokai bidding system: base bid × audience × geo, with Koa AI optimization.

## Quick start

### Backend (FastAPI + WebSocket)

Use a virtual environment (recommended):

```bash
cd backend
python3 -m venv venv
source venv/bin/activate   # on Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

Runs at **http://localhost:8000**. WebSocket: **ws://localhost:8000/ws**.

### Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Runs at **http://localhost:5173**. The dev server proxies `/ws` and `/config` to the backend, so start the backend first.

### Test WebSocket

Open `ws://localhost:8000/ws` in a WebSocket client or browser console to see streaming auction results.

## Layout

- **Campaign config**: Base bid (Bb), Audience (Au), Geography (G), Koa (K) tiles — click any tile to open its modal.
- **Live auction feed**: Real-time auction results (value, bid, won/lost).
- **Bid breakdown**: Current auction’s base × audience × geo and Koa explanation.
- **Metrics**: Auctions, wins, win rate, avg/total savings.

## API

- `GET /config` — campaign config + meta
- `POST /config` — update config (JSON body)
- `GET /metrics` — current metrics
- `WS /ws` — stream of auction events (JSON per message)
