export type Color = "blue" | "red";

export type PawnPosition = "ready" | "finished" | number;

type Direction = "up" | "down" | "left" | "right" | "left-down" | "right-down";

export interface Path {
    direction: Direction;
    next: PawnPosition;
}

export interface Node {
    index: PawnPosition;
    top: string;
    left: string;
    subsequent: PawnPosition; // 현재 노드가 경유 노드일 때 다음 노드
    candidate: Path[]; // 경로를 선택할 수 있는 경우
}

export interface PlayerInfo {
    name: string;
    color: Color;
    finishedCount: number;
}

export interface DiceInfo {
    faces: number[];
    sum: number;
}

export interface GameLeftProps {
    turn: Color | null; // 현재 턴을 나타내는 상태
    setTurn: React.Dispatch<React.SetStateAction<Color | null>>; // 턴을 설정하는 함수
    playerStates: PlayerState[]; // 현재 플레이어 상태 배열
    setPlayerStates: React.Dispatch<React.SetStateAction<PlayerState[]>>; // 플레이어 상태 설정 함수
}

export interface DiceBuilderProps {
    turn: Color | null; // 현재 턴을 나타내는 상태
    duration: number; // seconds
    maxSum: number;
    buildDice: (faces: number[]) => void;
}

export interface ReadyPawnsProps {
    color: Color;
    count: number;
    onClick: () => void;
}

export interface StatusProps {
    name: string;
    diceValue: number;
    color: Color;
    finishedCount: number;
}

export interface TimerProps {
    duration: number; // seconds
    onTimeUp: () => void;
    diceReady: boolean;
}

export interface PawnState {
    color: Color;
    position: PawnPosition; // "ready", "finished", or a number indicating the position on the board
    index: number; // index of the pawn in the player's pawns
}

export interface PlayerState {
    name: string;
    color: Color;
    pawns: PawnState[];
    diceValue: number; // -1 if no dice has been rolled yet
    bonus: number;
}
