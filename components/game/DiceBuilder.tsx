import { useState, useCallback } from "react";
import Timer from "./Timer";
import styles from "./DiceBuilder.module.css";

const MAXSUM = 18;

interface DiceBuilderProps {
    duration: number; // seconds
    buildDice: (faces: number[]) => void;
}

export default function DiceBuilder({
    duration,
    buildDice,
}: DiceBuilderProps) {
    const [faces, setFaces] = useState<(number | "")[]>([
        "",
        "",
        "",
        "",
        "",
        "",
    ]);

    const sum = faces.reduce((acc: number, val) => {
        return acc + (typeof val === "number" ? val : 0);
    }, 0) as number;

    const handleSubmit = useCallback(() => {
        if (sum <= MAXSUM && faces.every((f) => f !== "")) {
            buildDice(faces as number[]);
        } else {
            alert(
                "총합이 18 이하가 되도록 모든 면에 0~5 사이의 숫자를 입력하세요"
            );
        }
    }, [faces, sum, buildDice]);

    const handleChange = (value: string, idx: number) => {
        const num = parseInt(value, 10);
        if (value === "" || (num >= 0 && num <= 5)) {
            const updated = [...faces];
            updated[idx] = value === "" ? "" : num;
            setFaces(updated);
        }
    };

    const handleTimeUp = () => {
        if (sum <= MAXSUM && faces.every((f) => f !== "")) {
            buildDice(faces as number[]);
        }
        else {
            let filled: number[] = [...faces].map((f) =>
                typeof f === "number" ? f : 0
            );

            // Fill empty slots with random numbers 1-5
            for (let i = 0; i < filled.length; i++) {
                if (filled[i] === 0) {
                    filled[i] = 1;
                }
            }

            // Adjust to ensure total sum is <= 18
            let currentSum = filled.reduce((a, b) => a + b, 0);
            while (currentSum > 18) {
                const i = Math.floor(Math.random() * filled.length);
                if (filled[i] > 1) {
                    filled[i]--;
                    currentSum--;
                }
            }

            buildDice(filled);
        }
    }

    return (
        <div className={styles.diceBuilderContainer}>
            <Timer duration={duration} onTimeUp={handleTimeUp} />
            <div className={styles.diceBuilderContent}>
                <div className={styles.diceNet}>
                    {faces.map((value, idx) => (
                        <input
                            key={idx}
                            type="number"
                            min={0}
                            max={5}
                            value={value}
                            onChange={(e) => handleChange(e.target.value, idx)}
                            className={`${styles.diceFace} ${
                                styles[`face${idx}`]
                            }`}
                        />
                    ))}
                </div>
                <div className={styles.diceSummary}>
                    <p>사용한 눈: {sum}</p>
                    <p>남은 눈: {MAXSUM - sum}</p>
                    <button onClick={handleSubmit}>완료</button>
                </div>
            </div>
        </div>
    );
}