export default function AuctionFeed({ feed }) {
  const deviceEmoji = (d) => (d === 'mobile' ? '📱' : '💻')
  const geoFlag = (g) => ({ UK: '🇬🇧', US: '🇺🇸', EU: '🇪🇺' }[g] || g)

  return (
    <div className="auction-feed">
      {feed.length === 0 && <p className="feed-empty">(waiting for auctions…)</p>}
      {feed.map((item) => {
        const req = item.request || {}
        const res = item.result || {}
        const koa = item.koa || {}
        const bidCalc = item.bid_calculation || {}
        const value = bidCalc.calculated_value
        const bid = koa.final_bid ?? value
        const won = res.won
        const savings = won ? (value - (res.clearing_price || bid)).toFixed(2) : null

        return (
          <div key={item.auction_id || item.request?.id} className={`feed-card ${won ? 'won' : 'lost'}`}>
            <div className="feed-card-header">
              <span className="feed-id">#{item.auction_id?.replace('req_', '') ?? '—'}</span>
              <span className="feed-site">{req.site ?? '—'}</span>
            </div>
            <div className="feed-meta">
              {deviceEmoji(req.device)} {req.device} | {geoFlag(req.geo)} {req.geo}
            </div>
            <div className="feed-segments">segments: {(req.segments || []).join(', ') || '—'}</div>
            <div className="feed-numbers">
              <div>Value: ${value ?? '—'}</div>
              <div>Bid: ${(bid ?? 0).toFixed(2)} {won ? '✓' : ''}</div>
              <div className="feed-result">
                {won ? `WON - saved $${savings}` : 'LOST - below floor'}
              </div>
            </div>
          </div>
        )
      })}
      {feed.length > 0 && <p className="feed-more">(more auctions…)</p>}
    </div>
  )
}
