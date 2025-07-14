import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../auth/[...nextauth]";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // Next.js에서 직접 파싱하지 않도록 설정
  },
};

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "로그인이 필요합니다." });
  //console.log("session: ", session);

  const form = formidable();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(400).json({ error: "폼 파싱 오류" });

    const username = Array.isArray(fields.username)
      ? fields.username[0]
      : fields.username; // 텍스트 필드
    const profileImage = files.image; // 파일 필드 (input name="image")
    console.log("proflieImage: ", profileImage);
    if (!username) return res.status(400).json({ error: "닉네임이 필요합니다." });
    let profilePicturePath;
    if (profileImage) {
      const imageFile = Array.isArray(profileImage) ? profileImage[0] : profileImage;
      const newFilename = Date.now() + "_" + imageFile.newFilename; // 중복 방지
      const oldPath = imageFile.filepath; // 임시 저장 경로
      const newPath = path.join(process.cwd(), "public", "uploads", newFilename);

      // 파일 이동
      fs.renameSync(oldPath, newPath);

      profilePicturePath = "/uploads/" + newFilename;
    }
    console.log("profilePicturePath: ", profilePicturePath);
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        username,
        ...(profilePicturePath && { profilePicture: profilePicturePath }), // 이미지 경로 추가
      },
    });
  });
  
  return res.status(200).json({ message: "프로필 업데이트 성공" });
}