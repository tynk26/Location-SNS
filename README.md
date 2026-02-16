📍 Location-Based SNS

실시간 위치 기반 매칭 소셜 네트워크 서비스

🧭 프로젝트 소개

Location-Based SNS는 사용자의 실시간 위치 정보를 기반으로 주변 사용자들을 탐색하고, 프로필 기반 매칭 및 채팅 기능을 제공하는 풀스택 소셜 네트워크 서비스입니다.

카카오 지도 API를 활용하여 지도 위에 사용자를 시각화하며,
Node.js + Express 백엔드와 React 프론트엔드로 구성된 확장 가능한 아키텍처를 기반으로 설계되었습니다.

🚀 핵심 기능
1️⃣ 실시간 위치 기반 사용자 탐색

GPS 좌표 저장

반경 기반 사용자 검색

Kakao Map에 사용자 마커 표시

2️⃣ 프로필 기반 매칭

관심사 기반 필터링

거리 + 프로필 조건 매칭 로직

확장 가능한 매칭 알고리즘 구조

3️⃣ 채팅 시스템

Messenger 스타일 UI

사용자 이름 / 위치 / 시간 표시

실시간 확장 가능 구조

4️⃣ 소셜 인터랙션 알림 패널

좋아요

메시지 수신

프로필 방문

상호작용 로그 추적

🏗 시스템 아키텍처
전체 구조

Frontend (React)
⬇ REST API / WebSocket
Backend (Node.js + Express)
⬇
Database (MongoDB 예정)

🖥 Frontend 구조
기술 스택

React (Vite)

Kakao Map JavaScript SDK

Axios

CSS Modules

디렉토리 구조

frontend
└── src
  ├── components
  │  ├── MapView.tsx
  │  ├── ChatBox.tsx
  │  ├── AlarmPanel.tsx
  │  ├── UserProfileCard.tsx
  │
  ├── assets
  │  └── avatars
  │
  ├── services
  │  └── api.ts
  │
  └── App.tsx

프론트엔드 역할

Kakao Map SDK를 통한 지도 렌더링

사용자 마커 표시

프로필 카드 UI

채팅 UI 렌더링

알림 패널 표시

백엔드 API 통신

🖥 Backend 구조
기술 스택

Node.js

Express

CORS

dotenv

(예정) MongoDB + Mongoose

(예정) Socket.io

디렉토리 구조

backend
└── src
  ├── routes
  │  ├── users.js
  │  ├── matches.js
  │  ├── chat.js
  │
  ├── controllers
  ├── services
  └── server.js

백엔드 역할

사용자 등록

위치 업데이트

반경 기반 사용자 탐색 (Geo Query)

매칭 로직 처리

채팅 메시지 저장

소셜 인터랙션 로그 관리

WebSocket 기반 실시간 확장

⚙️ 실행 방법
1️⃣ Frontend 실행

cd frontend
npm install
npm run dev

브라우저 접속:
http://localhost:5173

2️⃣ Backend 실행

cd backend
npm install
npm run dev

서버 주소:
http://localhost:5000

🔑 환경 변수 설정

backend/.env 파일 생성

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

🌍 Kakao Map API 설정

Kakao Developers에서 애플리케이션 생성

JavaScript 키 발급

도메인 등록 (localhost 포함)

index.html에 SDK 추가

<script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_APP_KEY&autoload=false"></script>

🔮 향후 확장 계획

MongoDB 기반 사용자 데이터 영속화

JWT 인증 시스템

Socket.io 실시간 채팅

매칭 알고리즘 고도화

모바일 반응형 UI

푸시 알림 시스템

AWS 배포 (EC2 + S3 + Mongo Atlas)

🎯 프로젝트 목표

3일 내 MVP 완성

위치 기반 매칭 핵심 기능 구현

실시간 사용자 상호작용 구조 설계

확장 가능한 풀스택 구조 확보

🧠 기술적 의의

이 프로젝트는 단순 지도 앱이 아니라,

위치 데이터 처리

실시간 인터랙션 구조 설계

소셜 매칭 로직 아키텍처화

프론트엔드-백엔드 분리 설계

를 통합적으로 구현하는 풀스택 위치 기반 SNS 플랫폼의 기초 설계입니다.

👨‍💻 Developer

Independent Full-Stack Developer
Location-Based Social Platform Architect
