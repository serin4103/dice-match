import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { DiceRolledEvent, PawnsMovedEvent, PawnPosition, stringToMap } from "@/types/game";
import GameLeft from "@/components/game/GameLeft";
import GameRight from "@/components/game/GameRight";
import { useSocket } from "../../contexts/SocketContext";
import { useGameState } from "../../contexts/GameStateContext";
import styles from "./Game.module.css";

export default function Game() {
    const router = useRouter();
    const { gameId: rawGameId } = router.query;
    
    // gameId를 안전하게 문자열로 변환
    const gameId = Array.isArray(rawGameId) ? rawGameId[0] : rawGameId;
    
    const { data: session } = useSession();
    const { socket, isConnected } = useSocket();
    const { playersState, setPlayersState, myId, opponentId } = useGameState();
    const [readyToMove, setReadyToMove] = useState<boolean>(false);
    const [turn, setTurn] = useState<number>(0);


    useEffect(() => {
        // gameId가 문자열이고 소켓이 연결된 경우에만 실행
        if (socket && isConnected && gameId && typeof gameId === 'string') {
            console.log("🎮 Game page loaded for gameId:", gameId);

            const handleDiceRolled = (data: DiceRolledEvent) => {
                console.log("🎲 Dice rolled:", data);
                // 주사위 결과 처리

                const diceValuesMap = stringToMap<number, number>(data.diceValues);
                const diceResultsMap = stringToMap<number, number>(data.diceResults);

                setPlayersState((prevState) => [
                    {
                        ...prevState[0],
                        diceResult: diceResultsMap[myId],
                    },
                    {
                        ...prevState[1],
                        diceValues: diceValuesMap[opponentId],
                        diceResult: diceResultsMap[opponentId],
                    },
                ]);

                setTurn(data.turn);
                if (data.turn === myId) {
                    setReadyToMove(true);
                }
            };

            const handlePawnsMoved = (data: PawnsMovedEvent) => {
                console.log("♟️ Pawns moved:", data);
                // 말 이동 처리

                const moveOneStep = (userIndex: number, pawnsIndex: number[], toNode: PawnPosition) => {
                    setPlayersState((prevState) => {
                        const newPawns = [...prevState[userIndex].pawnsState];
                        pawnsIndex.forEach(pawnIndex => {
                            newPawns[pawnIndex].position = toNode;
                        });
                        return prevState.map((state, index) =>
                            index === userIndex ? { ...state, pawnsState: newPawns } : state
                        );
                    });
                };
                
                data.animation.forEach((anim) => {
                    const userIndex = anim.userId === myId ? 0 : 1;
                    setTimeout(moveOneStep, 1000, userIndex, anim.pawnsIndex, anim.toNode);
                });

                socket.emit("animationEnd", {
                    gameId: gameId as string,
                    userId: myId
                })
            };

            const handlePlayerLeft = (data: any) => {
                console.log("👋 Player left:", data);
                // 플레이어 나감 처리

                alert("😢 상대 플레이어가 게임을 나갔습니다.");
                router.replace("/");
            };

            const handleNewTurnStart = () => {
                console.log("🔄 New turn started");
                // 새 턴 시작 처리

                setTurn(0);
            };

            socket.on("diceRolled", handleDiceRolled);
            socket.on("pawnsMoved", handlePawnsMoved);
            socket.on("playerLeft", handlePlayerLeft);
            socket.on("newTurnStart", handleNewTurnStart);

            // 게임 룸에 참가 (이미 연결된 소켓 사용)
            socket.emit('startGame', {
                gameId: gameId,
            });

            // cleanup: 컴포넌트 언마운트 시 리스너만 제거
            return () => {
                socket.off("diceRolled", handleDiceRolled);
                socket.off("pawnsMoved", handlePawnsMoved);
                socket.off("playerLeft", handlePlayerLeft);
                socket.off("newTurnStart", handleNewTurnStart);
            };
        }
    }, [socket, isConnected, gameId, myId, opponentId, playersState, setPlayersState, setTurn, router]);

    // gameId가 로드되지 않았거나 유효하지 않은 경우
    if (!gameId || typeof gameId !== 'string') {
        return (
            <div style={{
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px"
            }}>
                게임 정보를 불러오는 중...
            </div>
        );
    }
    
    return (
        <div className={styles.gameContainer}>
            <GameLeft
                readyToMove={readyToMove}
                setReadyToMove={setReadyToMove}
            />
            <GameRight
                turn={turn}
            />
        </div>
    );
}
