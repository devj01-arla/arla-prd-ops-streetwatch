import React, { useState, useMemo } from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DailyChart = ({ hourlyData, isHistory }) => {
  const [chartType, setChartType] = useState('bar');

  const allHours = Array.from({ length: 24 }, (_, i) => i);
  const labels = allHours.map(h => `${String(h).padStart(2, '0')}:00`);
  
  const mappedData = useMemo(() => {
    return allHours.map(hour => {
      const found = hourlyData?.find(d => parseInt(d.hour) === hour);
      return found || { personas: 0, autos: 0, motos: 0, camion: 0, bus: 0, bicicletas: 0, animales: 0 };
    });
  }, [hourlyData]);

  const categories = useMemo(() => [
    { key: 'personas', label: 'Personas', color: '#38bdf8' },
    { key: 'autos', label: 'Autos', color: '#10b981' },
    { key: 'motos', label: 'Motos', color: '#fbbf24' },
    { key: 'bus', label: 'Buses', color: '#a855f7' },
    { key: 'camion', label: 'Camiones', color: '#ec4899' },
    { key: 'bicicletas', label: 'Bicicletas', color: '#06b6d4' },
    { key: 'animales', label: 'Animales', color: '#f43f5e' }
  ], []);

  const timeData = {
    labels,
    datasets: categories.map(cat => ({
      label: cat.label,
      data: mappedData.map(d => d[cat.key] || 0),
      backgroundColor: chartType === 'bar' ? cat.color : `${cat.color}20`,
      borderColor: cat.color,
      borderWidth: chartType === 'line' ? 2 : 0,
      borderRadius: chartType === 'bar' ? 6 : 0,
      fill: chartType === 'line',
      tension: 0.3,
      pointRadius: chartType === 'line' ? 3 : 0,
      pointBackgroundColor: cat.color,
    }))
  };

  const timeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'top', 
        labels: { 
          color: '#f3f4f6', 
          usePointStyle: true, 
          font: { size: 11, family: "'Plus Jakarta Sans', sans-serif" } 
        } 
      },
      tooltip: { 
        backgroundColor: 'rgba(16, 21, 41, 0.95)', 
        titleColor: '#f3f4f6', 
        bodyColor: '#f3f4f6',
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
        titleFont: { family: "'Share Tech Mono', monospace" },
        bodyFont: { family: "'Plus Jakarta Sans', sans-serif" }
      }
    },
    scales: {
      x: { 
        stacked: chartType === 'bar', 
        grid: { display: false }, 
        ticks: { color: '#9ca3af', font: { family: "'Share Tech Mono', monospace" } } 
      },
      y: { 
        stacked: chartType === 'bar', 
        grid: { color: 'rgba(255, 255, 255, 0.05)', borderDash: [5, 5] }, 
        ticks: { color: '#9ca3af', font: { family: "'Share Tech Mono', monospace" } }, 
        beginAtZero: true 
      }
    }
  };

  const doughnutData = {
    labels: categories.map(cat => cat.label),
    datasets: [{
      data: categories.map(cat => mappedData.reduce((sum, d) => sum + (d[cat.key] || 0), 0)),
      backgroundColor: categories.map(cat => cat.color),
      borderColor: 'rgba(16, 21, 41, 0.8)',
      borderWidth: 2
    }]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#f3f4f6',
          font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 }
        }
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '350px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: 0, fontSize: '0.95rem', fontFamily: "'Share Tech Mono', monospace" }}>
          {isHistory ? '📊 HISTORIAL DE TRÁFICO' : '📊 FLUJO DE TRÁFICO HOY'}
        </h3>
        <select 
          value={chartType} 
          onChange={(e) => setChartType(e.target.value)}
          className="date-picker"
          style={{ padding: '4px 10px', fontSize: '0.8rem' }}
        >
          <option value="bar">📊 BARRAS</option>
          <option value="line">📈 LÍNEAS</option>
          <option value="doughnut">🍩 CIRCULAR</option>
        </select>
      </div>
      <div style={{ flex: 1, minHeight: '300px', width: '100%' }}>
        {chartType === 'bar' && <Bar data={timeData} options={timeOptions} />}
        {chartType === 'line' && <Line data={timeData} options={timeOptions} />}
        {chartType === 'doughnut' && <Doughnut data={doughnutData} options={doughnutOptions} />}
      </div>
    </div>
  );
};


export default DailyChart;
