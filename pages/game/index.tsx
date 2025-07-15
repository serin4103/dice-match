import { useState } from "react";
import { PlayerState, Color } from "@/types/game";
import GameLeft from "@/components/game/GameLeft";
import GameRight from "@/components/game/GameRight";
import styles from "./Game.module.css";

export default function Game() {

    const [turn, setTurn] = useState<Color | null>(null); // 현재 턴을 나타내는 상태

    // Todo: 서버에서 color, 상대방 name 가져오기
    const [playerStates, setPlayerStates] = useState<PlayerState[]>([
        {
            name: "Player 1",
            color: "blue",
            pawnsState: Array.from({ length: 4 }, (_, i) => ({
                color: "blue",
                position: "ready",
                index: i,
            })),
            diceValues: [0, 0, 0, 0, 0, 0], // 초기값 필요에 따라 설정
            diceResult: 0,
            bonus: 0,
        },
        {
            name: "Player 2",
            color: "red",
            pawnsState: Array.from({ length: 4 }, (_, i) => ({
                color: "red",
                position: "ready",
                index: i,
            })),
            diceValues: [0, 0, 0, 0, 0, 0], // 초기값 필요에 따라 설정
            diceResult: 0,
            bonus: 0,
        },
    ]);

    return (
        <div className={styles.gameContainer}>
            <GameLeft
                turn={turn}
                setTurn={setTurn}
                playerStates={playerStates}
                setPlayerStates={setPlayerStates}
            />
            <GameRight
                turn={turn}
                setTurn={setTurn}
                playerStates={playerStates}
                setPlayerStates={setPlayerStates}
            />
        </div>
    );
}
