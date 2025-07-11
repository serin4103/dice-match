import styles from "./Board.module.css";

export default function Board() {
    type Direction = "up" | "down" | "left" | "right" | "left-down" | "right-down";

    interface Path {
        direction: Direction;
        next: number;
    }

    interface Node {
        index: number;
        top: string;
        left: string;
        subsequent: number; // 현재 노드가 경유 노드일 때 다음 노드
        candidate: Path[]; // 경로를 선택할 수 있는 경우
    }

    const nodes: Node[] = [
        { index: 0, top: "90%", left: "90%", subsequent: 1, candidate: [] },
        { index: 1, top: "74%", left: "90%", subsequent: 2, candidate: [] },
        { index: 2, top: "58%", left: "90%", subsequent: 3, candidate: [] },
        { index: 3, top: "42%", left: "90%", subsequent: 4, candidate: [] },
        { index: 4, top: "26%", left: "90%", subsequent: 5, candidate: [] },
        { index: 5, top: "10%", left: "90%", subsequent: 6, candidate: [
            { direction: "left", next: 6 }, { direction: "left-down", next: 19 }
        ] },
        { index: 6, top: "10%", left: "74%", subsequent: 7, candidate: [] },
        { index: 7, top: "10%", left: "58%", subsequent: 8, candidate: [] },
        { index: 8, top: "10%", left: "42%", subsequent: 9, candidate: [] },
        { index: 9, top: "10%", left: "26%", subsequent: 10, candidate: [] },
        { index: 10, top: "10%", left: "10%", subsequent: 11, candidate: [
            { direction: "down", next: 11 }, { direction: "right-down", next: 24 }
        ] },
        { index: 11, top: "26%", left: "10%", subsequent: 12, candidate: [] },
        { index: 12, top: "42%", left: "10%", subsequent: 13, candidate: [] },
        { index: 13, top: "58%", left: "10%", subsequent: 14, candidate: [] },
        { index: 14, top: "74%", left: "10%", subsequent: 15, candidate: [] },
        { index: 15, top: "90%", left: "10%", subsequent: 16, candidate: [] },
        { index: 16, top: "90%", left: "26%", subsequent: 17, candidate: [] },
        { index: 17, top: "90%", left: "42%", subsequent: 18, candidate: [] },
        { index: 18, top: "90%", left: "58%", subsequent: 19, candidate: [] },
        { index: 19, top: "90%", left: "74%", subsequent: 0, candidate: [] },
        { index: 20, top: "26%", left: "74%", subsequent: 21, candidate: [] },
        { index: 21, top: "38%", left: "64%", subsequent: 22, candidate: [] },
        { index: 22, top: "50%", left: "50%", subsequent: 23, candidate: [
            { direction: "left-down", next: 22 }, { direction: "right-down", next: 28 }
        ] },
        { index: 23, top: "62%", left: "38%", subsequent: 24, candidate: [] },
        { index: 24, top: "74%", left: "26%", subsequent: 15, candidate: [] },
        { index: 25, top: "26%", left: "26%", subsequent: 26, candidate: [] },
        { index: 26, top: "38%", left: "38%", subsequent: 27, candidate: [] },
        { index: 27, top: "50%", left: "50%", subsequent: 28, candidate: [] },
        { index: 28, top: "62%", left: "62%", subsequent: 29, candidate: [] },
        { index: 29, top: "74%", left: "74%", subsequent: 0, candidate: [] },
    ];


    return (
        <div className={styles.boardContainer}>
            <svg className={styles.boardLines}>
                <line
                    x1="90%"
                    y1="90%"
                    x2="90%"
                    y2="10%"
                    stroke="#e6e6e6"
                    strokeWidth="5"
                />
                <line
                    x1="90%"
                    y1="10%"
                    x2="10%"
                    y2="10%"
                    stroke="#e6e6e6"
                    strokeWidth="5"
                />
                <line
                    x1="10%"
                    y1="10%"
                    x2="10%"
                    y2="90%"
                    stroke="#e6e6e6"
                    strokeWidth="5"
                />
                <line
                    x1="10%"
                    y1="90%"
                    x2="90%"
                    y2="90%"
                    stroke="#e6e6e6"
                    strokeWidth="5"
                />
                <line
                    x1="10%"
                    y1="10%"
                    x2="90%"
                    y2="90%"
                    stroke="#e6e6e6"
                    strokeWidth="5"
                />
                <line
                    x1="90%"
                    y1="10%"
                    x2="10%"
                    y2="90%"
                    stroke="#e6e6e6"
                    strokeWidth="5"
                />
            </svg>
            {nodes.map((n, i) => (
                <div
                    key={i}
                    className={styles.boardNode}
                    style={{
                        top: n.top,
                        left: n.left,
                        zIndex: 2,
                    }}
                />
            ))}
        </div>
    );
}