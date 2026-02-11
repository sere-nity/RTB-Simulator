import { Info } from 'lucide-react'

export default function ForecastSupport({ forecast, configMeta }) {
  const budget = forecast?.budget ?? configMeta?.budget ?? 1000
  const spent = forecast?.spent ?? configMeta?.spent ?? 0
  const daysLeft = forecast?.days_left ?? 21
  const daysTotal = forecast?.days_total ?? 60
  const forecastedSpend = forecast?.forecasted_spend ?? spent * 1.3
  const isAboveBudget = forecastedSpend > budget
  const decisionPowerFill = forecast?.decision_power_fill ?? 0.5
  const decisionPowerScore = forecast?.decision_power_score ?? 1
  const relevance = forecast?.relevance ?? 5

  const circumference = 2 * Math.PI * 28
  const strokeDashoffset = circumference * (1 - decisionPowerFill)

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 my-4">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Forecast Support</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Flight</div>
          <div className="text-3xl font-bold text-gray-900">{daysLeft} days left</div>
          <div className="text-sm text-gray-600">{daysTotal} days total</div>
        </div>

        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Current Spend</div>
          <div className="text-3xl font-bold text-gray-900">${Number(spent).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          <div className="text-sm text-gray-600">${Number(budget).toLocaleString()} budget</div>
        </div>

        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Forecasted Spend</div>
          <div className={`text-3xl font-bold ${isAboveBudget ? 'text-red-600' : 'text-gray-900'}`}>
            ${Number(forecastedSpend).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1 text-sm">
            <span className={`w-2 h-2 rounded-full ${isAboveBudget ? 'bg-red-500' : 'bg-green-500'}`} />
            <span className={isAboveBudget ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
              {isAboveBudget ? 'Above budget' : 'On track'}
            </span>
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Decision Power</div>
          <div className="flex items-center gap-2">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="28" stroke="#e5e7eb" strokeWidth="6" fill="none" />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="#10b981"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-900">{decisionPowerScore}</span>
              </div>
            </div>
            <button type="button" className="text-blue-600 hover:text-blue-700" title="More info">
              <Info className="w-4 h-4" />
            </button>
          </div>
          <div className="text-xs text-gray-600 mt-1">More info</div>
        </div>

        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Relevance</div>
          <div className="text-3xl font-bold text-gray-900">{relevance}x</div>
        </div>
      </div>
    </div>
  )
}
