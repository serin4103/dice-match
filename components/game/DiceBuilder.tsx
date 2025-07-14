import { useState, useCallback, useEffect } from "react";
import Timer from "./Timer";
import { DiceBuilderProps } from "@/types/game";
import styles from "./DiceBuilder.module.css";

export default function DiceBuilder({
    turn,
    duration,
    buildDice,
    maxSum,
}: DiceBuilderProps) {
    const [faces, setFaces] = useState<(number | "")[]>([
        "",
        "",
        "",
        "",
        "",
        "",
    ]);
    const [diceReady, setDiceReady] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [timerKey, setTimerKey] = useState(0); // 타이머를 리셋하기 위한 키

    // turn이 0이 되면 상태 초기화
    useEffect(() => {
        if (turn === 0) {
            setFaces(["", "", "", "", "", ""]);
            setDiceReady(false);
            setErrorMessage("");
            setTimerKey(prev => prev + 1); // 타이머 컴포넌트를 리마운트하여 리셋
        }
    }, [turn]);

    const sum = faces.reduce((acc: number, val) => {
        return acc + (typeof val === "number" ? val : 0);
    }, 0) as number;

    const handleSubmit = useCallback(() => {
        if (sum <= maxSum && faces.every((f) => f !== "")) {
            setDiceReady(true);
            buildDice(faces as number[]);
        } else {
            setErrorMessage(
                `총합이 ${maxSum} 이하가 되도록 모든 면에 1~5 사이의 숫자를 입력하세요`
            );
        }
    }, [faces, sum, buildDice, maxSum]);

    const handleChange = (value: string, idx: number) => {
        const num = parseInt(value, 10);
        const newSum = sum + (value === "" ? 0 : num);
        if (newSum > maxSum) {
            setErrorMessage(
                `총합이 ${maxSum} 이하가 되도록 모든 면에 1~5 사이의 숫자를 입력하세요`
            );
        } else if (value === "" || (num >= 0 && num <= 5)) {
            const updated = [...faces];
            updated[idx] = value === "" ? "" : num;
            setFaces(updated);
            setErrorMessage("");
        }
    };

    const handleTimeUp = () => {
        if (diceReady) return; // 이미 완료된 경우 중복 실행 방지

        let finalFaces: number[];

        if (faces.some((f) => f === "")) {
            // 자동 완성 로직
            let currentSum = 0;
            let randomFaces = Array.from({ length: 6 }, (_, i) => {
                const randomFace = Math.floor(
                    Math.random() * Math.min(5, maxSum - (6 - i) - currentSum) +
                        1
                );
                currentSum += randomFace;
                return randomFace;
            });
            setFaces(randomFaces);
            finalFaces = randomFaces; // 새로 생성된 값 사용
        } else {
            finalFaces = faces as number[]; // 기존 값 사용
        }

        buildDice(finalFaces); // 올바른 값으로 호출
        setDiceReady(true); // 주사위가 완성되었음을 표시
    };

    return (
        <div className={styles.diceBuilderContainer}>
            <Timer 
                key={timerKey} 
                duration={duration} 
                onTimeUp={handleTimeUp} 
                diceReady={diceReady}
            />
            <div className={styles.diceBuilderContent}>
                <div className={styles.diceNet}>
                    {faces.map((value, idx) => (
                        <input
                            key={idx}
                            type="number"
                            min={1}
                            max={5}
                            value={value}
                            onChange={(e) => handleChange(e.target.value, idx)}
                            className={`
                                ${styles.diceFace} 
                                ${styles[`face${idx}`]}
                                ${diceReady ? styles.diceReady : ""}
                                `}
                            disabled={diceReady}
                        />
                    ))}
                </div>
                <div className={styles.diceSummary}>
                    <p>사용한 눈: {sum}</p>
                    <p>남은 눈: {maxSum - sum}</p>
                    <button onClick={handleSubmit}>완료</button>
                </div>
            </div>
            <div className={styles.errorMessage}>{errorMessage}</div>
        </div>
    );
}
