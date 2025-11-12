import React from 'react';

interface StatBarProps {
  label: string;
  value: number;
  max: number;
  color?: string;
  showValue?: boolean;
}

export const StatBar: React.FC<StatBarProps> = ({
  label,
  value,
  max,
  color = 'bg-blue-500',
  showValue = true,
}) => {
  const percentage = (value / max) * 100;

  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {showValue && <span className="text-xs text-gray-600">{Math.round(value)}</span>}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};

export default StatBar;
