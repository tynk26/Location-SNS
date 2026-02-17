# 📍 Location-Based SNS (실시간 위치 기반 매칭 SNS)

<img width="1268" height="667" alt="screenshot" src="https://github.com/user-attachments/assets/79296415-20f4-4b19-a34b-9bfdfc85a320" />
<img width="1280" height="668" alt="screenshot6" src="https://github.com/user-attachments/assets/70de63ab-cbfb-4b9d-b295-7d4a9ef7eabc" />

실시간 위치 정보를 기반으로 사용자들을 연결하고, 프로필 기반 매칭 및 채팅 기능을 제공하는 **위치 기반 소셜 네트워크 서비스(Location-Based SNS)** 프로젝트입니다.  
카카오 지도 API를 활용하여 사용자 위치를 시각화하고, **Node.js + React** 기반의 풀스택 아키텍처로 설계되었습니다.

---

## ✨ Key Features

- 📍 **실시간 위치 기반 사용자 탐색** (반경 필터)
- 🗺 **Kakao Map API 기반 사용자 위치 시각화**
- 👤 **프로필 기반 매칭 구조**
- 💬 **Messenger 스타일 채팅 UI** (실시간 확장 가능)
- 🔔 **소셜 인터랙션 알림 패널** (좋아요/메시지/팔로우 등)
- 🌐 **확장 가능한 풀스택 구조** (Frontend + Backend + DB)

---

## 🏗 Architecture Overview

### 1️⃣ System Diagram

