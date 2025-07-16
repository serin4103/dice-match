import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { signIn, signOut } from "next-auth/react";
import Header from "../components/Header";

export default function Register() {
    const { data: session, status } = useSession();
    const [username, setUsername] = useState("");
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") router.push("/");
    }, [status, router]);

    useEffect(() => {
        if (session?.user.isRegistered) router.replace("/");
    }, [session, router]);

    const handleSubmit = async () => {
        const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: session?.user.email, username }),
        });
        if (res.ok) {
            await signIn("google", { redirect: false });
            router.push("/");
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
            <div 
                onClick={async () => {
                    console.log("Header clicked, navigating to /");
                    await signOut({ redirect: false });
                    router.push("/");
                }} 
                style={{ cursor: "pointer" }}
            >
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
                {/* 이메일 표시 */}
                <div
                    style={{
                        fontSize: "18px",
                        color: "#333",
                        marginBottom: "40px",
                        fontWeight: "500",
                    }}
                >
                    {session?.user.email}
                </div>

                {/* 닉네임 입력 */}
                <div style={{ marginBottom: "20px", width: "100%", maxWidth: "300px", display: "flex", justifyContent: "center" }}>
                    <input
                        placeholder="닉네임을 입력하세요"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{
                            width: "240px",
                            height: "50px",
                            padding: "12px 16px",
                            fontSize: "16px",
                            borderRadius: "8px",
                            border: "2px solid #353535",
                            textAlign: "center",
                            fontFamily: "'Noto Sans KR', sans-serif",
                            backgroundColor: "#fff",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            boxSizing: "border-box",
                            outline: "none",
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "#d4b896")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#ddd")}
                    />
                </div>

                {/* 회원가입 버튼 */}
                <button
                    onClick={handleSubmit}
                    style={{
                        width: "240px",
                        height: "50px",
                        backgroundColor: "#FFCE8E",
                        color: "#353535",
                        fontSize: "16px",
                        fontWeight: "600",
                        borderRadius: "8px",
                        cursor: "pointer",
                        border: "2px solid #353535",
                        fontFamily: "'Noto Sans KR', sans-serif",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                >
                    회원가입
                </button>
            </div>
        </div>
    );
}
