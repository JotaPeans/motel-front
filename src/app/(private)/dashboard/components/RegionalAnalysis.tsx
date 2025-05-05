"use client"

interface RegionalAnalysisProps {
  data: {
    total: number
    percentages: Array<{ label: string; description: string }>
    regions: Array<{ name: string; value: number }>
  }
}

export function RegionalAnalysis({ data }: RegionalAnalysisProps) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 h-[300px]">
      <div className="flex flex-col items-center justify-center gap-4">
        {data.percentages.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="bg-zinc-800 border border-zinc-700 p-2 rounded-lg">
              <div className="text-xl font-bold">{item.label}</div>
              <div className="text-xs text-zinc-400">{item.description}</div>
            </div>
          </div>
        ))}
        <div className="bg-white text-black rounded-full p-4 flex items-center justify-center w-24 h-24">
          <div className="text-center">
            <div className="text-2xl font-bold">{data.total}</div>
          </div>
        </div>
      </div>

      <div className="relative w-full h-full flex items-center justify-center">
        <svg viewBox="0 0 400 400" className="w-full h-full">
          {/* Simplified Brazil map outline */}
          <path
            d="M150,50 C100,100 80,150 100,200 C120,250 150,300 200,320 C250,340 300,320 320,270 C340,220 320,170 300,120 C280,70 200,0 150,50 Z"
            fill="#1e1e1e"
            stroke="#333"
            strokeWidth="2"
          />

          {/* Region labels */}
          <text x="120" y="100" fill="white" fontSize="12" textAnchor="middle">
            Norte
          </text>
          <text x="150" y="170" fill="white" fontSize="12" textAnchor="middle">
            Nordeste
          </text>
          <text x="200" y="200" fill="white" fontSize="12" textAnchor="middle">
            C-Oeste
          </text>
          <text x="250" y="250" fill="white" fontSize="12" textAnchor="middle">
            Sudeste
          </text>
          <text x="200" y="300" fill="white" fontSize="12" textAnchor="middle">
            Sul
          </text>

          {/* Region values */}
          <text x="120" y="120" fill="white" fontSize="16" fontWeight="bold" textAnchor="middle">
            56
          </text>
          <text x="150" y="190" fill="white" fontSize="16" fontWeight="bold" textAnchor="middle">
            78
          </text>
          <text x="200" y="220" fill="white" fontSize="16" fontWeight="bold" textAnchor="middle">
            36
          </text>
          <text x="250" y="270" fill="white" fontSize="16" fontWeight="bold" textAnchor="middle">
            313
          </text>
          <text x="200" y="320" fill="white" fontSize="16" fontWeight="bold" textAnchor="middle">
            56
          </text>
        </svg>
      </div>
    </div>
  )
}
