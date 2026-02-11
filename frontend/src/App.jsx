import { useState, useEffect } from 'react'
import CampaignHeader from './components/CampaignHeader'
import TileGrid from './components/TileGrid'
import AuctionFeed from './components/AuctionFeed'
import BidBreakdown from './components/BidBreakdown'
import Metrics from './components/Metrics'
import TileModal from './components/TileModal'
import { useWebSocket } from './hooks/useWebSocket'

const API_BASE = ''

async function fetchConfig() {
  const res = await fetch(`${API_BASE}/config`)
  if (!res.ok) throw new Error('Failed to fetch config')
  return res.json()
}

async function updateConfig(patch) {
  const res = await fetch(`${API_BASE}/config`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  })
  if (!res.ok) throw new Error('Failed to update config')
  return res.json()
}

export default function App() {
  const { lastMessage, metrics, feed, connected } = useWebSocket()
  const [config, setConfig] = useState(null)
  const [modalTile, setModalTile] = useState(null)

  useEffect(() => {
    fetchConfig().then(setConfig).catch(console.error)
  }, [])

  const handleSaveConfig = async (patch) => {
    try {
      const next = await updateConfig(patch)
      setConfig(next)
    } catch (e) {
      console.error(e)
    }
  }

  if (!config) {
    return (
      <div className="app-loading">
        <span>Loading campaign config…</span>
      </div>
    )
  }

  return (
    <div className="app">
      <CampaignHeader
        name={config.meta?.name ?? 'Campaign'}
        budget={config.meta?.budget ?? 1000}
        spent={config.meta?.spent ?? 0}
        live={connected}
      />

      <main className="app-main">
        <div className="left-column">
          <section className="panel campaign-config">
            <h2>CAMPAIGN CONFIG</h2>
            <TileGrid
              config={config}
              onTileClick={setModalTile}
            />
            <p className="config-hint">(click any tile to configure)</p>
          </section>
          <section className="panel bid-breakdown-panel">
            <h2>BID BREAKDOWN</h2>
            <BidBreakdown lastMessage={lastMessage} />
          </section>
        </div>
        <div className="right-column">
          <section className="panel auction-feed-panel">
            <h2>LIVE AUCTION FEED</h2>
            <AuctionFeed feed={feed} />
          </section>
          <section className="panel metrics-panel-wrap">
            <h2>METRICS</h2>
            <Metrics metrics={metrics} />
          </section>
        </div>
      </main>

      {modalTile && (
        <TileModal
          tile={modalTile}
          config={config}
          metrics={metrics}
          onClose={() => setModalTile(null)}
          onSave={(patch) => {
            handleSaveConfig(patch)
            setModalTile(null)
          }}
        />
      )}
    </div>
  )
}
