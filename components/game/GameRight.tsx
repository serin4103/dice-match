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
            <PlayerStatus playerIndex={0} />
            <PlayerStatus playerIndex={1} />
            <DiceBuilder
                duration={20}
                maxSum={DEFAULTSUM + playersState[0].bonus}
                buildDice={buildDice}
            />
        </div>
    );
}
