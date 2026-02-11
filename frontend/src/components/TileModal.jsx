import { useState, useEffect } from 'react'

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
    if (tile === 'Bb') {
      onSave({ base_bid: local.base_bid, max_bid: local.max_bid })
    } else if (tile === 'Au') {
      onSave({
        audience_factors: local.audience_factors,
        audience_enabled: local.audience_enabled,
      })
    } else if (tile === 'G') {
      onSave({
        geo_factors: local.geo_factors,
        geo_enabled: local.geo_enabled,
      })
    } else if (tile === 'K') {
      onSave({ koa_enabled: local.koa_enabled })
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {tile === 'Bb' && (
          <>
            <div className="modal-header">
              <h3>Base Bid Settings</h3>
              <button type="button" className="modal-close" onClick={onClose}>×</button>
            </div>
            <div className="modal-body">
              <label>
                Base Bid: <input type="number" step="0.01" min="0" value={local.base_bid} onChange={(e) => setLocal((l) => ({ ...l, base_bid: Number(e.target.value) }))} />
              </label>
              <label>
                Max Bid: <input type="number" step="0.01" min="0" value={local.max_bid} onChange={(e) => setLocal((l) => ({ ...l, max_bid: Number(e.target.value) }))} />
              </label>
              <p className="modal-desc">This is your starting bid before audience and geo multipliers are applied.</p>
            </div>
          </>
        )}

        {tile === 'Au' && (
          <>
            <div className="modal-header">
              <h3>Audience Targeting</h3>
              <button type="button" className="modal-close" onClick={onClose}>×</button>
            </div>
            <div className="modal-body">
              <div className="audience-rows">
                {Object.entries(local.audience_factors || {}).map(([seg, factor]) => (
                  <div key={seg} className="audience-row">
                    <label>
                      <input type="checkbox" checked={local.audience_enabled[seg]} onChange={(e) => setLocal((l) => ({ ...l, audience_enabled: { ...l.audience_enabled, [seg]: e.target.checked } }))} />
                      {seg}
                    </label>
                    <input type="number" step="0.1" min="0" value={factor} onChange={(e) => setLocal((l) => ({ ...l, audience_factors: { ...l.audience_factors, [seg]: Number(e.target.value) } }))} />
                    <span>×</span>
                  </div>
                ))}
              </div>
              <p className="combined-mult">Combined multiplier: {Object.keys(local.audience_factors || {}).reduce((m, k) => (local.audience_enabled[k] ? m * local.audience_factors[k] : m), 1).toFixed(1)}×</p>
            </div>
          </>
        )}

        {tile === 'G' && (
          <>
            <div className="modal-header">
              <h3>Geography Targeting</h3>
              <button type="button" className="modal-close" onClick={onClose}>×</button>
            </div>
            <div className="modal-body">
              <div className="geo-rows">
                {Object.entries(local.geo_factors || {}).map(([region, factor]) => (
                  <div key={region} className="geo-row">
                    <label>
                      <input type="checkbox" checked={local.geo_enabled[region]} onChange={(e) => setLocal((l) => ({ ...l, geo_enabled: { ...l.geo_enabled, [region]: e.target.checked } }))} />
                      {region}
                    </label>
                    <input type="number" step="0.1" min="0" value={factor} onChange={(e) => setLocal((l) => ({ ...l, geo_factors: { ...l.geo_factors, [region]: Number(e.target.value) } }))} />
                    <span>×</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {tile === 'K' && (
          <>
            <div className="modal-header">
              <h3>Koa AI Optimization</h3>
              <button type="button" className="modal-close" onClick={onClose}>×</button>
            </div>
            <div className="modal-body">
              <div className="koa-toggle">
                <span>Koa Status:</span>
                <button type="button" className={local.koa_enabled ? 'toggle on' : 'toggle'} onClick={() => setLocal((l) => ({ ...l, koa_enabled: true }))}>ON 🟢</button>
                <button type="button" className={!local.koa_enabled ? 'toggle off' : 'toggle'} onClick={() => setLocal((l) => ({ ...l, koa_enabled: false }))}>OFF ⚪</button>
              </div>
              <p>When ON, Koa will:</p>
              <ul>
                <li>Predict auction clearing prices</li>
                <li>Bid just enough to win</li>
                <li>Save budget while maintaining wins</li>
              </ul>
              <p className="current-savings">Current savings: ${(metrics?.total_savings ?? 0).toFixed(2)}</p>
            </div>
          </>
        )}

        <div className="modal-footer">
          <button type="button" className="btn-save" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  )
}
