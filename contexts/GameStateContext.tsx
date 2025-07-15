import { createContext, useContext, useState, ReactNode } from 'react';
import { PlayerState } from '@/types/game';

// Context 타입 정의
interface GameStateContextType {
    gameId: string;
    setGameId: React.Dispatch<React.SetStateAction<string>>;
    playersState: PlayerState[];
    setPlayersState: React.Dispatch<React.SetStateAction<PlayerState[]>>;
    myId: number;
    setMyId: React.Dispatch<React.SetStateAction<number>>;
    opponentId: number;
    setOpponentId: React.Dispatch<React.SetStateAction<number>>;
    turn: number;
    setTurn: React.Dispatch<React.SetStateAction<number>>;
}

// Context 생성 (기본값은 undefined)
const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

// Provider Props 타입
interface GameStateProviderProps {
    children: ReactNode;
}

// Provider 컴포넌트
export function GameStateProvider({ children }: GameStateProviderProps) {
    const [gameId, setGameId] = useState<string>('');
    const [playersState, setPlayersState] = useState<PlayerState[]>([]);
    const [myId, setMyId] = useState<number>(0);
    const [opponentId, setOpponentId] = useState<number>(0);
    const [turn, setTurn] = useState<number>(0);

    return (
        <GameStateContext.Provider value={{ 
            gameId, 
            setGameId,
            playersState, 
            setPlayersState,
            myId,
            setMyId,
            opponentId,
            setOpponentId,
            turn,
            setTurn
        }}>
            {children}
        </GameStateContext.Provider>
    );
}

// Custom Hook
export function useGameState() {
    const context = useContext(GameStateContext);
    if (context === undefined) {
        throw new Error('useGametate must be used within a GameStateProvider');
    }
    return context;
}