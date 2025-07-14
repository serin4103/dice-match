import { Server, Socket } from "socket.io";
import { GameManager } from "../game/gameManager";

export function setupSocketHandlers(io: Server) {
    const gameManager = new GameManager();

    io.on("connection", (socket: Socket) => {
        console.log(`👤 User connected: ${socket.id}`);

        // 사용자 입장 (대기실에 추가)
        socket.on("join", (data: { username: string }) => {
            console.log(`🎮 ${data.username} joined the waiting queue`);
            gameManager.addPlayer(socket.id, data.username);
            
            const activeGames = gameManager.getActiveGames();
            const newGame = activeGames.find(game => Array.from(game.playersState.keys()).includes(socket.id));
            
            if (newGame) {
                // 게임에 속한 모든 플레이어들을 룸에 참가시키기
                Array.from(newGame.playersState.keys()).forEach(playerSocketId => {
                    const playerSocket = io.sockets.sockets.get(playerSocketId);
                    if (playerSocket) {
                        playerSocket.join(newGame.id);
                    }
                });
                
                console.log(`🎯 Game Started: ${newGame.id}`);
                
                // 게임 시작 알림
                io.to(newGame.id).emit("gameStarted", newGame);
            
            }
        });

        // 주사위 굴리기
        socket.on("diceBuilt", (data: { gameId: string, diceValue: number }) => {
            const result = gameManager.setDiceValue(data.gameId, socket.id, data.diceValue);
            if (result) {
                io.to(data.gameId).emit("diceRolled", result.gameState);
            } else {
                socket.emit("error", { message: "Game not found or invalid player." });
            }
        });

        // 게임 종료 처리
        socket.on("gameEnd", (data: { gameId: string, winner?: string }) => {
            console.log(`🏁 Game ${data.gameId} ended`);
            
            // 게임 룸의 모든 플레이어에게 게임 종료 알림
            io.to(data.gameId).emit("gameEnded", {
                gameId: data.gameId,
                winner: data.winner,
                message: "Game has ended"
            });
            
            // 룸의 모든 소켓을 룸에서 제거 (룸 자동 삭제)
            io.in(data.gameId).socketsLeave(data.gameId);
            
            // 게임 매니저에서도 게임 제거
            gameManager.removeGame(data.gameId);
            
            console.log(`🗑️ Room ${data.gameId} deleted`);
        });

        // 연결 해제
        socket.on("disconnect", () => {
            console.log(`👋 User disconnected: ${socket.id}`);
            
            // 플레이어가 속한 게임 룸에서 나가기
            const activeGames = gameManager.getActiveGames();
            const userGame = activeGames.find((game) =>
                Array.from(game.playersState.keys()).includes(socket.id)
            );
            
            if (userGame) {
                
                // 게임 룸의 다른 플레이어들에게 알림
                socket.to(userGame.id).emit("playerLeft", {
                    gameId: userGame.id,
                    leftPlayerId: socket.id
                });
                
                io.in(userGame.id).socketsLeave(userGame.id);
            }
            
            gameManager.removePlayer(socket.id);
        });
    });
}
