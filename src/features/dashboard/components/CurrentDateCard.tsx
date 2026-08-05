'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { MetricCard } from './MetricCard';

export function CurrentDateCard() {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const todayStr = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <MetricCard
      title="Fecha de Hoy"
      value={todayStr}
      icon={<Calendar size={16} className="text-brand-main transition-colors" />}
      trendText={currentTime ? currentTime : 'Calculando...'}
      trendIcon={<Clock size={12} />}
      trendColor="text-text-muted"
    />
  );
}
