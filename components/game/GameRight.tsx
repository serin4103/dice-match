import { GameProps } from "@/types/game";
import DiceBuilder from "./DiceBuilder";
import PlayerStatus from "./PlayerStatus";
import styles from "./GameRight.module.css";


export default function GameRight({
    turn,
    setTurn,
    playerStates,
    setPlayerStates,
}: GameProps) {
    
    const DEFAULTSUM = 18; // Default maximum sum for dice faces

    // Todo: 서버에 내 faces와 randomDiceValue 보내고, 상대방 faces와 randomDiceValue, turn 가져오기
    const buildDice = (faces: number[]) => {

        // faces 중 하나를 랜덤으로 선택
        const randomDiceValue = faces[Math.floor(Math.random() * faces.length)];

        // playerStates[0]의 diceValue 업데이트
        setPlayerStates((prev) =>
            prev.map((player, index) =>
                index === 0 ? { ...player, diceValue: randomDiceValue } : player
            )
        );

        console.log("Dice built with faces:", faces);

        setTurn("blue"); // Player 1의 턴으로 설정
    };

    return (
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
    );
}