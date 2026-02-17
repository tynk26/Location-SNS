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

Socket.io (planned / partially integrated)

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
