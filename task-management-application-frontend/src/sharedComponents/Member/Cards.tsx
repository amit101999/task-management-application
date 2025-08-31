import React from 'react'
import ProgressBar from './ProgressBar'

interface overviewCardProps {
    title: string,
    icon: React.ReactNode,
    iconBg: string,
    value: number,
    description: string
     progress?: number;
}

const OverviewCard = ({title, icon, iconBg, value, description , progress} : overviewCardProps) => {
  return (
    <div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-center mb-4">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {title}
                </div>
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg ${iconBg}`}
                >
                  {icon}
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
              <div className="text-sm text-gray-600">{description}</div>
              {progress && <ProgressBar percentage={progress} delay={500} />}
            </div>
    </div>
  )
}

export default OverviewCard