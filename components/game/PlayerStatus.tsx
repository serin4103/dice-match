import { StatusProps } from "@/types/game";
import styles from "./PlayerStatus.module.css";
import pawnStyles from "./Pawns.module.css";
import { useGameState } from "../../contexts/GameStateContext";

export default function PlayerStatus({
    name,
    diceResult,
    color,
    finishedCount,
}: StatusProps) {

    const { playersState, myId, turn } = useGameState();

    const finishedCircles = Array.from({ length: finishedCount }, (_, i) => (
        <div key={`f-${i}`} className={`${pawnStyles.pawn} ${styles[color]}`} />
    ));

    const remainingPawns = Array.from({ length: 4 - finishedCount }, (_, i) => (
        <div key={`r-${i}`} className={`${styles.circle} ${styles.gray}`} />
    ));

    return (
        <div className={styles.playerStatus}>
            <div className={styles.profile}>{name}</div>
            <div className={`${styles.diceBox}`}>{diceResult}</div>
            <div className={styles.circleGroup}>
                {finishedCircles}
                {remainingPawns}
            </div>
        </div>
    );
}
