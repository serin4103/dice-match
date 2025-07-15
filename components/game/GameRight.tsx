import { useSocket } from "../../contexts/SocketContext";
import { useGameState } from "../../contexts/GameStateContext";
import DiceBuilder from "./DiceBuilder";
import PlayerStatus from "./PlayerStatus";
import styles from "./GameRight.module.css";

export default function GameRight() {
    const DEFAULTSUM = 18; // Default maximum sum for dice faces
    const { socket } = useSocket();
    const { gameId, playersState, myId } = useGameState();

    const buildDice = (diceValues: number[]) => {
        console.log("Building dice with values:", diceValues);
        socket.emit("buildDice", {
            gameId: gameId,
            userId: myId,
            diceValues: diceValues,
        });
    };

    return (
        <div className={styles.gameRight}>
            <PlayerStatus
                name={playersState[0].name}
                diceResult={playersState[0].diceResult}
                color={playersState[0].color}
                finishedCount={
                    playersState[0].pawnsState.filter(
                        (pawn) => pawn.position === "finished"
                    ).length
                }
            />
            <PlayerStatus
                name={playersState[1].name}
                diceResult={playersState[1].diceResult}
                color={playersState[1].color}
                finishedCount={
                    playersState[1].pawnsState.filter(
                        (pawn) => pawn.position === "finished"
                    ).length
                }
            />
            <DiceBuilder
                duration={20}
                maxSum={DEFAULTSUM + playersState[0].bonus}
                buildDice={buildDice}
            />
        </div>
    );
}
