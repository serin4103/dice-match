import React, { useState } from "react";
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect } from "react";

export default function Home() {
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();

    useEffect(() => {
        if (session?.user?.email && !session?.user?.isRegistered) {
            router.push("/register");
        }
    }, [session]);

    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                background: "white",
            }}
        >
            {/* 오른쪽 위 로그인 버튼 */}
            {session ? (
                <div
                    style={{
                        position: "absolute",
                        top: 30,
                        right: 40,
                        display: "flex",
                        gap: 20, // 버튼 사이 간격(px)
                    }}
                >
                    <button
                        style={{
                            fontSize: 16,
                            background: "none",
                            border: "none",
                            color: "#222",
                            cursor: "pointer",
                            padding: "8px 18px",
                            borderRadius: 6,
                            transition: "background 0.2s",
                        }}
                        onClick={() => router.push("/profile")}
                    >
                        프로필
                    </button>
                    <button
                        style={{
                            fontSize: 16,
                            background: "none",
                            border: "none",
                            color: "#222",
                            cursor: "pointer",
                            padding: "8px 18px",
                            borderRadius: 6,
                            transition: "background 0.2s",
                        }}
                        onClick={() => signOut()}
                    >
                        로그아웃
                    </button>
                </div>
            ) : (
                <button
                    style={{
                        position: "absolute",
                        top: 30,
                        right: 40,
                        fontSize: 16,
                        background: "none",
                        border: "none",
                        color: "#222",
                        cursor: "pointer",
                    }}
                    onClick={() => signIn("google")}
                >
                    로그인 →
                </button>
            )}

            {/* 로고 */}
            <h1 style={{ fontSize: 40, fontWeight: 700, marginBottom: 32 }}>
                Dice Match
            </h1>

            {/* 버튼들 세로 정렬 */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <button
                    style={{
                        background: "#F7D9A7",
                        border: "1px solid #e0e0e0",
                        borderRadius: 8,
                        boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                        padding: "16px 40px",
                        fontSize: 20,
                        fontWeight: 600,
                        cursor: "pointer",
                        marginBottom: 8,
                    }}
                    onClick={() => router.push("/loading")}
                >
                    게임 시작
                </button>
                <button
                    style={{
                        background: "#fff",
                        border: "1.5px solid #bdbdbd",
                        borderRadius: 8,
                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                        padding: "16px 40px",
                        fontSize: 20,
                        fontWeight: 500,
                        cursor: "pointer",
                        color: "#222",
                    }}
                    onClick={() => setShowModal(true)}
                >
                    게임 설명
                </button>
            </div>

            {/* 모달 */}
            {showModal && (
                <>
                    <div
                        onClick={() => setShowModal(false)}
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: "rgba(0,0,0,0.5)",
                            zIndex: 1000,
                        }}
                    />
                    <div
                        style={{
                            position: "fixed",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            backgroundColor: "white",
                            padding: 30,
                            borderRadius: 8,
                            width: 300,
                            zIndex: 1001,
                            boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                        }}
                    >
                        <button
                            onClick={() => setShowModal(false)}
                            style={{
                                position: "absolute",
                                top: 10,
                                right: 10,
                                background: "none",
                                border: "none",
                                fontSize: 18,
                                cursor: "pointer",
                            }}
                            aria-label="닫기"
                        >
                            ×
                        </button>
                        <h2>게임 설명</h2>
                        <p>
                            Dice Match는 두 명이 번갈아가며 주사위를 굴려 말을 이동시키는 전략 보드게임입니다.
                            <br />
                            상대 말을 잡으면 보너스를 받고, 말을 업어서 함께 이동할 수 있습니다.
                            <br />
                            끝없이 뒤바뀌는 주사위 대결과 전술을 즐겨보세요!
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}
