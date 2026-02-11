import { useState, useEffect } from 'react'
import CampaignHeader from './components/CampaignHeader'
import ForecastSupport from './components/ForecastSupport'
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
  const { lastMessage, metrics, forecast, feed, connected } = useWebSocket()
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <span className="text-gray-500">Loading campaign config…</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <CampaignHeader live={connected} />

        <ForecastSupport forecast={forecast} configMeta={config.meta} />

        <div className="bg-white rounded-b-lg border border-gray-200 border-t-0 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <TileGrid
                config={{
                  ...config,
                  meta: forecast ? { ...config.meta, spent: forecast.spent } : config.meta,
                }}
                onTileClick={setModalTile}
              />
              <BidBreakdown lastMessage={lastMessage} config={config} />
            </div>
            <div className="space-y-6">
              <AuctionFeed feed={feed} />
              <Metrics metrics={metrics} />
            </div>
          </div>
        </div>
      </div>

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
