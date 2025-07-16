import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import multer from 'multer';
import { NextApiRequest, NextApiResponse } from 'next';

// multer 타입 확장
interface MulterRequest extends NextApiRequest {
    file?: Express.Multer.File;
}

// multer 설정
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB 제한
    },
});

export const config = {
    api: {
        bodyParser: false, // Next.js에서 직접 파싱하지 않도록 설정
    },
};

// multer 미들웨어를 Promise로 래핑
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: any) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result: any) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}

export default async function handler(req: MulterRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ error: "로그인이 필요합니다." });

    try {
        // multer 미들웨어 실행
        await runMiddleware(req, res, upload.single('image'));

        // 새로운 서버 API 호출
        const serverUrl = process.env.SERVER_URL || "http://localhost:4000";
        const formData = new FormData();
        
        // 세션에서 이메일 추가
        formData.append('email', session.user.email);
        
        // 클라이언트에서 보낸 데이터 처리 (multer로 파싱된 데이터)
        const { username } = req.body;
        if (username) {
            formData.append('username', username);
        }

        // 파일이 있는 경우 처리
        if (req.file) {
            const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
            formData.append('image', blob, req.file.originalname);
        }

        const response = await fetch(`${serverUrl}/user/profile/update`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json(errorData);
        }

        const result = await response.json();
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ error: "서버 오류가 발생했습니다." });
    }
}
