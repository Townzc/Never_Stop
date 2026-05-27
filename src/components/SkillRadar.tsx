'use client';

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import type { AssessmentScores } from '@/types';

interface SkillRadarProps {
  scores: AssessmentScores;
  compact?: boolean;
}

const dimensionLabels: Record<keyof AssessmentScores, string> = {
  vocab: '词汇',
  signage: '标识',
  listening: '听力',
  speaking: '口语',
  pronunciation: '发音',
};

export default function SkillRadar({ scores, compact = false }: SkillRadarProps) {
  const data = Object.entries(scores).map(([key, value]) => ({
    dimension: dimensionLabels[key as keyof AssessmentScores],
    score: value,
    fullMark: 100,
  }));

  const size = compact ? 200 : 300;

  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={size}>
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: '#374151', fontSize: compact ? 12 : 14, fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: '#9ca3af', fontSize: 10 }}
            tickCount={compact ? 3 : 5}
          />
          <Radar
            name="能力"
            dataKey="score"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
