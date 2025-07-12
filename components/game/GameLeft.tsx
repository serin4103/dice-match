import { GameLeftProps, Node, PawnPosition } from "@/types/game";
import ReadyPawns from "./ReadyPawns";
import styles from "./GameLeft.module.css";

export default function GameLeft({
    turn,
    setTurn,
    playerStates,
    setPlayerStates,
}: GameLeftProps) {
    // 폰 이동 로직
    const movePawn = (pawnIndex: number) => {
        if (turn !== playerStates[0].color) return;

        const stepsToMove = playerStates[0].diceValue;
        const pawnToMove = playerStates[0].pawns[pawnIndex];
        let currentPosition: PawnPosition;

        if (pawnToMove.position === "ready") {
            currentPosition = 0;
        } else {
            currentPosition = pawnToMove.position;
        }

        let remainingSteps = stepsToMove;

        // 첫 번째 노드에서 경로 선택 확인
        const initialNode = nodes.find((n) => n.index === currentPosition);
        if (initialNode && initialNode.candidate.length > 1) {
            // 경로 선택이 필요한 경우
            const choice = confirm(
                `경로를 선택하세요. 확인: ${initialNode.candidate[0].direction}, 취소: ${initialNode.candidate[1].direction}`
            );
            currentPosition = choice
                ? initialNode.candidate[0].next
                : initialNode.candidate[1].next;
            remainingSteps--;
        }

        while (remainingSteps > 0) {
            const node = nodes.find((n) => n.index === currentPosition);
            if (!node) break;

            currentPosition = node.subsequent;
            remainingSteps--;

            if (currentPosition === "finished") {
                break;
            }
        }

        // 플레이어 상태 업데이트
        setPlayerStates((prev) =>
            prev.map((player, idx) =>
                idx === 0 // playerIndex 대신 0으로 고정 (현재 Player 1만 이동)
                    ? {
                        ...player,
                        pawns: player.pawns.map((pawn, pawnIdx) =>
                            pawnIdx === pawnIndex
                                ? { ...pawn, position: currentPosition }
                                : pawn
                        ),
                    }
                    : player
            )
        );

        // 턴 종료
        setTurn(null);
    };

    // ReadyPawns 클릭 시 폰 이동
    const handleReadyPawnClick = () => {
        if (turn !== playerStates[0].color) return;

        // Ready 상태인 첫 번째 폰의 인덱스 찾기
        const readyPawnIndex = playerStates[0].pawns.findIndex(
            (pawn) => pawn.position === "ready"
        );

        if (readyPawnIndex === -1) return; // Ready 상태인 폰이 없으면 리턴

        // 폰을 시작 위치(노드 0)로 이동
        setPlayerStates((prev) =>
            prev.map((player, idx) =>
                idx === 0
                    ? {
                        ...player,
                        pawns: player.pawns.map((pawn, pawnIdx) =>
                            pawnIdx === readyPawnIndex
                                ? { ...pawn, position: 0 }
                                : pawn
                        ),
                    }
                    : player
            )
        );

        movePawn(readyPawnIndex); // 폰 이동 함수 호출
    };

    // 보드 위의 폰 렌더링
    const renderPawnsOnBoard = () => {
        const pawnsOnBoard: JSX.Element[] = [];

        playerStates.forEach((player, playerIndex) => {
            player.pawns.forEach((pawn, pawnIndex) => {
                if (typeof pawn.position === "number") {
                    const node = nodes.find((n) => n.index === pawn.position);
                    if (node) {
                        pawnsOnBoard.push(
                            <div
                                key={`${playerIndex}-${pawnIndex}`}
                                className={`${styles.pawn} ${
                                    styles[pawn.color]
                                }`}
                                style={{
                                    top: node.top,
                                    left: node.left,
                                    zIndex: 3,
                                }}
                                onClick={() => movePawn(pawnIndex)}
                            />
                        );
                    }
                }
            });
        });

        return pawnsOnBoard;
    };

    const nodes: Node[] = [
        { index: 0, top: "90%", left: "90%", subsequent: 1, candidate: [] },
        { index: 1, top: "74%", left: "90%", subsequent: 2, candidate: [] },
        { index: 2, top: "58%", left: "90%", subsequent: 3, candidate: [] },
        { index: 3, top: "42%", left: "90%", subsequent: 4, candidate: [] },
        { index: 4, top: "26%", left: "90%", subsequent: 5, candidate: [] },
        {
            index: 5,
            top: "10%",
            left: "90%",
            subsequent: 6,
            candidate: [
                { direction: "left", next: 6 },
                { direction: "left-down", next: 20 },
            ],
        },
        { index: 6, top: "10%", left: "74%", subsequent: 7, candidate: [] },
        { index: 7, top: "10%", left: "58%", subsequent: 8, candidate: [] },
        { index: 8, top: "10%", left: "42%", subsequent: 9, candidate: [] },
        { index: 9, top: "10%", left: "26%", subsequent: 10, candidate: [] },
        {
            index: 10,
            top: "10%",
            left: "10%",
            subsequent: 11,
            candidate: [
                { direction: "down", next: 11 },
                { direction: "right-down", next: 25 },
            ],
        },
        { index: 11, top: "26%", left: "10%", subsequent: 12, candidate: [] },
        { index: 12, top: "42%", left: "10%", subsequent: 13, candidate: [] },
        { index: 13, top: "58%", left: "10%", subsequent: 14, candidate: [] },
        { index: 14, top: "74%", left: "10%", subsequent: 15, candidate: [] },
        { index: 15, top: "90%", left: "10%", subsequent: 16, candidate: [] },
        { index: 16, top: "90%", left: "26%", subsequent: 17, candidate: [] },
        { index: 17, top: "90%", left: "42%", subsequent: 18, candidate: [] },
        { index: 18, top: "90%", left: "58%", subsequent: 19, candidate: [] },
        { index: 19, top: "90%", left: "74%", subsequent: 30, candidate: [] },
        { index: 20, top: "26%", left: "74%", subsequent: 21, candidate: [] },
        { index: 21, top: "38%", left: "64%", subsequent: 22, candidate: [] },
        {
            index: 22,
            top: "50%",
            left: "50%",
            subsequent: 23,
            candidate: [
                { direction: "left-down", next: 23 },
                { direction: "right-down", next: 28 },
            ],
        },
        { index: 23, top: "62%", left: "38%", subsequent: 24, candidate: [] },
        { index: 24, top: "74%", left: "26%", subsequent: 15, candidate: [] },
        { index: 25, top: "26%", left: "26%", subsequent: 26, candidate: [] },
        { index: 26, top: "38%", left: "38%", subsequent: 27, candidate: [] },
        { index: 27, top: "50%", left: "50%", subsequent: 28, candidate: [] },
        { index: 28, top: "62%", left: "62%", subsequent: 29, candidate: [] },
        { index: 29, top: "74%", left: "74%", subsequent: 30, candidate: [] },
        { index: 30, top: "90%", left: "90%", subsequent: "finished", candidate: [] },
    ];

    return (
        <div className={styles.gameLeft}>
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
                {renderPawnsOnBoard()}
            </div>
            <ReadyPawns
                color="blue"
                count={
                    playerStates[0].pawns.filter(
                        (pawn) => pawn.position === "ready"
                    ).length
                }
                onClick={handleReadyPawnClick}
            />
        </div>
    );
}
