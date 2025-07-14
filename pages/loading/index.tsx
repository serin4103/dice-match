import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSocket } from "../../contexts/SocketContext";

export default function Loading() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { socket, isConnected } = useSocket();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/");
            return;
        }

        // 소켓이 연결되면 게임 이벤트 리스너 등록 및 join 이벤트 발송
        if (socket && isConnected && session) {
            console.log('🔗 Loading page: Socket connected, sending join event...');
            
            // 서버에 join 이벤트 발송 (게임 대기열 참가)
            socket.emit("join", {
                userId: session.user?.id
            });

            const handleGameStarted = (gameId: string) => {
                console.log('🎮 Game started:', gameId);
                
                // 게임이 시작되면 게임 페이지로 이동 (소켓 연결 유지)
                setTimeout(() => {
                    router.replace(`/game/${gameId}`);
                }, 1000);
            };

            socket.on("gameStarted", handleGameStarted);

            // cleanup: 컴포넌트 언마운트 시 리스너만 제거 (소켓 연결은 유지)
            return () => {
                socket.off("gameStarted", handleGameStarted);
            };
        }
    }, [socket, isConnected, status, router, session]);

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
        <div style={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px"
        }}>
            <h2>게임 대기 중...</h2>
            <p style={{ fontSize: "14px", color: "#666", marginTop: "10px" }}>
                환영합니다, {session.user?.username || session.user?.email}님!
            </p>
            
            <div style={{ marginTop: "20px", textAlign: "center" }}>
                <p style={{ fontSize: "12px", color: "#999" }}>
                    소켓 상태: {isConnected ? "✅ 연결됨" : "⏳ 연결 중..."}
                </p>
                {socket && (
                    <p style={{ fontSize: "12px", color: "#999" }}>
                        소켓 ID: {socket.id}
                    </p>
                )}
                {isConnected && (
                    <p style={{ fontSize: "12px", color: "#4CAF50", marginTop: "10px" }}>
                        🎮 상대방을 찾는 중입니다...
                    </p>
                )}
            </div>
        </div>
    );
}
