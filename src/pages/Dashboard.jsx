import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSocket } from '../hooks/useSocket';
import LiveFeed from '../components/LiveFeed';
import StatsCards from '../components/StatsCards';
import DailyChart from '../components/DailyChart';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const Dashboard = () => {
    const getTodayString = () => {
        const date = new Date();
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const { connected, lastDetection, liveStats } = useSocket();
    const [selectedDate, setSelectedDate] = useState(getTodayString());
    const isToday = selectedDate === getTodayString();
    
    const [dailyStats, setDailyStats] = useState(null);
    const [hourlyData, setHourlyData] = useState([]);
    const [paginatedDets, setPaginatedDets] = useState([]);
    const [detPage, setDetPage] = useState(0);
    const [totalDets, setTotalDets] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingPage, setIsLoadingPage] = useState(false);
    const [showAdvancedStats, setShowAdvancedStats] = useState(false);
    const LIMIT = 10;

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
        e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
    };

    const loadInitialData = useCallback(async (date) => {
        setIsLoading(true);
        try {
            const [s, h, d] = await Promise.all([
                axios.get(`${API_URL}/stats/today?date=${date}`),
                axios.get(`${API_URL}/stats/hourly?date=${date}`),
                axios.get(`${API_URL}/stats/detections?date=${date}&limit=${LIMIT}&offset=0`)
            ]);
            setDailyStats(s.data);
            setHourlyData(h.data);
            setPaginatedDets(d.data.detections);
            setTotalDets(d.data.total);
            setDetPage(0);
        } catch (e) { console.error(e); }
        finally { setIsLoading(false); }
    }, []);

    const fetchPage = async (page) => {
        setIsLoadingPage(true);
        try {
            const res = await axios.get(`${API_URL}/stats/detections`, {
                params: { date: selectedDate, limit: LIMIT, offset: page * LIMIT }
            });
            setPaginatedDets(res.data.detections);
            setTotalDets(res.data.total);
        } catch (e) { console.error(e); }
        finally { setIsLoadingPage(false); }
    };

    useEffect(() => { loadInitialData(selectedDate); }, [selectedDate, loadInitialData]);

    useEffect(() => {
        if (detPage > 0) fetchPage(detPage);
        else if (detPage === 0 && !isLoading) fetchPage(0);
    }, [detPage]);

    // WebSocket Update
    useEffect(() => {
        if (liveStats && isToday) {
            const now = new Date();
            const currentHour = now.getHours();

            if (liveStats.daily) {
                const d = liveStats.daily;
                setDailyStats(prev => ({
                    ...prev,
                    personas: d.persona || 0,
                    autos: d.auto || 0,
                    motos: (d.moto || 0) + (d.mototaxi || 0),
                    bus: d.bus || 0,
                    camion: d.camion || 0,
                    bicicletas: d.bicicleta || 0,
                    animales: d.animal || 0
                }));
            }

            if (liveStats.hour) {
                const h = liveStats.hour;
                setHourlyData(prev => {
                    const hourExists = prev.find(row => parseInt(row.hour) === currentHour);
                    const hourData = {
                        hour: currentHour,
                        personas: h.persona || 0,
                        autos: h.auto || 0,
                        motos: h.moto || 0,
                        bicicletas: h.bicicleta || 0,
                        animales: h.animal || 0,
                        bus: h.bus || 0,
                        camion: h.camion || 0,
                        total: Object.values(h).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0)
                    };
                    if (hourExists) return prev.map(row => parseInt(row.hour) === currentHour ? hourData : row);
                    return [...prev, hourData].sort((a, b) => a.hour - b.hour);
                });
            }
        }
    }, [liveStats, isToday]);

    useEffect(() => {
        if (lastDetection && isToday) {
            if (detPage === 0) {
                setPaginatedDets(prev => [{ ...lastDetection, isNew: true }, ...prev].slice(0, LIMIT));
            }
            setTotalDets(t => t + 1);
        }
    }, [lastDetection, isToday, detPage]);

    return (
        <div className="dashboard-page">
            <header className="page-header">
                <div>
                    <h1 className="text-gradient">MONITOREO EN VIVO</h1>
                    <p className="subtitle">Análisis de flujo de tráfico en tiempo real con Inteligencia Artificial</p>
                </div>
                <input 
                    type="date" 
                    value={selectedDate} 
                    onChange={e => setSelectedDate(e.target.value)} 
                    max={getTodayString()} 
                    className="date-picker" 
                />
            </header>

            <div className="dashboard-grid">
                <main className="main-column">
                    <StatsCards dailyStats={dailyStats} />
                    <div className="card chart-container">
                        <DailyChart hourlyData={hourlyData} />
                    </div>
                </main>

                <aside className="side-column">
                    {isToday && <LiveFeed lastDetection={lastDetection} connected={connected} />}
                    
                    {/* Sección Desplegable de Estadísticas de Velocidad */}
                    <div className="card stats-detail-card">
                        <button 
                            className="toggle-stats-btn"
                            onClick={() => setShowAdvancedStats(!showAdvancedStats)}
                            style={{ 
                                width: '100%', 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center', 
                                background: 'none', 
                                border: 'none', 
                                color: 'var(--text-main)', 
                                cursor: 'pointer', 
                                padding: '0 5px' 
                            }}
                        >
                            <h3 style={{ margin: 0, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                ⚡ ANÁLISIS DE VELOCIDADES
                            </h3>
                            <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>{showAdvancedStats ? '▲ Ocultar' : '▼ Mostrar'}</span>
                        </button>
                        
                        {showAdvancedStats && dailyStats?.stats && (
                            <div className="advanced-stats-content" style={{ marginTop: '15px', padding: '10px 5px 0 5px', borderTop: '1px solid var(--panel-border)' }}>
                                <table className="speed-table stats-table" style={{ width: '100%' }}>
                                    <thead>
                                        <tr>
                                            <th style={{ textAlign: 'left' }}>Categoría</th>
                                            <th style={{ textAlign: 'right' }}>Promedio</th>
                                            <th style={{ textAlign: 'right' }}>Máxima</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Autos</td>
                                            <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{dailyStats.stats.autos.avg} km/h</td>
                                            <td style={{ textAlign: 'right', color: 'var(--success)', fontWeight: 'bold' }}>{dailyStats.stats.autos.max} km/h</td>
                                        </tr>
                                        <tr>
                                            <td>Motos</td>
                                            <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{dailyStats.stats.motos.avg} km/h</td>
                                            <td style={{ textAlign: 'right', color: 'var(--success)', fontWeight: 'bold' }}>{dailyStats.stats.motos.max} km/h</td>
                                        </tr>
                                        <tr>
                                            <td>Camiones</td>
                                            <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{dailyStats.stats.camiones.avg} km/h</td>
                                            <td style={{ textAlign: 'right', color: 'var(--success)', fontWeight: 'bold' }}>{dailyStats.stats.camiones.max} km/h</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div className="card log-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid var(--panel-border)' }}>
                            <h3 style={{ margin: 0, fontSize: '0.9rem' }}>⚡ HISTORIAL DE VELOCIDADES</h3>
                            <div className="pagination">
                                <button onClick={() => setDetPage(p => Math.max(0, p - 1))} disabled={detPage === 0 || isLoadingPage}>&larr;</button>
                                <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.85rem' }}>{detPage + 1}</span>
                                <button onClick={() => setDetPage(p => p + 1)} disabled={(detPage + 1) * LIMIT >= totalDets || isLoadingPage}>&rarr;</button>
                            </div>
                        </div>
                        <div style={{ opacity: isLoadingPage ? 0.5 : 1, overflowY: 'auto', flex: 1 }}>
                            <table className="speed-table">
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: 'left' }}>Tipo</th>
                                        <th style={{ textAlign: 'center' }}>Velocidad</th>
                                        <th style={{ textAlign: 'right' }}>Hora</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedDets.map((det, i) => (
                                        <tr key={det.id || i} className={det.isNew ? 'new-row' : ''}>
                                            <td style={{ textTransform: 'uppercase', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                                {det.object_type || det.type}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <span className={`speed-badge ${det.speed > 50 ? 'high' : ''}`}>
                                                    {det.speed} km/h
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'right', color: 'var(--text-dim)', fontSize: '0.8rem', fontFamily: 'Share Tech Mono, monospace' }}>
                                                {new Date(det.detected_at).toLocaleTimeString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};


export default Dashboard;
