![로고](./public/header.svg)

> 직접 만든 주사위를 굴려 윷놀이판에서 말을 움직이세요!

</br>

## 👨‍👩‍👧‍👦 팀원 소개

- **장근영** - KAIST 전산학부 22학번  
- **박세린** - 고려대학교 컴퓨터학과 23학번

</br>

## 💡 아이디어

[아이디어 참고 영상](https://www.youtube.com/watch?v=dYseOwfa7Vc&t=271s)

- 주사위와 윷놀이판을 활용한 **심리전 기반 보드 게임**

</br>

## 📄 게임 설명
1. 각 플레이어는 **총합이 18 이하인 주사위**를 매 턴 구성합니다.
2. 동시에 주사위를 굴려 **더 큰 눈이 나온 플레이어**가 해당 눈금만큼 말을 이동시킵니다.
3. **상대의 말을 잡으면**, 다음 턴에 `(잡은 말 개수 * 3)` 만큼 주사위 눈의 총합 한도가 증가합니다.
4. 내 말을 **업어서** 함께 이동이 가능합니다.
5. 말 4개가 먼저 완주시키면 승리합니다.

</br>

## ✨ 구성 화면

### 🔸 메인 페이지

- Google 소셜 로그인 기능 제공

<img width="600" alt="lobby" src="https://github.com/user-attachments/assets/2742d286-d393-4c35-94e9-e64ba53b45db" />


### 🔸 프로필 페이지

- 승/패 전적 확인  
- 프로필 정보 수정

<img width="600" alt="image" src="https://github.com/user-attachments/assets/6f70d094-e1ff-484d-a30b-22c6beafe8d7" />



### 🔸 로딩 페이지

- 상대방을 기다리는 동안 **귀여운 주사위 애니메이션** 표시

<img width="600" alt="image" src="https://github.com/user-attachments/assets/38d10691-fa03-433e-b022-10f74ac5e42c" />


### 🔸 게임 페이지

- 실시간 게임 진행  
- 주사위 제작, 말 이동, 업기/잡기 등의 인터랙션 포함

<img width="1862" height="832" alt="image" src="https://github.com/user-attachments/assets/49c36b89-3181-4b35-b684-96319d15892f" />


</br>

## 🛠️ 기술 스택

### 🧩 Front-end

- **React**, **Next.js**  
  컴포넌트 기반 UI 설계 및 라우팅 처리

### 🧠 Back-end

- **Node.js**  
  실시간 서버 구현(Socket.IO 연동)

### 🗃️ Database

- **MySQL**  
  사용자 및 게임 정보 저장, 트랜잭션 처리

- **Prisma**  
  MySQL 데이터 접근 및 관리

### 🔄 Real-time Communication

- **Socket.IO**  
  턴 진행, 주사위 결과, 이동 상황 등의 실시간 반영


### 🔐 Authentication

- **Google Login SDK (OAuth 2.0)**  
  소셜 로그인 및 사용자 정보 연동
