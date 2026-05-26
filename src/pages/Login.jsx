import React, { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff, LockKeyhole, ShieldCheck, UserRound } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const Login = ({ onLogin }) => {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ user: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isRegister = mode === 'register';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError('');
  };

  const switchMode = () => {
    setMode((current) => (current === 'login' ? 'register' : 'login'));
    setForm({ user: '', password: '', confirmPassword: '' });
    setError('');
    setShowPassword(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isRegister && form.password !== form.confirmPassword) {
      setError('Las contrasenas no coinciden.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const endpoint = isRegister ? 'register' : 'login';
      const response = await axios.post(`${API_URL}/auth/${endpoint}`, {
        username: form.user,
        password: form.password
      });

      onLogin(response.data);
    } catch (requestError) {
      const message = requestError.response?.data?.error || 'No se pudo iniciar sesion.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-shell">
        <div className="login-panel">
          <div className="login-brand">
            <ShieldCheck size={30} className="login-brand-icon" />
            <div>
              <span>Arla & Asociados</span>
              <strong>AI</strong>
            </div>
          </div>

          <div className="login-copy">
            <p className="login-kicker">{isRegister ? 'Nuevo usuario' : 'Acceso seguro'}</p>
            <h1>{isRegister ? 'Crea tu acceso operativo' : 'Centro de monitoreo inteligente'}</h1>
            <p>
              {isRegister
                ? 'Registra una cuenta para acceder al panel de monitoreo y reportes autorizados.'
                : 'Ingresa para visualizar metricas, camaras y reportes operativos del sistema StreetWatch.'}
            </p>
          </div>

          <div className="auth-switch" role="tablist" aria-label="Modo de autenticacion">
            <button
              type="button"
              className={mode === 'login' ? 'active' : ''}
              onClick={() => setMode('login')}
            >
              Ingresar
            </button>
            <button
              type="button"
              className={mode === 'register' ? 'active' : ''}
              onClick={() => setMode('register')}
            >
              Registrarse
            </button>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="login-field">
              <span>Usuario</span>
              <div className="login-input-wrap">
                <UserRound size={18} />
                <input
                  name="user"
                  value={form.user}
                  onChange={handleChange}
                  autoComplete="username"
                  placeholder={isRegister ? 'nuevo.usuario' : 'admin'}
                  required
                />
              </div>
            </label>

            <label className="login-field">
              <span>Contrasena</span>
              <div className="login-input-wrap">
                <LockKeyhole size={18} />
                <input
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                  placeholder={isRegister ? 'Minimo 6 caracteres' : 'admin123'}
                  required
                />
                <button
                  type="button"
                  className="login-icon-btn"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            {isRegister && (
              <label className="login-field">
                <span>Confirmar contrasena</span>
                <div className="login-input-wrap">
                  <LockKeyhole size={18} />
                  <input
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Repite tu contrasena"
                    required
                  />
                </div>
              </label>
            )}

            {error && <p className="login-error">{error}</p>}

            <button className="login-submit" type="submit">
              {isSubmitting
                ? (isRegister ? 'Creando usuario...' : 'Validando acceso...')
                : (isRegister ? 'Crear cuenta' : 'Ingresar al sistema')}
            </button>
          </form>

          <button type="button" className="login-secondary-action" onClick={switchMode}>
            {isRegister ? 'Ya tengo una cuenta' : 'Crear una cuenta nueva'}
          </button>

          <div className="login-meta">
            <span>Sesion protegida</span>
            <span>v1.2.0-PRD</span>
          </div>
        </div>

        <div className="login-art" aria-hidden="true">
          <div className="security-card">
            <div className="security-orbit security-orbit-one"></div>
            <div className="security-orbit security-orbit-two"></div>
            <svg className="security-illustration" viewBox="0 0 560 440" role="img">
              <defs>
                <linearGradient id="screenGradient" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="#07142d" />
                  <stop offset="100%" stopColor="#111a3f" />
                </linearGradient>
                <linearGradient id="accentGradient" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="#00f0ff" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
                <linearGradient id="shieldGradient" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#00f0ff" />
                </linearGradient>
                <filter id="softGlow" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="7" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <path className="art-shadow" d="M93 365c54 31 300 36 369 2 32-16 13-42-55-51-80-10-228-7-289 9-47 12-57 23-25 40z" />

              <g className="art-device">
                <rect x="108" y="102" width="344" height="224" rx="28" fill="#eef6ff" />
                <rect x="126" y="120" width="308" height="174" rx="18" fill="url(#screenGradient)" />
                <rect x="240" y="326" width="80" height="26" rx="8" fill="#dbe8f6" />
                <rect x="194" y="350" width="172" height="18" rx="9" fill="#c9d8ea" />

                <g className="screen-grid">
                  <path d="M154 160h252M154 203h252M154 246h252" />
                  <path d="M192 142v132M280 142v132M368 142v132" />
                </g>

                <path className="signal-line line-one" d="M158 252c38-46 73-18 112-62 39-44 74-18 132-54" />
                <path className="signal-line line-two" d="M158 228c52-18 82 20 125 0 43-20 74-65 119-34" />

                <g className="status-card status-card-one">
                  <rect x="152" y="148" width="88" height="42" rx="12" />
                  <circle cx="172" cy="169" r="8" />
                  <path d="M190 162h34M190 176h25" />
                </g>

                <g className="status-card status-card-two">
                  <rect x="320" y="220" width="86" height="44" rx="12" />
                  <circle cx="342" cy="242" r="8" />
                  <path d="M360 235h30M360 249h20" />
                </g>
              </g>

              <g className="art-shield">
                <path d="M280 53c48 8 75-13 75-13s-3 102-75 140c-72-38-75-140-75-140s27 21 75 13z" />
                <path d="M248 108l23 23 47-58" />
              </g>

              <g className="art-lock">
                <rect x="236" y="185" width="88" height="78" rx="18" />
                <path d="M254 185v-28a26 26 0 0 1 52 0v28" />
                <circle cx="280" cy="224" r="8" />
                <path d="M280 232v14" />
              </g>

              <g className="floating-badge badge-left">
                <rect x="60" y="155" width="86" height="86" rx="22" />
                <path d="M102 181v30M87 196h30" />
                <circle cx="102" cy="196" r="25" />
              </g>

              <g className="floating-badge badge-right">
                <rect x="421" y="151" width="82" height="82" rx="22" />
                <path d="M444 194l14 14 26-34" />
              </g>

              <g className="art-key">
                <circle cx="416" cy="288" r="22" />
                <circle cx="416" cy="288" r="8" />
                <path d="M432 304l50 50m-10-10l-13 13m29 4l-12 12" />
              </g>

              <path className="art-line art-line-left" d="M103 154c-18-36-11-70 21-93" />
              <path className="art-line art-line-right" d="M458 150c25-31 26-69 2-97" />
              <circle className="art-dot art-dot-one" cx="119" cy="68" r="7" />
              <circle className="art-dot art-dot-two" cx="459" cy="62" r="7" />
              <circle className="art-dot art-dot-three" cx="86" cy="268" r="6" />
            </svg>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;
