import React from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  console.log("세션 상태:", status, session);

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      backgroundColor: showModal ? "rgba(0,0,0,0.5)" : "white",
      transition: "background-color 0.3s"
    }}>
      {/* 오른쪽 위 로그인 버튼 */}
      <>
      {session ? (
        <button
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            padding: "8px 16px",
            cursor: "pointer",
          }}
          onClick={() => signOut()}
        >
          로그아웃
        </button>
      ) : (
        <button
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            padding: "8px 16px",
            cursor: "pointer",
          }}
          onClick={() => signIn("google")}
        >
          로그인
        </button>
      )}
      {/* 기존 UI 나머지 계속 유지 */}
    </>

      {/* 로고 (여기선 텍스트로 대체) */}
      <h1 style={{ fontSize: 48, marginBottom: 40 }}>Dice Match</h1>

      {/* 버튼들 */}
      <div style={{ display: "flex", gap: 20 }}>
        <button
          style={{ padding: "12px 24px", fontSize: 18, cursor: "pointer" }}
          onClick={() => router.push("/game/start")}
        >
          게임 시작
        </button>
        <button
          style={{ padding: "12px 24px", fontSize: 18, cursor: "pointer" }}
          onClick={() => setShowModal(true)}
        >
          게임 설명
        </button>
      </div>

      {/* 모달 */}
      {showModal && (
        <>
          {/* 배경 어둡게 */}
          <div
            onClick={() => setShowModal(false)}
            style={{
              position: "fixed",
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 1000,
            }}
          />

          {/* 설명 박스 */}
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
              Dice Match는 두 명이 번갈아가며 주사위를 굴려 말을 이동시키는 전략 보드게임입니다.<br />
              상대 말을 잡으면 보너스를 받고, 말을 업어서 함께 이동할 수 있습니다.<br />
              끝없이 뒤바뀌는 주사위 대결과 전술을 즐겨보세요!
            </p>
          </div>
        </>
      )}
    </div>
  );
}