import { Smartphone, Monitor } from 'lucide-react'

export default function AuctionFeed({ feed }) {
  const deviceIcon = (d) => (d === 'mobile' ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />)

  const recent = feed.slice(0, 10)

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h3 className="font-bold text-gray-900 mb-4">Live Auction Feed</h3>
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {recent.length === 0 && (
          <div className="text-center text-gray-500 py-8">Waiting for auctions...</div>
        )}
        {recent.map((item) => {
          const req = item.request || {}
          const res = item.result || {}
          const koa = item.koa || {}
          const bidCalc = item.bid_calculation || {}
          const value = bidCalc.calculated_value ?? 0
          const bid = koa.final_bid ?? value
          const won = res.won
          const savings = won ? (value - (res.clearing_price || bid)).toFixed(2) : null
          const reason = won ? `WON - saved $${savings}` : 'LOST - below floor'
          const id = item.auction_id?.replace('req_', '') ?? '—'

          return (
            <div
              key={item.auction_id || id}
              className={`border rounded-lg p-3 text-sm ${
                won ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="font-semibold text-gray-900">#{id} {req.site ?? '—'}</div>
              </div>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                {deviceIcon(req.device)}
                <span className="text-xs">{req.device}</span>
                <span className="text-xs">|</span>
                <span className="text-xs">{req.geo ?? '—'}</span>
              </div>
              <div className="text-xs text-gray-600 mb-2">segments: {(req.segments || []).join(', ') || '—'}</div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Value:</span>
                  <span className="font-semibold text-gray-900">${value.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bid:</span>
                  <span className="font-semibold text-gray-900">${bid.toFixed(2)} {won && '✓'}</span>
                </div>
                <div className={`font-semibold text-xs ${won ? 'text-green-700' : 'text-red-700'}`}>{reason}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
