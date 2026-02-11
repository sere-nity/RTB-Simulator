import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export default function TileModal({ tile, config, metrics, onClose, onSave }) {
  const [local, setLocal] = useState(null)

  useEffect(() => {
    setLocal({
      base_bid: config.base_bid,
      max_bid: config.max_bid,
      audience_factors: { ...(config.audience_factors || {}) },
      audience_enabled: { ...(config.audience_enabled || {}) },
      geo_factors: { ...(config.geo_factors || {}) },
      geo_enabled: { ...(config.geo_enabled || {}) },
      koa_enabled: config.koa_enabled,
    })
  }, [tile, config])

  if (!local) return null

  const handleSave = () => {
    if (tile === 'Bb') onSave({ base_bid: local.base_bid, max_bid: local.max_bid })
    else if (tile === 'Au') onSave({ audience_factors: local.audience_factors, audience_enabled: local.audience_enabled })
    else if (tile === 'G') onSave({ geo_factors: local.geo_factors, geo_enabled: local.geo_enabled })
    else if (tile === 'K') onSave({ koa_enabled: local.koa_enabled })
  }

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        {tile === 'Bb' && (
          <>
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-bold text-gray-900">Base Bid Settings</h3>
              <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Base Bid: ${local.base_bid.toFixed(2)}</label>
                <input
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.1"
                  value={local.base_bid}
                  onChange={(e) => setLocal((l) => ({ ...l, base_bid: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Bid:</label>
                <input
                  type="number"
                  value={local.max_bid}
                  onChange={(e) => setLocal((l) => ({ ...l, max_bid: parseFloat(e.target.value) }))}
                  step="0.5"
                  min="1"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div className="bg-gray-50 rounded p-4 text-sm text-gray-600">
                This is your starting bid before audience and geo multipliers are applied.
              </div>
            </div>
          </>
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
              <h3 className="text-lg font-bold text-gray-900">Koa AI Optimization</h3>
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
