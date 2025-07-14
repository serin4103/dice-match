import { GameState } from "../../../types/game";

export class GameManager {
    private waitingPlayers: Map<string, string> = new Map();
    private activeGames: Map<string, GameState> = new Map();

    addPlayer(socketId: string, username: string): void {
        // 대기실에 플레이어 추가

        if (this.waitingPlayers.has(socketId)) {
            return;
        }

        this.waitingPlayers.set(socketId, username);

        console.log(`👤 ${username} joined waiting queue`);

        // 대기실에 충분한 플레이어가 있으면 게임 시작
        this.tryStartGame();
    }

    removePlayer(socketId: string): void {
        // 대기실에서 플레이어 제거
        this.waitingPlayers.delete(socketId);
        
        // 활성 게임에서도 플레이어 제거
        const activeGames = this.getActiveGames();
        
        const userGame = activeGames.find((game) =>
            Array.from(game.playersState.keys()).includes(socketId)
        );

        if (userGame) {
            this.removeGame(userGame.id);
        }
    }

    removeGame(gameId: string): boolean {
        // 특정 게임을 activeGames에서 제거
        const gameExists = this.activeGames.has(gameId);
        
        if (gameExists) {
            this.activeGames.delete(gameId);
            console.log(`🗑️ Game ${gameId} removed from active games`);
            return true;
        }
        
        console.log(`⚠️ Game ${gameId} not found in active games`);
        return false;
    }

    private tryStartGame(): void {
        if (this.waitingPlayers.size >= 2) {
            // 대기실에서 플레이어들을 가져와서 게임 생성
            const players = Array.from(this.waitingPlayers.entries()).slice(
                0,
                2
            );

            // 대기실에서 제거
            players.forEach(([socketId, ]) => {
                this.waitingPlayers.delete(socketId);
            });

            const playersState = new Map();
            playersState.set(players[0][0],
                {
                    name: players[0][1],
                    color: "blue",
                    pawns: Array.from({ length: 4 }, (_, i) => ({
                        color: "blue",
                        position: "ready",
                        index: i,
                    })),
                    diceValue: 0,
                    bonus: 0,
                }
            );
            playersState.set(players[1][0],
                {
                    name: players[1][1],
                    color: "red",
                    pawns: Array.from({ length: 4 }, (_, i) => ({
                        color: "red",
                        position: "ready",
                        index: i,
                    })),
                    diceValue: 0,
                    bonus: 0,
                }
            );

            // 새 게임 생성
            const gameId = this.generateGameId();
            const game: GameState = {
                id: gameId,
                playersState: playersState,
                currentTurn: null,
                winner: null,
            };

            this.activeGames.set(gameId, game);

            console.log(
                `🎮 Game ${gameId} created with players: ${players
                    .map((p) => p[1])
                    .join(", ")}`
            );
        }
    }

    setDiceValue(
        gameId: string,
        socketId: string,
        diceValue: number
    ): { gameState: GameState | null } {
        const game = this.activeGames.get(gameId);
        if (!game) {
            return { gameState: null };
        }

        const prevPlayerState = game.playersState.get(socketId);
        if (!prevPlayerState) {
            return { gameState: null };
        }

        game.playersState.set(socketId, {
            ...prevPlayerState,
            diceValue: diceValue,
        });
        const newPlayerStates = Array.from(game.playersState.values());

        const newTurn = (newPlayerStates.every((p) => p.diceValue > 0)) 
            ? ((newPlayerStates[0].diceValue > newPlayerStates[1].diceValue) 
                ? newPlayerStates[0].color 
                : (newPlayerStates[0].diceValue < newPlayerStates[1].diceValue)
                    ? newPlayerStates[1].color
                    : (game.currentTurn === newPlayerStates[0].color
                        ? newPlayerStates[1].color
                        : newPlayerStates[0].color)) 
            : null;

        game.currentTurn = newTurn;

        return { gameState: game };
    }

    private generateGameId(): string {
        return `game_${Date.now()}_${Math.random()
            .toString(36)
            .substring(2, 9)}`;
    }

    getGameById(gameId: string): GameState | null {
        return this.activeGames.get(gameId) || null;
    }

    getWaitingPlayers(): string[] {
        return Array.from(this.waitingPlayers.values());
    }

    getActiveGames(): GameState[] {
        return Array.from(this.activeGames.values());
    }
}
