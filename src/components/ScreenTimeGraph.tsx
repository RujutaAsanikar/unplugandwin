
import React, { useEffect, useRef } from 'react';
import { ScreenTimeEntry } from '@/lib/types';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ScreenTimeGraphProps {
  data: ScreenTimeEntry[];
}

const ScreenTimeGraph: React.FC<ScreenTimeGraphProps> = ({ data }) => {
  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Format data for the chart
  const chartData = sortedData.map(entry => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    minutes: entry.minutes,
  }));

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1
      }
    }
  };

  // Calculate trend
  const calculateTrend = () => {
    if (chartData.length < 2) return null;
    
    const firstValue = chartData[0].minutes;
    const lastValue = chartData[chartData.length - 1].minutes;
    
    if (lastValue < firstValue) {
      return {
        direction: 'down',
        percentage: Math.round(((firstValue - lastValue) / firstValue) * 100)
      };
    } else if (lastValue > firstValue) {
      return {
        direction: 'up',
        percentage: Math.round(((lastValue - firstValue) / firstValue) * 100)
      };
    } else {
      return {
        direction: 'same',
        percentage: 0
      };
    }
  };

  const trend = calculateTrend();

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glassmorphism p-3 rounded-lg text-sm border shadow-sm">
          <p className="font-medium">{label}</p>
          <p className="text-muted-foreground">
            {payload[0].value} minutes
          </p>
        </div>
      );
    }
  
    return null;
  };

  return (
    <motion.div 
      className="w-full rounded-xl glassmorphism p-4 border border-border shadow-sm"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Screen Time Trend</h3>
        {trend && (
          <div className={`px-3 py-1 rounded-full text-xs font-medium 
            ${trend.direction === 'down' 
              ? 'bg-green-100 text-green-800' 
              : trend.direction === 'up' 
                ? 'bg-red-100 text-red-800' 
                : 'bg-gray-100 text-gray-800'}`}>
            {trend.direction === 'down' 
              ? `↓ ${trend.percentage}% decrease` 
              : trend.direction === 'up' 
                ? `↑ ${trend.percentage}% increase` 
                : 'No change'}
          </div>
        )}
      </div>
      
      <div className="w-full h-[200px]">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
                width={40}
                domain={['dataMin - 20', 'dataMax + 20']}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="minutes" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2.5}
                dot={{ stroke: 'hsl(var(--primary))', strokeWidth: 2, r: 4, fill: 'white' }}
                activeDot={{ stroke: 'hsl(var(--primary))', strokeWidth: 2, r: 6, fill: 'white' }}
                animationDuration={1500}
                animationEasing="ease-out"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            Add screen time entries to see your trend
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ScreenTimeGraph;
