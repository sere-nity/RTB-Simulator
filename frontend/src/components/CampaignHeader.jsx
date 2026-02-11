export default function CampaignHeader({ live }) {
  return (
    <>
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-blue-400 rounded-full" />
          <h1 className="text-2xl font-bold">RTB Auction Simulator</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm opacity-90">Live</span>
          {live ? (
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          ) : (
            <div className="w-2 h-2 bg-gray-400 rounded-full" />
          )}
        </div>
      </div>
      <div className="bg-white px-6 py-2 border-b border-gray-200">
        <p className="text-sm text-gray-600">Demonstrating The Trade Desk&apos;s Kokai bidding system</p>
      </div>
    </>
  )
}
