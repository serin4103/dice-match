import { useEffect, useState } from "react";
import styles from "./Timer.module.css";

interface TimerProps {
    duration: number; // seconds
    onTimeUp?: () => void;
}

export default function Timer({ duration, onTimeUp }: TimerProps) {
    const [timeLeft, setTimeLeft] = useState(duration);

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeUp?.();
            return;
        }
        const interval = setInterval(() => {
            setTimeLeft((prev) => prev - 0.1);
        }, 100);

        return () => clearInterval(interval);
    }, [timeLeft, onTimeUp]);

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
