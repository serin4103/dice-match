import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useRef } from "react";

export default function ProfileEdit() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState(null); // 이미지 업로드용

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
    if (session?.user) {
      setUsername(session.user.username ?? "");
      // 프로필 이미지 초기값도 있으면 설정
    }
  }, [status, session]);

  if (status === "loading") return <div>로딩중...</div>;
  if (!session) return null;

  const handleSave = async () => {
    // 여기서 API 호출해서 username, 프로필 이미지 등 저장
    // 예시:
    try {
      const formData = new FormData();
      formData.append("username", username);
      if (profileImage) formData.append("image", profileImage);
      const res = await fetch("/api/profile/update", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("업데이트 실패");
      alert("프로필이 저장되었습니다.");
      router.push("/profile").then(() => window.location.reload());
    } catch (err) {
      alert(err.message);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  return (
    <div
      style={{
        maxWidth: 360,
        margin: "40px auto",
        padding: 20,
        fontFamily: "'Noto Sans KR', sans-serif",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontWeight: "bold", fontSize: 28, marginBottom: 40 }}>
        프로필 수정
      </h1>

      {/* 프로필 사진 + 업로드 버튼 */}
      <div style={{ position: "relative", margin: "0 auto 24px", width: 100, height: 100 }}>
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            backgroundColor: "#ccc",
            backgroundImage: profileImage
              ? `url(${URL.createObjectURL(profileImage)})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            cursor: "pointer",
          }}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        />
        <button
          style={{
            position: "absolute",
            bottom: 6,
            right: 6,
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "#f7d9a7",
            border: "none",
            boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: 20,
            fontWeight: "bold",
            color: "#333",
            padding: 0,
          }}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          aria-label="프로필 이미지 변경"
          type="button"
        >+</button>
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleImageChange}
        />
      </div>


      {/* 닉네임 입력 */}
      <div style={{ marginTop: 30, marginBottom: 40 }}>
        <label
          htmlFor="username"
          style={{ fontWeight: "600", fontSize: 16, display: "block", marginBottom: 8 }}
        >
          닉네임
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: 8,
            fontSize: 16,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* 저장 버튼 */}
      <button
        onClick={handleSave}
        style={{
          backgroundColor: "#d9b372",
          border: "none",
          padding: "10px 20px",
          borderRadius: 6,
          fontWeight: "600",
          fontSize: 16,
          cursor: "pointer",
          color: "#2e2e2e",
        }}
      >
        저장
      </button>
    </div>
  );
}