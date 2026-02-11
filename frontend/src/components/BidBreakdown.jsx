export default function BidBreakdown({ lastMessage }) {
  if (!lastMessage) {
    return (
      <div className="bid-breakdown">
        <p>Current Auction: —</p>
        <p className="muted">Connect to see live bid breakdown.</p>
      </div>
    )
  }

  const req = lastMessage.request || {}
  const bidCalc = lastMessage.bid_calculation || {}
  const koa = lastMessage.koa || {}

  const value = bidCalc.calculated_value
  const bid = koa.final_bid ?? value

  return (
    <div className="bid-breakdown">
      <p className="current-auction">
        Current Auction: #{lastMessage.auction_id?.replace('req_', '') ?? '—'} {req.site ?? ''}
      </p>
      <div className="breakdown-lines">
        <div>Base Bid &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${(bidCalc.base_bid ?? 0).toFixed(2)}</div>
        {(bidCalc.audience_breakdown || []).map((a) => (
          <div key={a.segment}>× Audience ({a.segment}) &nbsp; {a.factor}×</div>
        ))}
        <div>× Geography ({bidCalc.geo}) &nbsp; {bidCalc.geo_factor}×</div>
      </div>
      <div className="breakdown-sep">─────────────────────────────────</div>
      <div className="breakdown-value">Calculated Value &nbsp;&nbsp; ${(value ?? 0).toFixed(2)}</div>

      <div className="koa-section">
        <p className="koa-label">🧠 Koa Optimization:</p>
        <p className="koa-explanation">&quot;{koa.explanation || '—'}&quot;</p>
        {koa.enabled && koa.confidence != null && (
          <p className="koa-confidence">Confidence: {koa.confidence}%</p>
        )}
      </div>
    </div>
  )
}
