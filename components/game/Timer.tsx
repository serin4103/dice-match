import { useEffect, useState, useRef } from "react";
import { TimerProps } from "@/types/game";
import styles from "./Timer.module.css";

export default function Timer({ duration, onTimeUp, diceReady }: TimerProps) {
    const [timeLeft, setTimeLeft] = useState(duration);
    const [isTimeUp, setIsTimeUp] = useState(false);
    const onTimeUpRef = useRef(onTimeUp);

    // onTimeUp 함수 참조 업데이트
    useEffect(() => {
        onTimeUpRef.current = onTimeUp;
    }, [onTimeUp]);

    useEffect(() => {
        if (timeLeft <= 0 && !isTimeUp) {
            setIsTimeUp(true);
            onTimeUpRef.current();
            return;
        }

        if (timeLeft <= 0 || diceReady) return; // 이미 완료된 경우 또는 주사위가 준비된 경우 타이머 중단

        const interval = setInterval(() => {
            setTimeLeft((prev) => prev - 0.1);
        }, 100);

        return () => clearInterval(interval);
    }, [timeLeft, isTimeUp, diceReady]);

    const percentage = Math.max((timeLeft / duration) * 100, 0);

    return (
        <div className={styles.timerContainer}>
            <div
                className={styles.timerFill}
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
}
