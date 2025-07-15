import { GameLeftProps, Node } from "@/types/game";
import { useState, useCallback, useMemo } from "react";
import ReadyPawns from "./ReadyPawns";
import { useSocket } from "../../contexts/SocketContext";
import { useGameState } from "../../contexts/GameStateContext";
import pawnStyles from "./Pawns.module.css";
import styles from "./GameLeft.module.css";

export default function GameLeft({
    readyToMove,
    setReadyToMove
}: GameLeftProps) {

    const { socket } = useSocket();
    const { gameId, playersState, setPlayersState, myId, opponentId } = useGameState();
    const [multiPathNode, setMultiPathNode] = useState<Node | null>(null); 

    const nodes: Node[] = useMemo(() => [
        { index: 0, top: "90%", left: "90%", subsequent: 1, candidate: [] },
        { index: 1, top: "74%", left: "90%", subsequent: 2, candidate: [] },
        { index: 2, top: "58%", left: "90%", subsequent: 3, candidate: [] },
        { index: 3, top: "42%", left: "90%", subsequent: 4, candidate: [] },
        { index: 4, top: "26%", left: "90%", subsequent: 5, candidate: [] },
        { index: 5, top: "10%", left: "90%", subsequent: 6, candidate: 
            [
                { direction: "left", next: 6 },
                { direction: "left-down", next: 20 },
            ],
        },
        { index: 6, top: "10%", left: "74%", subsequent: 7, candidate: [] },
        { index: 7, top: "10%", left: "58%", subsequent: 8, candidate: [] },
        { index: 8, top: "10%", left: "42%", subsequent: 9, candidate: [] },
        { index: 9, top: "10%", left: "26%", subsequent: 10, candidate: [] },
        { index: 10, top: "10%", left: "10%", subsequent: 11, candidate: 
            [
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
        { index: 22, top: "50%", left: "50%", subsequent: 23, candidate: 
            [
                { direction: "left-down", next: 23 },
                { direction: "right-down", next: 28 },
            ],
        },
        { index: 23, top: "62%", left: "38%", subsequent: 24, candidate: [] },
        { index: 24, top: "74%", left: "26%", subsequent: 15, candidate: [] },
        { index: 25, top: "26%", left: "26%", subsequent: 26, candidate: [] },
        { index: 26, top: "38%", left: "38%", subsequent: 27, candidate: [] },
        { index: 27, top: "50%", left: "50%", subsequent: 28, candidate: 
            [
                { direction: "right-down", next: 28 },
                { direction: "left-down", next: 29 },
            ] 
        },
        { index: 28, top: "62%", left: "62%", subsequent: 29, candidate: [] },
        { index: 29, top: "74%", left: "74%", subsequent: 30, candidate: [] },
        { index: 30, top: "90%", left: "90%", subsequent: "finished", candidate: [] },
    ], []); 

    const handlePawnClick = (playerIndex, pawnIndex) => {
        
        if (!readyToMove || playerIndex !== 0 || !playersState[0]?.pawnsState) {
            return;
        }
        setReadyToMove(false);

        const pawnToMove = playersState[0].pawnsState[pawnIndex];
        if (!pawnToMove) return;
        
        const initialPosition = (pawnToMove.position === "ready") ? 0 : pawnToMove.position;

        if (initialPosition === 0) {
            // Ready 상태인 폰을 클릭했을 때
            const animations = [{ userId: myId, pawnsIndex: [pawnIndex], fromNode: "ready", toNode: 1 }];
            movePawns([pawnToMove], 1, animations);
            return;
        }

        // 첫 번째 노드에서 경로 선택 확인
        const initialNode = nodes.find((n) => n.index === initialPosition);
        if (initialNode && initialNode.candidate.length === 0) {
            const pawnsToMove = playersState[0].pawnsState.filter(pawn => pawn.position === initialPosition);
            movePawns(pawnsToMove, initialPosition, []);
        } else if (initialNode) {
            setMultiPathNode(initialNode);
        }
    }

    const handleArrowClick = (pathIndex) => {
        const pawnsToMove = playersState[0].pawnsState.filter(pawn => pawn.position === multiPathNode.index);
        const pawnsIndex = pawnsToMove.map(pawn => pawn.index);
        const toNode = multiPathNode.candidate[pathIndex].next;
        const animations = [{ userId: myId, pawnsIndex: pawnsIndex, fromNode: multiPathNode.index, toNode: toNode }];
        movePawns(pawnsToMove, toNode, animations);
        setMultiPathNode(null); // 화살표 선택 후 숨기기
    };

    // 폰 이동 로직
    const movePawns = useCallback((pawnsToMove, initialPosition, animations) => {
        if (!playersState[0]?.diceResult) return;

        const stepsToMove = playersState[0].diceResult;
        let currentPosition = initialPosition;

        while (animations.length < stepsToMove) {
            const node = nodes.find((n) => n.index === currentPosition);
            if (!node) break;

            const nextPosition = node.subsequent;
            animations.push({
                userId: myId,
                pawnsIndex: pawnsToMove.map(p => p.index),
                fromNode: currentPosition,
                toNode: nextPosition
            });
            currentPosition = nextPosition;

            if (currentPosition === "finished") {
                break;
            }
        }

        const cathedPawns = currentPosition === "finished"
            ? []
            : (playersState[1]?.pawnsState?.filter((pawn) => pawn.position === currentPosition) || []);

        // 상태 업데이트를 한 번에 처리
        setPlayersState((prevState) => {
            // 현재 상태 유효성 검사
            if (!prevState[0]?.pawnsState || !prevState[1]?.pawnsState) {
                return prevState;
            }

            let newState = [...prevState];

            // 22번 위치 특수 처리
            if (currentPosition === 22) {
                const pawns27 = prevState[1].pawnsState.filter(pawn => pawn.position === 27);
                cathedPawns.push(...pawns27);
                
                const pawnsToStack = prevState[0].pawnsState.filter(pawn => pawn.position === 27);
                const newPawnsState = [...prevState[0].pawnsState];
                pawnsToStack.forEach(pawn => {
                    newPawnsState[pawn.index] = { ...newPawnsState[pawn.index], position: 22 };
                });
                newState[0] = { ...newState[0], pawnsState: newPawnsState };
            }
            
            // 27번 위치 특수 처리
            else if (currentPosition === 27) {
                const pawns22 = prevState[1].pawnsState.filter(pawn => pawn.position === 22);
                cathedPawns.push(...pawns22);
                
                const pawnsToStack = prevState[0].pawnsState.filter(pawn => pawn.position === 22);
                const newPawnsState = [...prevState[0].pawnsState];
                pawnsToStack.forEach(pawn => {
                    newPawnsState[pawn.index] = { ...newPawnsState[pawn.index], position: 27 };
                });
                newState[0] = { ...newState[0], pawnsState: newPawnsState };
            }

            return newState;
        });

        if (cathedPawns.length > 0) {
            // 상대 폰을 잡은 경우
            animations.push({
                userId: opponentId,
                pawnsIndex: cathedPawns.map(p => p.index),
                fromNode: currentPosition,
                toNode: "ready"
            });
        }

        console.log("movePawns animations:", animations);
        setTimeout(() => {
            socket.emit("movePawns", {
                gameId: gameId,
                animations: animations
            });}, 1000); // 1초 후 서버로 전송

        // 서버로 애니메이션 데이터 전송
        
    }, [nodes, playersState, myId, opponentId, gameId, socket, setPlayersState]);

    // ReadyPawns 클릭 시 폰 이동
    const handleReadyPawnClick = () => {
        if (!readyToMove || !playersState[0]?.pawnsState) return;

        // Ready 상태인 첫 번째 폰의 인덱스 찾기
        const readyPawnIndex = playersState[0].pawnsState.findIndex(
            (pawn) => pawn.position === "ready"
        );

        if (readyPawnIndex !== -1) {
            handlePawnClick(0, readyPawnIndex); // 폰 이동 함수 호출
        }
    };

    // 보드 위의 폰 렌더링
    const renderPawnsOnBoard = () => {
        const pawnsOnBoard: JSX.Element[] = [];

        // 각 위치별 현재까지 렌더된 폰 인덱스 추적
        const renderedPawns: { [position: number]: number[] } = {};

        if (!playersState || playersState.length === 0) {
            return pawnsOnBoard; // 플레이어 상태가 없으면 빈 배열 반환
        }

        playersState.forEach((player, playerIndex) => {
            // player와 pawnsState가 존재하고 배열인지 확인
            if (player && player.pawnsState && Array.isArray(player.pawnsState)) {
                player.pawnsState.forEach((pawn) => {
                    if (typeof pawn.position === "number") {
                        const node = nodes.find((n) => n.index === pawn.position);
                        if (node) {
                            renderedPawns[pawn.position] =
                                renderedPawns[pawn.position] || [];
                            const currentCount =
                                renderedPawns[pawn.position].length;
                            renderedPawns[pawn.position].push(pawn.index);

                            pawnsOnBoard.push(
                                <div
                                    key={`${pawn.color}-${pawn.index}`}
                                    className={`${pawnStyles.pawn} ${
                                        pawnStyles[pawn.color]
                                    } ${pawnStyles.onBoard}`}
                                    style={{
                                        top: node.top,
                                        left: node.left,
                                        transform: `translate(-50%, -${
                                            50 + 15 * currentCount
                                        }%)`,
                                        zIndex: 3 + currentCount,
                                    }}
                                    onClick={() =>
                                        handlePawnClick(
                                            playerIndex,
                                            renderedPawns[pawn.position][0]
                                        )
                                    }
                                />
                            );
                        }
                    }
                });
            }
        });

        return pawnsOnBoard;
    };

    const renderArrows = () => {
        if (!multiPathNode) return null;

        const arrows = [];

        const rotateArrow = (direction) => {
            switch (direction) {
            case "right":
                return "rotate(90deg)";
            case "right-down":
                return "rotate(135deg)";
            case "down":
                return "rotate(180deg)";
            case "left-down":
                return "rotate(225deg)";
            case "left":
                return "rotate(270deg)";
            default:
                return "rotate(0deg)";
            }
        };

        multiPathNode.candidate.forEach((path, index) => {
            arrows.push(
                <div
                    key={`arrow-${index}`}
                    className={styles.arrow}
                    onClick={() => handleArrowClick(index)}
                    style={{
                        top: multiPathNode.top,
                        left: multiPathNode.left,
                        transform: `translate(-50%, -50%) ${rotateArrow(path.direction)}`,
                        marginLeft: `${(index - 0.5) * 60}px`, // 화살표들을 좌우로 분산
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#333',
                        cursor: 'pointer',
                        userSelect: 'none'
                    }}
                >
                    ↑
                </div>
            );
        });

        return arrows;
    }

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
                        strokeWidth="3"
                    />
                    <line
                        x1="90%"
                        y1="10%"
                        x2="10%"
                        y2="10%"
                        stroke="#e6e6e6"
                        strokeWidth="3"
                    />
                    <line
                        x1="10%"
                        y1="10%"
                        x2="10%"
                        y2="90%"
                        stroke="#e6e6e6"
                        strokeWidth="3"
                    />
                    <line
                        x1="10%"
                        y1="90%"
                        x2="90%"
                        y2="90%"
                        stroke="#e6e6e6"
                        strokeWidth="3"
                    />
                    <line
                        x1="10%"
                        y1="10%"
                        x2="90%"
                        y2="90%"
                        stroke="#e6e6e6"
                        strokeWidth="3"
                    />
                    <line
                        x1="90%"
                        y1="10%"
                        x2="10%"
                        y2="90%"
                        stroke="#e6e6e6"
                        strokeWidth="3"
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
                {renderArrows()}
            </div>
            <ReadyPawns
                color={playersState[0]?.color || "blue"}
                pawns={playersState[0]?.pawnsState?.filter(
                    (pawn) => pawn.position === "ready"
                ) || []}
                onClick={handleReadyPawnClick}
            />
        </div>
    );
}
