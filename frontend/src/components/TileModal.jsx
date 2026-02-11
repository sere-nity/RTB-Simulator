import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

// Demo distribution: "Similar Ad Groups" % per max bid bucket ($0, $5, $10, ... $40)
const MAX_BID_BUCKETS = [0, 5, 10, 15, 20, 25, 30, 35, 40]
const SIMILAR_GROUPS_PCT = [5, 18, 35, 22, 10, 5, 3, 2] // percentages per bucket

function BbBidModal({ local, setLocal, onClose }) {
  const maxBid = local.max_bid
  const baseBid = local.base_bid
  const maxBidCap = 40

  const setMaxBid = (v) => {
    const val = Math.max(1, Math.min(maxBidCap, v))
    setLocal((l) => ({
      ...l,
      max_bid: val,
      base_bid: Math.min(l.base_bid, val),
    }))
  }
  const setBaseBid = (v) => {
    const val = Math.max(0.5, Math.min(maxBid, v))
    setLocal((l) => ({ ...l, base_bid: val }))
  }

  const highlightBar = (() => {
    const i = MAX_BID_BUCKETS.findIndex((b) => b >= maxBid)
    return i >= 0 ? i : MAX_BID_BUCKETS.length - 1
  })()

  const competitiveness = maxBid < 5 ? 'NOT COMPETITIVE' : maxBid < 15 ? 'MODERATELY COMPETITIVE' : 'HIGHLY COMPETITIVE'

  return (
    <>
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <h3 className="text-lg font-bold text-gray-900">Bid Settings</h3>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="px-6 py-6 space-y-6">
        {/* Max Bid – similar ad groups distribution + slider */}
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Similar Ad Groups (%)</p>
          <div className="flex items-end gap-0.5 h-16 mb-1" aria-hidden>
            {MAX_BID_BUCKETS.map((bucket, i) => (
              <div
                key={bucket}
                className={`flex-1 min-w-0 rounded-t transition-colors ${
                  i === highlightBar ? 'bg-blue-600' : 'bg-gray-200'
                }`}
                style={{ height: `${SIMILAR_GROUPS_PCT[i]}%` }}
                title={`$${bucket}: ${SIMILAR_GROUPS_PCT[i]}%`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 mb-2">MAX BID ($)</p>
          <div className="relative pt-6">
            <input
              type="range"
              min="1"
              max={maxBidCap}
              step="0.5"
              value={maxBid}
              onChange={(e) => setMaxBid(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div
              className="absolute -top-1 text-sm font-semibold text-gray-800 bg-gray-100 px-2 py-0.5 rounded shadow border border-gray-200 pointer-events-none"
              style={{ left: `${((maxBid - 1) / (maxBidCap - 1)) * 100}%`, transform: 'translateX(-50%)' }}
            >
              ${Number(maxBid).toFixed(0)}
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>NOT COMPETITIVE</span>
            <span>MODERATELY COMPETITIVE</span>
            <span>HIGHLY COMPETITIVE</span>
          </div>
          <p className="text-sm text-gray-600 mt-1 font-medium">{competitiveness}</p>
        </div>

        {/* Base Bid – constrained to ≤ max bid */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Base Bid: ${baseBid.toFixed(2)}
          </label>
          <input
            type="range"
            min="0.5"
            max={Math.max(0.5, maxBid)}
            step="0.1"
            value={baseBid}
            onChange={(e) => setBaseBid(parseFloat(e.target.value))}
            className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <p className="text-xs text-gray-500 mt-2">
            Starting bid before audience and geo multipliers. Must be ≤ max bid.
          </p>
        </div>
      </div>
    </>
  )
}

export default function TileModal({ tile, config, metrics, onClose, onSave }) {
  const [local, setLocal] = useState(null)

  useEffect(() => {
    const base = config.base_bid ?? 2
    const max = config.max_bid ?? 5
    setLocal({
      base_bid: Math.min(base, max),
      max_bid: max,
      audience_factors: { ...(config.audience_factors || {}) },
      audience_enabled: { ...(config.audience_enabled || {}) },
      geo_factors: { ...(config.geo_factors || {}) },
      geo_enabled: { ...(config.geo_enabled || {}) },
      koa_enabled: config.koa_enabled,
    })
  }, [tile, config])

  if (!local) return null

  const handleSave = () => {
    if (tile === 'Bb') {
      const base = Math.min(local.base_bid, local.max_bid)
      const max = local.max_bid
      onSave({ base_bid: base, max_bid: max })
    }
    else if (tile === 'Au') onSave({ audience_factors: local.audience_factors, audience_enabled: local.audience_enabled })
    else if (tile === 'G') onSave({ geo_factors: local.geo_factors, geo_enabled: local.geo_enabled })
    else if (tile === 'K') onSave({ koa_enabled: local.koa_enabled })
  }

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        {tile === 'Bb' && (
          <BbBidModal
            local={local}
            setLocal={setLocal}
            onClose={onClose}
          />
        )}

        {tile === 'Au' && (
          <>
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-bold text-gray-900">Audience Targeting</h3>
              <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-6 space-y-4">
              {Object.entries(local.audience_factors || {}).map(([seg, factor]) => (
                <div key={seg} className="flex items-center justify-between gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={local.audience_enabled[seg]}
                      onChange={(e) => setLocal((l) => ({ ...l, audience_enabled: { ...l.audience_enabled, [seg]: e.target.checked } }))}
                    />
                    <span className="text-sm font-medium text-gray-700">{seg}</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={factor}
                    onChange={(e) => setLocal((l) => ({ ...l, audience_factors: { ...l.audience_factors, [seg]: Number(e.target.value) } }))}
                    className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                  <span className="text-gray-500">×</span>
                </div>
              ))}
              <p className="text-sm font-semibold text-gray-700">
                Combined multiplier: {Object.keys(local.audience_factors || {}).reduce((m, k) => (local.audience_enabled[k] ? m * local.audience_factors[k] : m), 1).toFixed(1)}×
              </p>
            </div>
          </>
        )}

        {tile === 'G' && (
          <>
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-bold text-gray-900">Geography Targeting</h3>
              <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-6 space-y-4">
              {Object.entries(local.geo_factors || {}).map(([region, factor]) => (
                <div key={region} className="flex items-center justify-between gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={local.geo_enabled[region]}
                      onChange={(e) => setLocal((l) => ({ ...l, geo_enabled: { ...l.geo_enabled, [region]: e.target.checked } }))}
                    />
                    <span className="text-sm font-medium text-gray-700">{region}</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={factor}
                    onChange={(e) => setLocal((l) => ({ ...l, geo_factors: { ...l.geo_factors, [region]: Number(e.target.value) } }))}
                    className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                  <span className="text-gray-500">×</span>
                </div>
              ))}
            </div>
          </>
        )}

        {tile === 'K' && (
          <>
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-bold text-gray-900">AI Optimization</h3>
              <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Koa Status:</span>
                <button
                  type="button"
                  onClick={() => setLocal((l) => ({ ...l, koa_enabled: true }))}
                  className={`px-4 py-2 rounded font-medium text-sm ${local.koa_enabled ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  ON
                </button>
                <button
                  type="button"
                  onClick={() => setLocal((l) => ({ ...l, koa_enabled: false }))}
                  className={`px-4 py-2 rounded font-medium text-sm ${!local.koa_enabled ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  OFF
                </button>
              </div>
              <p className="text-sm text-gray-600">When ON, Koa will:</p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Predict auction clearing prices</li>
                <li>Bid just enough to win</li>
                <li>Save budget while maintaining wins</li>
              </ul>
              <p className="text-sm font-semibold text-gray-900">Current savings: ${(metrics?.total_savings ?? 0).toFixed(2)}</p>
            </div>
          </>
        )}

        <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-medium"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
