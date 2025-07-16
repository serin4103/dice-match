import { NextApiRequest, NextApiResponse } from 'next';

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
            // 새로운 서버 API 호출
            const serverUrl = process.env.NEXT_PUBLIC_SERVER_UR || "http://localhost:4000";
            console.log('Server URL:', serverUrl);
            console.log('Request URL:', `${serverUrl}/user`);
            
            const response = await fetch(`${serverUrl}/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    username,
                }),
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            
            if (!response.ok) {
                const responseText = await response.text();
                console.log('Error response text:', responseText);
                try {
                    const errorData = JSON.parse(responseText);
                    return res.status(response.status).json(errorData);
                } catch (parseError) {
                    return res.status(response.status).json({ 
                        error: '서버 응답 파싱 실패', 
                        responseText: responseText.substring(0, 500) 
                    });
                }
            }

            const responseText = await response.text();
            console.log('Success response text:', responseText);
            const user = JSON.parse(responseText);
            return res.status(200).json(user);
        } catch (error) {
            console.error('Error creating user:', error);
            return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}