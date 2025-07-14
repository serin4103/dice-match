import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { PlayerState, GameState, DiceRolledEvent, PawnsMovedEvent, PawnPosition, stringToMap } from "@/types/game";
import GameLeft from "@/components/game/GameLeft";
import GameRight from "@/components/game/GameRight";
import { useSocket } from "../../contexts/SocketContext";
import styles from "./Game.module.css";

export default function Game() {
    const router = useRouter();
    const { gameId } = router.query;
    const { data: session } = useSession();
    const { socket, isConnected } = useSocket();
    const [readyToMove, setReadyToMove] = useState<boolean>(false);
    const [turn, setTurn] = useState<number>(0);
    const [playersState, setPlayersState] = useState<PlayerState[]>([]);
    const [opponentId, setOpponentId] = useState<number | null>(null);

    useEffect(() => {
        if (socket && isConnected && gameId) {
            console.log("🎮 Game page loaded for gameId:", gameId);

            const handleGameState = (gameState: GameState) => {
                console.log("🔄 Game state received:", gameState);

                const newPlayersState: PlayerState[] = [];
                const playersStateMap = stringToMap<number, PlayerState>(gameState.playersState);
                
                // GameState의 playersState는 Map<number, PlayerState>이므로 배열로 변환
                if (gameState.playersState) {
                    setOpponentId(playersStateMap.keys().filter(id => id !== session.user.id)[0]);
                    newPlayersState.push(playersStateMap[session.user.id]);
                    newPlayersState.push(playersStateMap[opponentId]);
                }
            };

            const handleDiceRolled = (data: DiceRolledEvent) => {
                console.log("🎲 Dice rolled:", data);
                // 주사위 결과 처리

                const diceValuesMap = stringToMap<number, number>(data.diceValues);
                const diceResultsMap = stringToMap<number, number>(data.diceResults);

                setPlayersState((prevState) => [
                    {
                        ...prevState[0],
                        diceResult: diceResultsMap[session.user.id],
                    },
                    {
                        ...prevState[1],
                        diceValues: diceValuesMap[opponentId],
                        diceResult: diceResultsMap[opponentId],
                    },
                ]);

                setTurn(data.turn);
                if (data.turn === session.user.id) {
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
                    const userIndex = anim.userId === session.user.id ? 0 : 1;
                    setTimeout(moveOneStep, 1000, userIndex, anim.pawnsIndex, anim.toNode);
                });

                socket.emit("animationEnd", {
                    gameId: gameId as string,
                    userId: session.user.id
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

            socket.on("gameState", handleGameState);
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
                socket.off("gameState", handleGameState);
                socket.off("diceRolled", handleDiceRolled);
                socket.off("pawnsMoved", handlePawnsMoved);
                socket.off("playerLeft", handlePlayerLeft);
                socket.off("newTurnStart", handleNewTurnStart);
            };
        }
    }, [socket, isConnected, gameId, session, opponentId, setPlayersState, setTurn, router]);

    
    return (
        <div className={styles.gameContainer}>
            <GameLeft
                gameId={gameId as string}
                readyToMove={readyToMove}
                setReadyToMove={setReadyToMove}
                playersState={playersState}
                setPlayersState={setPlayersState}
                myId={session.user.id}
                opponentId={opponentId}
            />
            <GameRight
                gameId={gameId as string}
                turn={turn}
                playersState={playersState}
                myId={session.user.id}
            />
        </div>
    );
}
