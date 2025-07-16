import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
    connectSocket: () => void;
    disconnectSocket: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
    children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const { data: session, status } = useSession();

    const connectSocket = () => {
        if (!socket && status === 'authenticated' && session) {
            console.log('🔗 Creating new socket connection...');
            const newSocket = io(process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:4000");

            newSocket.on('connect', () => {
                console.log('🔗 Socket connected:', newSocket.id);
                setIsConnected(true);
            });

            newSocket.on('disconnect', () => {
                console.log('❌ Socket disconnected');
                setIsConnected(false);
            });

            newSocket.on('error', (error) => {
                console.error('🚨 Socket error:', error);
            });

            setSocket(newSocket);
        }
    };

    const disconnectSocket = () => {
        if (socket) {
            console.log('🔌 Disconnecting socket...');
            socket.disconnect();
            setSocket(null);
            setIsConnected(false);
        }
    };

    // 인증 상태 변경 시 자동 연결/해제
    useEffect(() => {
        if (status === 'authenticated' && session && !socket) {
            connectSocket();
        } else if (status === 'unauthenticated' && socket) {
            disconnectSocket();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, session]);

    // 컴포넌트 언마운트 시 정리
    useEffect(() => {
        return () => {
            if (socket) {
                socket.disconnect();
                setSocket(null);
                setIsConnected(false);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <SocketContext.Provider value={{
            socket,
            isConnected,
            connectSocket,
            disconnectSocket
        }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = (): SocketContextType => {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};
