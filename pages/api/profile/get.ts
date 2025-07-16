import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        return res.status(401).json({ error: '로그인이 필요합니다.' });
    }

    const { email } = req.query;

    if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: '유효한 이메일이 필요합니다.' });
    }

    try {
        // 새로운 서버 API 호출
        const serverUrl = process.env.SERVER_URL || "http://localhost:4000";
        const response = await fetch(`${serverUrl}/user/${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json(errorData);
        }

        const profileData = await response.json();
        return res.status(200).json(profileData);
    } catch (error) {
        console.error('Error fetching profile:', error);
        return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
}
