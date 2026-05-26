import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SpeedDistributionChart = ({ distributionData }) => {
  const data = {
    labels: ['0-20 km/h', '20-40 km/h', '40-60 km/h', '60-80 km/h', '80+ km/h'],
    datasets: [
      {
        label: 'Cantidad de Vehículos',
        data: [
          distributionData.find(d => d.range === '0-20')?.count || 0,
          distributionData.find(d => d.range === '20-40')?.count || 0,
          distributionData.find(d => d.range === '40-60')?.count || 0,
          distributionData.find(d => d.range === '60-80')?.count || 0,
          distributionData.find(d => d.range === '80+')?.count || 0,
        ],
        backgroundColor: [
          '#58a6ff', // 0-20
          '#3fb950', // 20-40
          '#d29922', // 40-60
          '#f78166', // 60-80
          '#f85149', // 80+
        ],
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(22, 27, 34, 0.95)',
        titleColor: '#c9d1d9',
        bodyColor: '#c9d1d9',
        borderColor: '#30363d',
        borderWidth: 1,
      },
    },
    scales: {
      x: { 
        grid: { display: false }, 
        ticks: { color: '#8b949e' } 
      },
      y: { 
        grid: { color: '#30363d', borderDash: [5, 5] }, 
        ticks: { color: '#8b949e' },
        beginAtZero: true
      },
    },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h3 style={{ marginBottom: '15px' }}>Distribución de Velocidades</h3>
      <div style={{ flex: 1, minHeight: '250px' }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default SpeedDistributionChart;
