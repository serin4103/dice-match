import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { useSocket } from "../../contexts/SocketContext";
import { useGameState } from "../../contexts/GameStateContext";
import { GameStartedEvent, GameState, stringToMap, PlayerState } from "@/types/game";
import Image from "next/image";

export default function Loading() {

    const { setGameId, setPlayersState, setMyId, setOpponentId } = useGameState();
    const { data: session, status } = useSession();
    const router = useRouter();
    const { socket, isConnected } = useSocket();
    const hasJoinedRef = useRef(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/");
            return;
        }

        // 소켓이 연결되고 아직 join하지 않은 경우에만 실행
        if (socket && isConnected && session && !hasJoinedRef.current) {
            console.log('🔗 Loading page: Socket connected, sending join event...');
            hasJoinedRef.current = true;
            
            // 서버에 join 이벤트 발송 (게임 대기열 참가)
            socket.emit("join", {
                userId: session.user?.id
            });

            const handleGameStarted = (data: GameStartedEvent) => {
                console.log('🎮 Game started:', data.gameId);
                
                setGameId(data.gameId);
                // 여기서 data.gameId를 직접 사용 (의존성 순환 방지)
                socket.emit("startGame", { gameId: data.gameId });
            };

            const handleGameState = (gameState: GameState) => {
                console.log('📊 Game state received:', gameState);

                if (!gameState) return;

                const playersStateMap = stringToMap<number, PlayerState>(
                    gameState.playersState
                );

                if (playersStateMap) {
                    const playerIds = playersStateMap.keys();
                    const myId = session.user?.id;
                    const opponentId = playerIds.find((id) => id !== myId);
                    setMyId(myId);
                    setOpponentId(opponentId);

                    const newPlayersState: PlayerState[] = [];
                    newPlayersState.push(playersStateMap.get(myId));
                    newPlayersState.push(playersStateMap.get(opponentId));
                    setPlayersState(newPlayersState);
                    console.log("Updated players state:", newPlayersState);

                    setTimeout(() => {
                        router.push(`/game/${gameState.gameId}`);
                    }, 1000); // 1초 후 게임 페이지로 이동
                }
            }

            socket.on("matched", handleGameStarted);
            socket.on("gameState", handleGameState);

            // cleanup: 컴포넌트 언마운트 시 리스너만 제거 (소켓 연결은 유지)
            return () => {
                socket.off("matched", handleGameStarted);
                socket.off("gameState", handleGameState);
                hasJoinedRef.current = false; // 다음 연결을 위해 리셋
            };
        }
    }, [socket, isConnected, status, session, router, setGameId, setMyId, setOpponentId, setPlayersState]);

    if (status === "loading") {
        return (
            <div style={{
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px"
            }}>
                로딩중...
            </div>
        );
    }

    if (!session) {
        return null;
    }

    // 세션이 있는 경우의 로딩 화면
    return (
        <>
            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .loadingImage {
                    animation: spin 2s ease-in-out infinite;
                    margin-bottom: 20px;
                }
            `}</style>
            
            <div style={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px"
            }}>
                {/* 회전하는 로딩 이미지 */}
                <div className="loadingImage">
                    <Image 
                        src="/loading_image.png" 
                        alt="Loading..." 
                        width={80} 
                        height={80}
                    />
                </div>
                
                <h2>게임 상대를 찾는 중입니다</h2>
            </div>
        </>
    );
}
