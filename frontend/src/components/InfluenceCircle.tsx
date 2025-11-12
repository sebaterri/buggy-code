import React from 'react';

interface InfluenceCircleProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const InfluenceCircle: React.FC<InfluenceCircleProps> = ({
  score,
  size = 'md',
  label = 'Influence',
}) => {
  const sizeMap = {
    sm: { radius: 30, fontSize: 14 },
    md: { radius: 50, fontSize: 20 },
    lg: { radius: 80, fontSize: 32 },
  };

  const { radius, fontSize } = sizeMap[size];
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Color based on score
  const getColor = (s: number) => {
    if (s >= 80) return '#22c55e'; // green
    if (s >= 60) return '#3b82f6'; // blue
    if (s >= 40) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  const color = getColor(score);

  return (
    <div className="flex flex-col items-center">
      <svg width={radius * 2.2} height={radius * 2.2} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={radius * 1.1}
          cy={radius * 1.1}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="4"
        />
        {/* Progress circle */}
        <circle
          cx={radius * 1.1}
          cy={radius * 1.1}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-sm text-gray-500 font-medium">{label}</span>
        <span style={{ fontSize: `${fontSize}px`, color }} className="font-bold">
          {Math.round(score)}
        </span>
      </div>
    </div>
  );
};

export default InfluenceCircle;
