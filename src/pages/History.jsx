import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import StatsCards from '../components/StatsCards';
import DailyChart from '../components/DailyChart';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const History = () => {
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [dailyStats, setDailyStats] = useState(null);
    const [hourlyData, setHourlyData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchHistoricalData = async (date) => {
        setIsLoading(true);
        try {
            const [statsRes, hourlyRes] = await Promise.all([
                axios.get(`${API_URL}/stats/today?date=${date}`),
                axios.get(`${API_URL}/stats/hourly?date=${date}`)
            ]);
            
            setDailyStats(statsRes.data);
            setHourlyData(hourlyRes.data);
        } catch (error) {
            console.error('Error fetching historical stats:', error);
            setDailyStats(null);
            setHourlyData([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHistoricalData(selectedDate);
    }, [selectedDate]);

    const exportToCSV = () => {
        if (!hourlyData || hourlyData.length === 0) return;

        const headers = ['Hora', 'Personas', 'Autos', 'Motos', 'Bicicletas', 'Animales', 'Buses', 'Camiones', 'Total'];
        const csvRows = [headers.join(',')];

        for (const row of hourlyData) {
            const values = [
                `${String(row.hour).padStart(2, '0')}:00`,
                row.personas || 0,
                row.autos || 0,
                row.motos || 0,
                row.bicicletas || 0,
                row.animales || 0,
                row.bus || 0,
                row.camion || 0,
                row.total || 0
            ];
            csvRows.push(values.join(','));
        }

        // Add summary at the bottom
        csvRows.push('');
        csvRows.push('TOTALES DEL DÍA,,,,,,,,');
        if (dailyStats) {
            const totalValues = [
                'Total',
                dailyStats.personas || 0,
                dailyStats.autos || 0,
                dailyStats.motos || 0,
                dailyStats.bicicletas || 0,
                dailyStats.animales || 0,
                dailyStats.bus || 0,
                dailyStats.camion || 0,
                dailyStats.total || 0
            ];
            csvRows.push(totalValues.join(','));
        }

        const csvString = csvRows.join('\n');
        const blob = new Blob(["\uFEFF" + csvString], { type: 'text/csv;charset=utf-8;' }); // \uFEFF for Excel UTF-8 BOM
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `StreetWatch_Historial_${selectedDate}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="dashboard-page">
            <header className="page-header">
                <div>
                    <h1 className="text-gradient">HISTORIAL Y REPORTES</h1>
                    <p className="subtitle">Consulta y exportación de datos de tráfico acumulados</p>
                </div>
                <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input 
                        type="date" 
                        className="date-picker"
                        value={selectedDate}
                        max={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                    <button 
                        onClick={exportToCSV} 
                        className="btn-export"
                        disabled={isLoading || hourlyData.length === 0}
                    >
                        Descargar CSV 📥
                    </button>
                </div>
            </header>

            <div className="history-grid" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {isLoading ? (
                    <div className="loading-state">Cargando datos históricos...</div>
                ) : (
                    <>
                        <section className="full-width">
                            {dailyStats && dailyStats.total > 0 ? (
                                <StatsCards dailyStats={dailyStats} />
                            ) : (
                                <div className="no-data-msg">No hay registros de conteo para la fecha seleccionada.</div>
                            )}
                        </section>
                        
                        {hourlyData.length > 0 && (
                            <section className="full-width card" style={{ marginTop: '12px' }}>
                                <DailyChart hourlyData={hourlyData} isHistory={true} />
                            </section>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};


export default History;
