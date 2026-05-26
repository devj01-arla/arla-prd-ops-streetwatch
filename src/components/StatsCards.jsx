import React from 'react';
import { User, Car, Bike, Dog, Truck, Bus, Gauge } from 'lucide-react';

const StatsCards = ({ dailyStats }) => {
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  const cards = [
    { label: 'Personas', value: dailyStats?.personas || 0, icon: <User size={22}/>, color: '#38bdf8' },
    { label: 'Autos', value: dailyStats?.autos || 0, icon: <Car size={22}/>, color: '#10b981' },
    { label: 'Motos', value: dailyStats?.motos || 0, icon: <Bike size={22}/>, color: '#fbbf24' },
    { label: 'Buses', value: dailyStats?.bus || 0, icon: <Bus size={22}/>, color: '#a855f7' },
    { label: 'Camiones', value: dailyStats?.camion || 0, icon: <Truck size={22}/>, color: '#ec4899' },
    { label: 'Bicicletas', value: dailyStats?.bicicletas || 0, icon: <Bike size={22} style={{transform: 'rotate(10deg)'}}/>, color: '#06b6d4' },
    { label: 'Animales', value: dailyStats?.animales || 0, icon: <Dog size={22}/>, color: '#f43f5e' },
    { label: 'Vel. Promedio', value: `${dailyStats?.avgSpeed || 0} km/h`, icon: <Gauge size={22}/>, color: '#00f0ff' },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card, i) => (
        <div 
          key={i} 
          className="stat-card" 
          onMouseMove={handleMouseMove}
          style={{ 
            '--theme-color': card.color, 
            '--theme-glow': `0 0 20px ${card.color}40` 
          }}
        >
          <div className="stat-icon" style={{ color: card.color }}>
            {card.icon}
          </div>
          <div className="stat-info">
            <span className="stat-label">{card.label}</span>
            <span className="stat-value">{card.value.toLocaleString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
};


export default StatsCards;

