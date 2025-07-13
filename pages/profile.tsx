import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status]);

  if (status === "loading") return <div>로딩중...</div>;
  if (!session) return null;
  const { email, username, win, lose, profilePicture } = session.user; // image도 나중에 추가!
  console.log("session: ", session);
  console.log("profilePicture: ", profilePicture);
  const total = win + lose;

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
        Dice Match
      </h1>

      {/* 프로필 사진 */}
      <div
        style={{
          width: 100,
          height: 100,
          margin: "0 auto 30px",
          borderRadius: "50%",
          backgroundColor: "#ccc",
          backgroundImage: profilePicture
            ? `url(${profilePicture})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* 이메일, 닉네임 */}
      <div
        style={{
            whiteSpace: "pre-line", // \n 줄바꿈 허용
            marginBottom: 30,
            fontSize: 16,
            fontWeight: "500",
            color: "#444",
        }}
        >
        이메일: {email}{"\n"}닉네임: {username ?? "등록되지 않음"}
            </div>

      {/* 승패 바 or 기록 없음 */}
      {total === 0 ? (
          <div
            style={{
              color: "#888",
              fontSize: 18,
              marginBottom: 40,
              userSelect: "none",
            }}
          >
            기록 없음
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              maxWidth: 320,
              height: 40,
              borderRadius: 6,
              border: "1px solid #ccc",
              display: "flex",
              overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              margin: "0 auto 40px",
              userSelect: "none",
              background: "#f9f9f9",
            }}
          >
            <div
              style={{
                flex: 1,
                backgroundColor: "#d9b372",
                color: "#2e2e2e",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "600",
                fontSize: 18,
                padding: "0 18px",
                borderRight: "1px solid #ccc", // 구분선
              }}
            >
              승 {win}
            </div>
            <div
              style={{
                flex: 1,
                backgroundColor: "#fff",
                color: "#333",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "600",
                fontSize: 18,
                padding: "0 18px",
              }}
            >
              패 {lose}
            </div>
          </div>

      )}



      {/* 아래 링크들 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 40,
          color: "#d9b372",
          fontWeight: "600",
          fontSize: 16,
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <button
          onClick={() => router.push("/profile/edit")}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            color: "#d9b372",
            textDecoration: "underline",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: 16,
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
            padding: 0,
            color: "#d9b372",
            textDecoration: "underline",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: 16,
          }}
          aria-label="로그아웃"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}