import { Brain } from 'lucide-react'

export default function BidBreakdown({ lastMessage, config }) {
  if (!lastMessage) {
    return (
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="font-bold text-gray-900 mb-4">Bid Breakdown</h3>
        <p className="text-gray-500 text-center py-8">Waiting for auction data...</p>
      </div>
    )
  }

  const req = lastMessage.request || {}
  const bidCalc = lastMessage.bid_calculation || {}
  const koa = lastMessage.koa || {}
  const value = bidCalc.calculated_value ?? 0

  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <h3 className="font-bold text-gray-900 mb-4">Bid Breakdown</h3>
      <div className="mb-4">
        <div className="text-sm font-semibold text-gray-700 mb-2">
          Current Auction: #{lastMessage.auction_id?.replace('req_', '') ?? '—'} {req.site ?? ''}
        </div>
      </div>

      <div className="space-y-2 mb-4 bg-gray-50 p-4 rounded">
        <div className="flex justify-between text-sm">
          <span className="text-gray-700">Base Bid</span>
          <span className="font-semibold text-gray-900">${(bidCalc.base_bid ?? 0).toFixed(2)}</span>
        </div>
        {(bidCalc.audience_breakdown || []).map((a) => (
          <div key={a.segment} className="flex justify-between text-sm pl-4">
            <span className="text-gray-600">× Audience ({a.segment})</span>
            <span className="text-gray-700">{a.factor}x</span>
          </div>
        ))}
        <div className="flex justify-between text-sm pl-4">
          <span className="text-gray-600">× Geography ({bidCalc.geo})</span>
          <span className="text-gray-700">{bidCalc.geo_factor}x</span>
        </div>
        <div className="border-t border-gray-300 pt-2 mt-2">
          <div className="flex justify-between text-sm font-semibold">
            <span className="text-gray-700">Calculated Value</span>
            <span className="text-gray-900">${value.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {(config?.koa_enabled && koa) && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-purple-900">AI Optimization:</span>
          </div>
          <div className="text-sm text-gray-700 space-y-1">
            <p className="italic">&quot;{koa.explanation || '—'}&quot;</p>
          </div>
        </div>
      )}
    </div>
  )
}
