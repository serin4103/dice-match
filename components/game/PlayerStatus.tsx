import { StatusProps } from "@/types/game";
import styles from "./PlayerStatus.module.css";
import diceStyles from "./DiceBuilder.module.css";
import pawnStyles from "./Pawns.module.css";
import { useGameState } from "../../contexts/GameStateContext";
import { useState } from "react";

export default function PlayerStatus({ playerIndex }: StatusProps) {
    const { playersState, myId, opponentId, turn } = useGameState();
    const [showDiceModal, setShowDiceModal] = useState(false);

    // 안전한 접근을 위한 검사
    if (!playersState[playerIndex]) {
        return null; // 플레이어 데이터가 없으면 렌더링하지 않음
    }

    const name = playersState[playerIndex].name;
    const profilePic =
        playersState[playerIndex].profilePic || "defaultProfilePic.png"; // 기본 프로필 사진 설정
    const diceResult = playersState[playerIndex].diceResult;
    const color = playersState[playerIndex].color;
    const diceValues = playersState[playerIndex].diceValues || [];
    const finishedCount =
        playersState[playerIndex].pawnsState?.filter(
            (pawn) => pawn.position === "finished"
        ).length || 0;

    // DiceBox 클릭 핸들러
    const handleDiceBoxClick = () => {
        if (
            playerIndex === 1 &&
            diceValues.length > 0 &&
            !diceValues.includes(0)
        ) {
            setShowDiceModal(true);
        }
    };

    // 모달 닫기 핸들러
    const handleCloseModal = () => {
        setShowDiceModal(false);
    };

    const finishedCircles = Array.from({ length: finishedCount }, (_, i) => (
        <div key={`f-${i}`} className={`${pawnStyles.pawn} ${styles[color]}`} />
    ));

    const remainingPawns = Array.from({ length: 4 - finishedCount }, (_, i) => (
        <div key={`r-${i}`} className={`${styles.circle} ${styles.gray}`} />
    ));

    return (
        <>
            <div className={styles.playerStatus}>
                <div className={styles.profile}>
                    <div
                        className={styles.profilePic}
                        style={{
                            backgroundImage: profilePic
                                ? `url(${profilePic})`
                                : undefined,
                        }}
                    />
                    <div className={styles.playerName}>{name}</div>
                </div>
                <div
                    className={`
                    ${styles.diceBox} 
                    ${turn === myId && playerIndex === 0 ? styles[color] : ""}
                    ${turn === opponentId && playerIndex === 1 ? styles[color] : ""}
                    ${playerIndex === 1 && diceValues.length > 0 && !diceValues.includes(0) ? styles.clickable : ""}
                    `}
                    onClick={handleDiceBoxClick}
                >
                    {diceResult !== 0 && diceResult}
                </div>
                <div className={styles.circleGroup}>
                    {finishedCircles}
                    {remainingPawns}
                </div>
            </div>

            {/* 주사위 값 모달 */}
            {showDiceModal && !diceValues.includes(0) && (
                <div className={styles.modalOverlay} onClick={handleCloseModal}>
                    <div
                        className={styles.diceModal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className={styles.closeButton}
                            onClick={handleCloseModal}
                        >
                            ×
                        </button>
                        <div className={diceStyles.diceNet}>
                            {diceValues.map((value, index) => (
                                <div
                                    key={index}
                                    style={{ padding: "1px" }}
                                    className={`
                                ${diceStyles.diceFace} 
                                ${diceStyles[`face${index}`]} ${playersState[1]?.color === "blue" ? styles.blue : styles.red}
                                `}
                                >
                                    {value}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
