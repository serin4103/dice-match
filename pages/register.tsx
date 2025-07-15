import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function Register() {
    const { data: session, status } = useSession();
    const [username, setUsername] = useState("");
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") router.push("/");
    }, [status]);

    useEffect(() => {
        if (session?.user.isRegistered) router.replace("/");
    }, [session]);

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
                maxWidth: 400,
                margin: "80px auto",
                padding: 24,
                border: "1px solid #ddd",
                borderRadius: 8,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                backgroundColor: "#fafafa",
            }}
        >
            <h1
                style={{
                    textAlign: "center",
                    marginBottom: 24,
                    color: "#333",
                    fontWeight: "600",
                    fontSize: 24,
                }}
            >
                회원가입
            </h1>

            <input
                placeholder="닉네임을 입력하세요"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                    width: "100%",
                    padding: "12px 16px",
                    fontSize: 16,
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    marginBottom: 20,
                    boxSizing: "border-box",
                    outline: "none",
                    transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#0070f3")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#ccc")}
            />

            <button
                onClick={handleSubmit}
                style={{
                    width: "100%",
                    padding: "12px 0",
                    backgroundColor: "#0070f3",
                    color: "white",
                    fontSize: 16,
                    fontWeight: "600",
                    borderRadius: 6,
                    cursor: "pointer",
                    border: "none",
                    transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#005bb5")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0070f3")}
            >
                등록
            </button>
        </div>
    );
}
