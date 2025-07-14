import { StatusProps } from "@/types/game";
import styles from "./PlayerStatus.module.css";
import pawnStyles from "./Pawns.module.css";

export default function PlayerStatus({
    name,
    diceValue,
    color,
    finishedCount,
}: StatusProps) {
    const finishedCircles = Array.from({ length: finishedCount }, (_, i) => (
        <div key={`f-${i}`} className={`${pawnStyles.pawn} ${styles[color]}`} />
    ));

    const remainingPawns = Array.from({ length: 4 - finishedCount }, (_, i) => (
        <div key={`r-${i}`} className={`${styles.circle} ${styles.gray}`} />
    ));

    return (
        <div className={styles.playerStatus}>
            <div className={styles.profile}>{name}</div>
            <div className={styles.diceBox}>{diceValue}</div>
            <div className={styles.circleGroup}>
                {finishedCircles}
                {remainingPawns}
            </div>
        </div>
    );
}
