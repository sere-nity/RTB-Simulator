import Tile from './Tile'

const TILES = [
  {
    id: 'Bb',
    label: (c) => `$${Number(c.base_bid).toFixed(2)}`,
    subtitle: 'Base Bid',
    symbol: 'Bb',
  },
  {
    id: 'Au',
    label: (c) => {
      const enabled = c.audience_enabled || {}
      const factors = c.audience_factors || {}
      let mult = 1
      Object.keys(factors).forEach((k) => {
        if (enabled[k]) mult *= factors[k]
      })
      return `${mult.toFixed(0)}×`
    },
    subtitle: 'Audience',
    symbol: 'Au',
  },
  {
    id: 'G',
    label: (c) => {
      const enabled = c.geo_enabled || {}
      const regions = Object.keys(c.geo_factors || {}).filter((k) => enabled[k])
      return regions.length ? regions.join(', ') : '—'
    },
    subtitle: 'Geo',
    symbol: 'G',
  },
  {
    id: 'K',
    label: (c) => (c.koa_enabled ? 'ON' : 'OFF'),
    subtitle: 'Koa AI',
    symbol: '🧠',
  },
]

export default function TileGrid({ config, onTileClick }) {
  return (
    <div className="tile-grid">
      <div className="tile-grid-campaign">
        <p><strong>Campaign:</strong> {config.meta?.name ?? '—'}</p>
        <p><strong>Budget:</strong> ${config.meta?.budget ?? 0}  |  <strong>Spent:</strong> ${config.meta?.spent ?? 0}</p>
      </div>
      <div className="tile-row">
        {TILES.map((t) => (
          <Tile
            key={t.id}
            id={t.id}
            label={t.label(config)}
            subtitle={t.subtitle}
            symbol={t.symbol}
            onClick={onTileClick}
          />
        ))}
      </div>
      <div className="tile-labels">
        <span>Base Bid</span>
        <span>Audience</span>
        <span>Geo</span>
        <span>Koa AI</span>
      </div>
    </div>
  )
}
