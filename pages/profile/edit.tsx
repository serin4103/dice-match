import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useRef } from "react";
import Header from "../../components/Header";

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
    }, [status, session, router]);

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
                width: "100vw",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <div onClick={() => router.push("/")} style={{ cursor: "pointer" }}>
                <Header />
            </div>

            {/* 메인 콘텐츠 */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px",
                    fontFamily: "'Noto Sans KR', sans-serif",
                    textAlign: "center",
                }}
            >
                {/* 프로필 사진 + 업로드 버튼 */}
                <div style={{ position: "relative", margin: "0 auto 60px", width: 120, height: 120 }}>
                    <div
                        style={{
                            width: 120,
                            height: 120,
                            borderRadius: "50%",
                            backgroundImage: profileImage
                                ? `url(${URL.createObjectURL(profileImage)})`
                                : session.user.profilePicture
                                    ? `url(${session.user.profilePicture})`
                                    : `url(/default_profile_image.png)`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "40px",
                            border: "2px solid #353535",
                        }}
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    >
                    </div>
                    <button
                        style={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            width: 28,
                            height: 28,
                            border: "none",
                            borderRadius: "50%",
                            background: "#FFCE8E",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            fontSize: 16,
                            fontWeight: "bold",
                            color: "#333",
                            padding: 0,
                        }}
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                        aria-label="프로필 이미지 변경"
                        type="button"
                    >
                        +
                    </button>
                    <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        ref={fileInputRef}
                        onChange={handleImageChange}
                    />
                </div>

                {/* 닉네임 입력 */}
                <div style={{ marginBottom: "60px", width: "100%", maxWidth: "300px", display: "flex", justifyContent: "center" }}>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="닉네임"
                        style={{
                            width: "220px",
                            height: "50px",
                            padding: "12px 16px",
                            fontSize: "16px",
                            borderRadius: "8px",
                            border: "2px solid #353535",
                            textAlign: "center",
                            fontFamily: "'Noto Sans KR', sans-serif",
                            backgroundColor: "#fff",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                            boxSizing: "border-box",
                        }}
                    />
                </div>

                {/* 취소/수정 버튼 */}
                <div
                    style={{
                        display: "flex",
                        gap: "20px",
                        justifyContent: "center",
                    }}
                >
                    <button
                        onClick={() => router.push("/profile")}
                        style={{
                            backgroundColor: "#FFCE8E",
                            border: "2px solid #353535",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100px",
                            height: "45px",
                            borderRadius: "8px",
                            fontWeight: "600",
                            fontSize: "16px",
                            cursor: "pointer",
                            color: "#353535",
                            fontFamily: "'Noto Sans KR', sans-serif",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                        }}
                        type="button"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSave}
                        style={{
                            backgroundColor: "#FFCE8E",
                            border: "2px solid #353535",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100px",
                            height: "45px",
                            borderRadius: "8px",
                            fontWeight: "600",
                            fontSize: "16px",
                            cursor: "pointer",
                            color: "#353535",
                            fontFamily: "'Noto Sans KR', sans-serif",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                        }}
                        type="button"
                    >
                        수정
                    </button>
                </div>
            </div>
        </div>
    );
}
