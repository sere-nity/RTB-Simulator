export default function Metrics({ metrics }) {
  const m = metrics || {}
  const total = m.auctions ?? 0
  const wins = m.wins ?? 0
  const winRate = total > 0 ? (wins / total) * 100 : 0
  const avgSavings = m.avg_savings ?? 0
  const totalSavings = m.total_savings ?? 0

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h3 className="font-bold text-gray-900 mb-4">Metrics</h3>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <div className="text-sm text-gray-600 mb-1">Auctions:</div>
          <div className="text-2xl font-bold text-gray-900">{total}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">Wins:</div>
          <div className="text-2xl font-bold text-gray-900">
            {wins} <span className="text-base text-gray-600">({winRate.toFixed(0)}%)</span>
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">Avg Savings:</div>
          <div className="text-2xl font-bold text-green-600">${avgSavings.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">Total Saved:</div>
          <div className="text-2xl font-bold text-green-600">${totalSavings.toFixed(2)}</div>
        </div>
      </div>
    </div>
  )
}
