import styles from "./Status.module.css";

interface StatusProps {
    name: string;
    diceValue: number;
    color: "blue" | "red";
    finishedCount: number;
}

export default function Status({
    name,
    diceValue,
    color,
    finishedCount,
}: StatusProps) {
    const finishedCircles = Array.from({ length: finishedCount }, (_, i) => (
        <div key={`f-${i}`} className={`${styles.pawn} ${styles[color]}`} />
    ));

    const remainingPawns = Array.from(
        { length: 4 - finishedCount },
        (_, i) => <div key={`r-${i}`} className={`${styles.circle} ${styles.gray}`} />
    );

    return (
        <div className={styles.playerStatus}>
            <div className={styles.profile}>
                {name}
            </div>
            <div className={styles.diceBox}>
                {diceValue}
            </div>
            <div className={styles.circleGroup}>
                {finishedCircles}
                {remainingPawns}
            </div>
        </div>
    );
}
