import Tile from './Tile'

const TILES = [
  {
    id: 'Bb',
    label: (c) => `$${Number(c.base_bid).toFixed(2)}`,
    subtitle: 'Base Bid',
    symbol: 'Bb',
    colorClass: 'border-blue-200 hover:border-blue-400 bg-blue-50 text-blue-600',
  },
  {
    id: 'Au',
    label: (c) => {
      const enabled = c.audience_enabled || {}
      const factors = c.audience_factors || {}
      let mult = 1
      Object.keys(factors).forEach((k) => { if (enabled[k]) mult *= factors[k] })
      return `${mult.toFixed(1)}×`
    },
    subtitle: 'Audience',
    symbol: 'Au',
    colorClass: 'border-orange-200 hover:border-orange-400 bg-orange-50 text-orange-600',
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
    colorClass: 'border-sky-200 hover:border-sky-400 bg-sky-50 text-sky-600',
  },
  {
    id: 'K',
    label: (c) => (c.koa_enabled ? 'ON' : 'OFF'),
    subtitle: 'Koa AI',
    symbol: 'K',
    colorClass: 'border-gray-300 hover:border-gray-400 bg-gray-100 text-gray-700',
  },
]

export default function TileGrid({ config, onTileClick }) {
  const budget = config.meta?.budget ?? 0
  const spent = config.meta?.spent ?? 0
  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Campaign Config  (Mini Programmatic Table)</h2>
      </div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Campaign: {config.meta?.name ?? 'Holiday Shopping'}</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Budget: ${Number(budget).toLocaleString()}</span>
          <span>|</span>
          <span>Spent: ${Number(spent).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {TILES.map((t) => (
          <Tile
            key={t.id}
            id={t.id}
            label={t.label(config)}
            subtitle={t.subtitle}
            symbol={t.symbol}
            colorClass={t.colorClass}
            onClick={onTileClick}
          />
        ))}
      </div>
      <div className="text-xs text-gray-500 text-center">(click any tile to configure)</div>
    </div>
  )
}
