import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { History, LogOut, Shield, Tv } from 'lucide-react';

const themes = [
  { name: 'Cian', value: '#00f0ff' },
  { name: 'Violeta', value: '#a855f7' },
  { name: 'Esmeralda', value: '#10b981' },
  { name: 'Ambar', value: '#fbbf24' },
  { name: 'Rosa', value: '#ec4899' }
];

const Sidebar = ({ onLogout }) => {
  const [activeTheme, setActiveTheme] = useState(() => {
    return localStorage.getItem('streetwatch-theme') || '#00f0ff';
  });

  useEffect(() => {
    document.documentElement.style.setProperty('--primary', activeTheme);
    document.documentElement.style.setProperty('--glow-default', `0 0 20px ${activeTheme}26`);
    localStorage.setItem('streetwatch-theme', activeTheme);
  }, [activeTheme]);

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Shield size={28} className="brand-icon" />
        <span className="brand-text">Arla & Asociados</span>
      </div>

      <nav className="sidebar-menu">
        <NavLink
          to="/"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <Tv size={20} className="link-icon" />
          <span>Monitoreo En Vivo</span>
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <History size={20} className="link-icon" />
          <span>Historial y Reportes</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="theme-selector">
          <span>TEMA DE COLOR</span>
          <div className="theme-colors">
            {themes.map((theme) => (
              <button
                key={theme.value}
                className={`color-dot ${activeTheme === theme.value ? 'active' : ''}`}
                style={{
                  backgroundColor: theme.value,
                  '--theme-color': theme.value
                }}
                onClick={() => setActiveTheme(theme.value)}
                title={theme.name}
              />
            ))}
          </div>
        </div>

        <div className="system-status" style={{ marginTop: '15px' }}>
          <div className="pulse-dot"></div>
          <span>SISTEMA OPERATIVO</span>
        </div>
        <span className="version-tag">v1.2.0-PRD</span>
        <button className="logout-button" type="button" onClick={onLogout}>
          <LogOut size={16} />
          <span>Cerrar sesion</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
