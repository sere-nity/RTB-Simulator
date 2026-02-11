export default function CampaignHeader({ name, budget, spent, live }) {
  return (
    <header className="campaign-header">
      <div className="header-left">
        <span className="logo">🔵 RTB Auction Simulator</span>
        {live && (
          <>
            <span className="live-badge">Live</span>
            <span className="live-dot" title="Connected">🟢</span>
          </>
        )}
      </div>
      <p className="tagline">
        Demonstrating The Trade Desk&apos;s Kokai bidding system
      </p>
    </header>
  )
}
