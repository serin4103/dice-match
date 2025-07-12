import { useState } from "react";
import { PlayerState, Color } from "@/types/game";
import GameLeft from "@/components/game/GameLeft";
import DiceBuilder from "@/components/game/DiceBuilder";
import PlayerStatus from "@/components/game/PlayerStatus";
import styles from "./Game.module.css";

export default function Game() {
    const DEFAULTSUM = 18; // Default maximum sum for dice faces

    const [turn, setTurn] = useState<Color | null>(null); // 현재 턴을 나타내는 상태

    // Todo: 서버에서 color, 상대방 name 가져오기
    const [playerStates, setPlayerStates] = useState<PlayerState[]>([
        {
            name: "Player 1",
            color: "blue",
            pawns: Array.from({ length: 4 }, (_, i) => ({
                color: "blue",
                position: "ready",
                index: i,
            })),
            diceValue: 0,
            bonus: 0,
        },
        {
            name: "Player 2",
            color: "red",
            pawns: Array.from({ length: 4 }, (_, i) => ({
                color: "red",
                position: "ready",
                index: i,
            })),
            diceValue: 0,
            bonus: 0,
        },
    ]);

    // Todo: 서버에 내 diceReady 보내고, 상대방 diceReady 가져오기
    const [dicesReady, setDicesReady] = useState<boolean[]>([false]);

    // Todo: 서버에 내 faces와 randomDiceValue 보내고, 상대방 faces와 randomDiceValue, turn 가져오기
    const buildDice = (faces: number[]) => {
        setDicesReady([true]);

        // faces 중 하나를 랜덤으로 선택
        const randomDiceValue = faces[Math.floor(Math.random() * faces.length)];

        // playerStates[0]의 diceValue 업데이트
        setPlayerStates((prev) =>
            prev.map((player, index) =>
                index === 0 ? { ...player, diceValue: randomDiceValue } : player
            )
        );

        console.log("Dice built with faces:", faces);

        if (dicesReady[0]) {
            console.log("Player 1 dice value:", randomDiceValue);
        }
        setTurn("blue"); // Player 1의 턴으로 설정
    };

    return (
        <div className={styles.gameContainer}>
            <GameLeft
                turn={turn}
                setTurn={setTurn}
                playerStates={playerStates}
                setPlayerStates={setPlayerStates}
            />
            <div className={styles.gameRight}>
                <PlayerStatus
                    name={playerStates[0].name}
                    diceValue={playerStates[0].diceValue}
                    color={playerStates[0].color}
                    finishedCount={
                        playerStates[0].pawns.filter(
                            (pawn) => pawn.position === "finished"
                        ).length
                    }
                />
                <PlayerStatus
                    name={playerStates[1].name}
                    diceValue={playerStates[1].diceValue}
                    color={playerStates[1].color}
                    finishedCount={
                        playerStates[1].pawns.filter(
                            (pawn) => pawn.position === "finished"
                        ).length
                    }
                />
                <DiceBuilder
                    turn={turn}
                    duration={20}
                    maxSum={DEFAULTSUM + playerStates[0].bonus}
                    buildDice={buildDice}
                />
            </div>
        </div>
    );
}
