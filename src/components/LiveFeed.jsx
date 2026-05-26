import React, { useState, useEffect } from 'react';

const FASTAPI_URL = import.meta.env.VITE_FASTAPI_URL || 'http://localhost:8000';

const LiveFeed = ({ lastDetection, connected }) => {
  const [timeStr, setTimeStr] = useState('');

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleDateString() + ' ' + now.toLocaleTimeString());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card live-feed-container" onMouseMove={handleMouseMove}>

      <div className="live-feed-header">
        <h3>📹 STREETWATCH_CAM_01</h3>
        <div className={`status-indicator ${connected ? 'status-online' : 'status-offline'}`}>
          {connected ? '● REC EN VIVO' : '○ DESCONECTADO'}
        </div>
      </div>
      
      <div className="video-wrapper">
        {/* Línea de escaneo animada */}
        <div className="cctv-scanline"></div>
        
        {/* Esquinas HUD inferiores */}
        <div className="hud-corners-bottom"></div>

        <img 
          src={`${FASTAPI_URL}/stream/video`} 
          alt="Video Stream" 
          className="main-stream"
          onError={(e) => {
            e.target.onerror = null;
            // Usamos un SVG en lugar de una url externa para evitar fallos de conexión
            e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360" style="background:%23060714;"><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="18" fill="%23f43f5e" font-weight="bold">🔴 CAM_01 - NO SIGNAL</text><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="12" fill="%239ca3af">VERIFIQUE EL SERVIDOR DE IA EN EL PUERTO 8000</text></svg>';
          }}
        />
        
        {/* Metadatos superpuestos tipo CCTV */}
        <div className="cctv-metadata">
          <div>CAM_01 // ENTRADA_PRD</div>
          <div>FPS: ~15 (CAP) | IA: 8 FPS</div>
          <div>{timeStr}</div>
        </div>

        {lastDetection && (
          <div className="detection-overlay">
            <span className="badge-detection-alert">
              CRUCE: {(lastDetection.class || lastDetection.type || '').toUpperCase()} // {Math.round((lastDetection.confidence || 0) * 100)}%
            </span>
          </div>
        )}
      </div>
      
      <div className="feed-footer">
        <span>RESOLUCIÓN: 1080P</span>
        <span>MOTOR: YOLOv8s + ROBOTFLOW (MOTOTAXI)</span>
      </div>
    </div>
  );
};

export default LiveFeed;

