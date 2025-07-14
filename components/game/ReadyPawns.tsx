import { ReadyPawnsProps } from "@/types/game";
import styles from "./Pawns.module.css";

export default function ReadyPawns({
    color,
    pawns,
    onClick,
}: ReadyPawnsProps) {
    const readyPawns = Array.from(pawns, p => (
        <div
            key={`${color}${p.index}`}
            className={`${styles.pawn} ${styles.ready} ${styles[color]}`}
            style={{ zIndex: 4 - p.index }}
        />
    ));

    return (
        <div className={styles.readyPawns} onClick={onClick}>
            {readyPawns}
        </div>
    );
}
