import { ReadyPawnsProps } from "@/types/game";
import styles from "./Pawns.module.css";

export default function ReadyPawns({
    color,
    count,
    onClick,
}: ReadyPawnsProps) {
    const readyPawns = Array.from({ length: count }, (_, i) => (
        <div
            key={`${color}${i}`}
            className={`${styles.pawn} ${styles[color]}`}
            style={{ zIndex: 4 - i }}
        />
    ));

    return (
        <div className={styles.readyPawns} onClick={onClick}>
            {readyPawns}
        </div>
    );
}
