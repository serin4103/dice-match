import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('Request method:', req.method);
    console.log('Request body:', req.body);
    if (req.method === 'POST') {
        const { email, username } = req.body;

        if (!email) {
            // 서버나 인증 시스템 문제
            return res.status(500).json({ error: '이메일 정보가 없습니다. 서버 오류입니다.' });
        }

        if (!username) {
            // 사용자 입력 문제
            return res.status(400).json({ error: '닉네임을 입력해주세요.' });
        }

        try {
            const user = await prisma.user.create({
                data: {
                    email,
                    username,
                    win: 0,
                    lose: 0,
                },
            });
            return res.status(201).json(user);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: '회원가입 중 오류가 발생했습니다.' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}