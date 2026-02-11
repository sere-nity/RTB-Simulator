export default function Tile({ id, label, subtitle, symbol, onClick }) {
  return (
    <button type="button" className="tile" onClick={() => onClick(id)}>
      <span className="tile-symbol">{symbol}</span>
      <span className="tile-value">{label}</span>
      {subtitle && <span className="tile-sub">{subtitle}</span>}
    </button>
  )
}