```text
┌──────────────────────────┐
│      React Frontend      │
│   (Vite + Kakao Map SDK) │
└─────────────┬────────────┘
              │
              │ REST API / WebSocket
              ▼
┌──────────────────────────┐
│    Node.js + Express     │
│          Backend         │
└─────────────┬────────────┘
              │
              ▼
┌──────────────────────────┐
│       Database Layer     │
│   (MongoDB - Planned)    │
└──────────────────────────┘
🧩 Tech Stack
Frontend
React (Vite)

Kakao Map JavaScript SDK

Axios (API communication)

CSS Modules

Backend
Node.js

Express

CORS

dotenv

Socket.io

MongoDB + Mongoose (planned)

📌 Core Modules
📍 1. Location-Based Discovery
GPS 좌표 기반 사용자 저장/표시

특정 반경(radius) 내 사용자 탐색

Kakao Map에 사용자 오버레이(프로필 카드) 렌더링

기본 반경 1km (조정 가능)

👤 2. Profile-Based Matching (Extensible)
프로필 기반 필터링 구조

거리 + 프로필 조건 기반 매칭 확장 가능

향후 점수 기반 랭킹/추천 로직으로 발전 가능

💬 3. Chat System
Messenger 스타일 UI

사용자 이름/시간 표시

Socket.io 기반 실시간 채팅 확장 가능

(선택) 메시지 저장/조회 기능 추가 예정

🔔 4. Social Interaction Notifications
좋아요 / 메시지 / 팔로우 등 이벤트 기록

알림 패널에서 UI로 시각화

향후 푸시 알림(웹/모바일) 확장 가능

⚙️ Getting Started
✅ Prerequisites
Node.js (LTS recommended)

npm

Kakao Developers account + JavaScript Key

(Optional) MongoDB (Atlas/local)

1️⃣ Frontend Setup & Run
cd frontend
npm install
npm run dev
Open:

http://localhost:5173

2️⃣ Backend Setup & Run
cd backend
npm install
npm run dev
Server:

http://localhost:5000

🔑 Environment Variables
Create: backend/.env

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
KAKAO_REST_API_KEY=your_kakao_rest_api_key
KAKAO_REST_API_KEY는 (선택) 길찾기/외부 API 프록시 기능 등에 사용됩니다.

🌍 Kakao Map API Setup
Kakao Developers에서 애플리케이션 생성

JavaScript 키 발급

플랫폼(Web) 도메인 등록 (localhost 포함)

index.html에 SDK 추가:

<script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_APP_KEY&autoload=false"></script>
# 🧠 Code Walkthrough (How This Project Works)

이 섹션은 **Location-Based SNS** 프로젝트가 실제로 어떻게 동작하는지(프론트 ↔ 백엔드 ↔ 소켓 ↔ 카카오맵 ↔ 길찾기) 를 **코드 흐름 기준**으로 상세히 설명합니다.  
“왜 이렇게 구성했는지 / 어떤 데이터가 어디로 흐르는지 / 각 파일이 무슨 역할인지”를 이해하면 기능 추가가 매우 쉬워집니다.

---

## ✅ High-Level Flow (한눈에 보는 실행 흐름)

사용자가 앱을 실행하면 아래 순서로 동작합니다:

1. **Frontend(React)** 가 실행되고 기본 유저 목록을 state로 로드
2. **KakaoMap 컴포넌트**가 지도 SDK를 로드하고 사용자 마커(오버레이)를 렌더링
3. 좌측 패널(LeftPanel)에서 사용자를 **등록(Register)** 하거나 **로그인(Login)** 할 수 있음
4. 로그인된 사용자는 `currentUser`로 저장됨 (localStorage로 유지)
5. 채팅 입력 후 전송하면 **Socket.IO** 로 서버에 메시지 전송
6. 서버는 같은 룸(room) 사용자에게 메시지를 broadcast → 모두 실시간 수신
7. 지도에서 다른 사용자 오버레이 클릭 시 **프로필 팝업 + 길찾기 버튼** 표시
8. 길찾기 버튼 클릭 시 백엔드 프록시(`/api/kakao/directions`)로 요청 → Kakao Mobility API 호출
9. 응답 요약(거리/시간/택시비) 표시 + Polyline으로 지도에 경로 표시

---

## 🗂️ Frontend 구조 설명 (React)

### 1) `App.jsx`가 하는 일 (전체 상태와 연결의 중심)

`App.jsx`는 **전역 상태(state)** 를 관리하는 “컨트롤 타워”입니다.

- `users`: 지도에 표시할 유저 목록 (기본 유저 + 등록한 유저)
- `currentUser`: 현재 로그인된 사용자 (누가 메시지를 보내는지, 길찾기 출발지)
- `chatMessages`: 채팅 기록 (Socket 수신으로만 추가되도록 구성해야 중복이 없음)
- `chatInput`: 입력창 상태
- `socket`: 실시간 채팅 연결 (socket.io-client)

#### ✅ 로그인 흐름
- LeftPanel에서 로그인 버튼 클릭 → `loginUser(user)` 실행
- `currentUser`가 설정됨
- 동시에 `localStorage`에 저장되어 새로고침해도 로그인 유지

#### ✅ 채팅 흐름
- `sendMessage()` 호출 시:
  - `currentUser`가 없으면 “로그인 먼저” 경고
  - 있으면 `{ roomId, fromUser, message }` payload를 서버로 emit
---

### 2) `LeftPanel.jsx`가 하는 일 (등록/로그인 UI)

LeftPanel은 UI는 유지하면서 “동작”만 담당합니다.

#### ✅ 등록(Register)
- 닉네임/소개/아바타 입력
- `registerUser()` 실행
- 현재 브라우저 GPS를 받아 새 유저 생성
- `users` state에 추가되어 지도에 표시됨

#### ✅ 로그인(Login)
- 등록된 사용자 리스트에서 “Login” 버튼 클릭
- `loginUser(user)` 실행 → currentUser 설정

---

### 3) `MessengerPanel.jsx`가 하는 일 (채팅 UI)

MessengerPanel은 전달받은 props로만 렌더링합니다.

- `currentUser`: 내가 누구인지 판단 (bubble alignment)
- `chatMessages`: 메시지 리스트
- `sendMessage()`: 전송 함수

#### ✅ Facebook-style 좌/우 정렬 핵심 로직
- `isMe = currentUser.username === msg.from`
- `isMe`면 오른쪽(파란 bubble), 아니면 왼쪽(흰 bubble)
- 메시지마다 avatar를 보여주려면 `users`에서 msg.from 기준으로 avatar를 찾아 씀

---

## 🗺 Kakao Map: `KakaoMap.jsx` 동작 설명

KakaoMap은 아래 3가지 역할을 합니다.

### 1) 지도 초기화 (SDK load → Map instance 생성)
```js
window.kakao.maps.load(() => {
  const map = new window.kakao.maps.Map(container, {...});
  mapInstance.current = map;
});

✅ Recommended Test Scenario
Backend 서버 실행

Frontend 실행

브라우저에서 위치 권한 허용

지도 로딩 확인

기본 유저(예: 시청, 광화문) 표시 확인

1km 반경 조정 시 유저 표시 변화 확인

프로필 클릭 → 팝업/채팅 UI 확인

(확장 시) Socket 기반 메시지 전송 확인

🔮 Roadmap
✅ MongoDB 기반 사용자 데이터 영속화

✅ JWT 인증 시스템

✅ 실시간 채팅(Socket.io) 안정화

✅ 매칭 알고리즘 고도화 (점수 기반 추천)

✅ 모바일 반응형 UI

✅ 푸시 알림 시스템

✅ 배포 (AWS EC2 + S3 + MongoDB Atlas)

🎯 Project Goals
위치 기반 매칭 핵심 기능 구현

실시간 사용자 상호작용 구조 설계

확장 가능한 풀스택 아키텍처 확보

🧠 Technical Highlights
이 프로젝트는 단순 지도 표시 앱이 아니라 아래를 통합적으로 구현합니다:

위치 데이터 처리 및 반경 기반 탐색

지도 기반 UI/오버레이 인터랙션 설계

소셜 매칭 알고리즘 구조화(확장 가능)

프론트엔드-백엔드 분리 아키텍처 기반 확장성

👨‍💻 Author
Independent Full-Stack Developer
Location-Based Social Platform Architect
```
