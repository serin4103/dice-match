import { useGameState } from "../../contexts/GameStateContext";
import Image from "next/image";
import styles from "./Ending.module.css";

interface EndingProps {
    winner: number;
}

export default function Ending({ winner }: EndingProps) {
    const { playersState, myId } = useGameState();

    if (!playersState || playersState.length === 0) {
        return null;
    }

    // winner는 사용자 ID이므로, myId와 비교하여 승자 인덱스 결정
    const winnerIndex = winner === myId ? 0 : 1;
    const loserIndex = winner === myId ? 1 : 0;

    const winnerPlayer = playersState[winnerIndex];
    const loserPlayer = playersState[loserIndex];

    if (!winnerPlayer || !loserPlayer) {
        return null;
    }

    const isMyWin = winner === myId;
    const winnerName = winnerPlayer.name;
    const winnerProfilePic = winnerPlayer.profilePic 
        ? `${winnerPlayer.profilePic}` 
        : "/default_profile_image.png";
    const loserName = loserPlayer.name;
    const loserProfilePic = loserPlayer.profilePic 
        ? `${loserPlayer.profilePic}` 
        : "/default_profile_image.png";

    return (
        <div className={styles.endingContainer}>
            <div className={styles.playersContainer}>
                {/* 승자 */}
                <div className={styles.playerSection}>
                    <div className={styles.profileWrapper}>
                        <div className={styles.crownContainer}>
                            <Image 
                                src="/crown.svg" 
                                alt="Crown" 
                                width={80} 
                                height={60}
                                className={styles.crown}
                            />
                        </div>
                        <div 
                            className={styles.profilePic}
                            style={{
                                backgroundImage: `url(${winnerProfilePic})`,
                            }}
                        />
                    </div>
                    <div className={styles.playerName}>{winnerName}</div>
                </div>

                <div className={styles.vsText}>VS</div>

                {/* 패자 */}
                <div className={styles.playerSection}>
                    <div className={styles.profileWrapper}>
                        <div 
                            className={styles.profilePic}
                            style={{
                                backgroundImage: `url(${loserProfilePic})`,
                            }}
                        />
                    </div>
                    <div className={styles.playerName}>{loserName}</div>
                </div>
            </div>

            <div className={styles.resultText}>
                {isMyWin ? "게임 승리!" : "게임 종료!"}
            </div>
        </div>
    );
}