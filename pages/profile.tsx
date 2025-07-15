import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Header from "../components/Header";

export default function Profile() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/login");
        }
    }, [status, router]);

    if (status === "loading") return <div>로딩중...</div>;
    if (!session) return null;
    const { email, username, win, lose, profilePicture } = session.user; // image도 나중에 추가!
    console.log("session: ", session);
    console.log("profilePicture: ", profilePicture);
    const total = win + lose;

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
                {/* 프로필 사진 (주사위 자리) */}
                <div
                    style={{
                        width: "120px",
                        height: "120px",
                        margin: "0 auto 60px",
                        borderRadius: "50%",
                        backgroundImage: profilePicture
                            ? `url(${profilePicture})`
                            : `url(/default_profile_image.png)`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "40px",
                        border: "2px solid #353535",
                    }}
                >
                </div>

                {/* 이메일과 닉네임을 각각 다른 줄에 */}
                <div
                    style={{
                        marginBottom: "40px",
                        fontSize: "16px",
                        lineHeight: "1.8",
                        textAlign: "left",
                    }}
                >
                    <div style={{ marginBottom: "8px" }}>
                        <span style={{ fontWeight: "500", color: "#666", width: "60px", display: "inline-block" }}>이메일</span>
                        <span style={{ marginLeft: "20px", color: "#000", width: "200px", display: "inline-block" }}>{email}</span>
                    </div>
                    <div>
                        <span style={{ fontWeight: "500", color: "#666", width: "60px", display: "inline-block" }}>닉네임</span>
                        <span style={{ marginLeft: "20px", color: "#000", width: "200px", display: "inline-block" }}>{username ?? "등록되지 않음"}</span>
                    </div>
                </div>

                {/* 승패 바 or 기록 없음 */}
                {total === 0 ? (
                    <div
                        style={{
                            color: "#888",
                            fontSize: "18px",
                            marginBottom: "60px",
                            userSelect: "none",
                        }}
                    >
                        기록 없음
                    </div>
                ) : (
                    <div
                        style={{
                            width: "100%",
                            maxWidth: "300px",
                            height: "40px",
                            borderRadius: "14px",
                            border: "2px solid #353535",
                            display: "flex",
                            overflow: "hidden",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            margin: "0 auto 60px",
                            userSelect: "none",
                            backgroundColor: "#f5f5f5",
                        }}
                    >
                        <div
                            style={{
                                flex: win,
                                backgroundColor: "#FFCE8E",
                                color: "#000000",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontWeight: "600",
                                fontSize: "16px",
                                borderRight: total > 0 && lose > 0 ? "1px solid #ccc" : "none",
                            }}
                        >
                            승 {win}
                        </div>
                        {lose > 0 && (
                            <div
                                style={{
                                    flex: lose,
                                    backgroundColor: "#e8e8e8",
                                    color: "#333",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    fontWeight: "600",
                                    fontSize: "16px",
                                }}
                            >
                                패 {lose}
                            </div>
                        )}
                    </div>
                )}

                {/* 아래 링크들 */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "60px",
                        marginTop: "20px",
                    }}
                >
                    <button
                        onClick={() => router.push("/profile/edit")}
                        style={{
                            background: "none",
                            border: "none",
                            padding: "8px 0",
                            color: "#F49E2C",
                            textDecoration: "underline",
                            cursor: "pointer",
                            fontSize: "16px",
                            fontFamily: "'Noto Sans KR', sans-serif",
                        }}
                        aria-label="프로필 수정"
                    >
                        프로필 수정
                    </button>
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        style={{
                            background: "none",
                            border: "none",
                            padding: "8px 0",
                            color: "#F49E2C",
                            textDecoration: "underline",
                            cursor: "pointer",
                            fontSize: "16px",
                            fontFamily: "'Noto Sans KR', sans-serif",
                        }}
                        aria-label="로그아웃"
                    >
                        로그아웃
                    </button>
                </div>
            </div>
        </div>
    );
}
