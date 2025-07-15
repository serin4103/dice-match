import React, { useState } from "react";
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect } from "react";
import Image from "next/image";

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

            {/* 버튼들 세로 정렬 */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 16 }}>

                <div style={{ marginBottom: -50 }}>
                    <Image 
                        src="/characters.png" 
                        alt="Characters" 
                        width={250} 
                        height={180}
                    />
                </div>

                {/* 로고 */}
                <div style={{ marginBottom: 20 }} >
                    <Image 
                        src="/header.svg" 
                        alt="Header" 
                        width={250} 
                        height={75}
                    />
                </div>

                <button
                    style={{
                        background: "#FFCE8E",
                        width: "200px",
                        border: "2px solid #353535",
                        borderRadius: 8,
                        boxShadow: "0 4px 5px rgba(0,0,0,0.2)",
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
                        background: "#ffffff",
                        width: "200px",
                        border: "2px solid #353535",
                        borderRadius: 8,
                        boxShadow: "0 4px 5px rgba(0,0,0,0.2)",
                        padding: "16px 40px",
                        fontSize: 20,
                        fontWeight: 600,
                        cursor: "pointer",
                        marginBottom: 8,
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
                            width: 600,
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
                            Dice Match는 직접 만든 주사위를 던져 말을 이동시키는 전략 대전 보드게임입니다. <br />
                            매 턴 각 플레이어는 눈 합이 18 이하인 주사위를 만들어 동시에 굴립니다. <br />
                            더 큰 값이 나온 플레이어가 자신의 주사위 눈 합만큼 말을 이동시키고, <br />
                            상대 플레이어의 말을 잡을 수 있습니다. <br />
                            상대 말을 잡으면 잡은 말 1개당 다음 턴 주사위 눈 합에 3만큼 보너스를 받고, <br />
                            내 말을 위에 올려 ‘업기’ 기능으로 함께 이동할 수 있습니다. <br />
                            끝없이 뒤바뀌는 주사위와 함께 말판 위에서 긴장감 넘치는 한 판 승부를 즐겨보세요! <br />
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}
