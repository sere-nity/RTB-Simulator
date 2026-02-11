export default function Tile({ id, label, subtitle, symbol, colorClass, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      className={`border-2 rounded-lg p-4 hover:shadow-md transition-all text-center ${colorClass}`}
    >
      <div className="text-3xl font-bold mb-2">{symbol}</div>
      <div className="text-2xl font-bold text-gray-900 mb-2">{label}</div>
      <div className="text-xs text-gray-600">{subtitle}</div>
    </button>
  )
}
