import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

export const useSocket = () => {
    const [connected, setConnected] = useState(false);
    const [lastDetection, setLastDetection] = useState(null);
    const [liveStats, setLiveStats] = useState(null);
    const [lastMessage, setLastMessage] = useState(Date.now());
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io(SOCKET_URL, {
            reconnectionAttempts: Infinity,
            reconnectionDelay: 3000,
        });

        socketRef.current.on('connect', () => {
            setConnected(true);
            setLastMessage(Date.now());
            console.log('📡 Dashboard conectado');
        });

        socketRef.current.on('disconnect', () => {
            setConnected(false);
        });

        // Alerta visual de cruce
        socketRef.current.on('new_detection', (msg) => {
            setLastDetection(msg);
            setLastMessage(Date.now());
        });

        // Actualización de contadores
        socketRef.current.on('stats_update', (counts) => {
            setLiveStats(counts);
            setLastMessage(Date.now());
        });

        return () => {
            if (socketRef.current) socketRef.current.disconnect();
        };
    }, []);

    return { connected, lastDetection, liveStats, lastMessage };
};
