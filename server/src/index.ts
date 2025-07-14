import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { setupSocketHandlers } from "./socket/socketHandler";

// 환경 변수 로드
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// 기본 라우트
app.get("/", (req, res) => {
    res.json({ message: "Dice Match Socket Server" });
});

// 소켓 핸들러 설정
setupSocketHandlers(io);

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
    console.log(`🚀 Socket server running on port ${PORT}`);
    console.log(
        `📡 Client URL: ${process.env.CLIENT_URL || "http://localhost:3000"}`
    );
});
