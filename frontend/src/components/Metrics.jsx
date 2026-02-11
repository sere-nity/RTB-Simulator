export default function Metrics({ metrics }) {
  const m = metrics || {}
  return (
    <div className="metrics-panel">
      <div className="metric-row">
        <span>Auctions:</span>
        <span>{m.auctions ?? 0}</span>
      </div>
      <div className="metric-row">
        <span>Wins:</span>
        <span>{m.wins ?? 0} ({m.win_rate ?? 0}%)</span>
      </div>
      <div className="metric-row">
        <span>Avg Savings:</span>
        <span>${(m.avg_savings ?? 0).toFixed(2)}</span>
      </div>
      <div className="metric-row">
        <span>Total Saved:</span>
        <span>${(m.total_savings ?? 0).toFixed(2)}</span>
      </div>
    </div>
  )
}
