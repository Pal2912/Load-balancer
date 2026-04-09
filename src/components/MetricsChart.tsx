import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface MetricsChartProps {
  servers: { id: number; name: string; load: number }[];
}

const MetricsChart: React.FC<MetricsChartProps> = ({ servers }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={servers} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="load" fill="#3B82F6" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MetricsChart;
