
# 📍 Location-Based SNS (실시간 위치 기반 매칭 SNS)
<img width="1268" height="667" alt="screenshot" src="https://github.com/user-attachments/assets/79296415-20f4-4b19-a34b-9bfdfc85a320" />

실시간 위치 정보를 기반으로 사용자들을 연결하고, 프로필 기반 매칭 및 채팅 기능을 제공하는 **위치 기반 소셜 네트워크 서비스(Location-Based SNS)** 프로젝트입니다.  
카카오 지도 API를 활용하여 사용자 위치를 시각화하고, Node.js + React 기반의 풀스택 아키텍처로 설계되었습니다.

---

# 🚀 프로젝트 개요

이 프로젝트는 다음과 같은 핵심 기능을 제공합니다:

- 📍 실시간 위치 기반 사용자 탐색
- 🗺 Kakao Map API 기반 사용자 시각화
- 👤 프로필 기반 매칭
- 💬 실시간 채팅 UI
- 🔔 소셜 인터랙션 알림 패널
- 🌐 확장 가능한 풀스택 구조 (Frontend + Backend)

---

# 🏗 아키텍처 개요

## 1️⃣ 전체 시스템 구조
                ┌─────────────────────┐
                │     React Frontend  │
                │  (Vite + Kakao Map) │
                └──────────┬──────────┘
                           │
                           │ REST API / WebSocket
                           ▼
                ┌─────────────────────┐
                │ Node.js + Express   │
                │       Backend       │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │   Database Layer    │
                │   (MongoDB)         │
                └─────────────────────┘

---

## 2️⃣ Frontend 아키텍처 (React)

### 기술 스택

- React (Vite)
- Kakao Map JavaScript SDK
- Axios (API 통신)
- CSS Modules

### 프론트엔드 역할

- Kakao Map SDK 로 지도 렌더링
- 사용자 위치 마커 표시
- 프로필 클릭 시 인터랙션 UI 표시
- 채팅 UI (Messenger 스타일)
- 알림 패널 렌더링
- REST API 호출을 통한 데이터 연동

---

## 3️⃣ Backend 아키텍처 (Node.js + Express)

### 기술 스택

- Node.js
- Express
- CORS
- dotenv
- (추후) MongoDB + Mongoose
- (추후) Socket.io

### 백엔드 역할

- 사용자 등록 및 위치 업데이트
- 반경 기반 사용자 탐색 (Geo Query)
- 프로필 기반 매칭 로직
- 채팅 메시지 저장 및 조회
- 소셜 인터랙션 로그 저장
- WebSocket 기반 실시간 기능 확장

---

# 📌 핵심 기능 설명

## 📍 1. 실시간 위치 기반 탐색

- 사용자 GPS 좌표 저장
- 특정 반경 내 사용자 검색
- Kakao Map에 시각적 표시

## 👤 2. 프로필 기반 매칭

- 사용자 관심사 기반 필터링
- 거리 + 관심사 매칭 알고리즘
- 향후 점수 기반 매칭 로직 확장 가능

## 💬 3. 채팅 시스템

- Messenger 스타일 UI
- 사용자 이름, 위치, 시간 표시
- 향후 WebSocket 기반 실시간 채팅 확장

## 🔔 4. 알림 시스템

- 좋아요
- 메시지 수신
- 프로필 방문
- 소셜 인터랙션 로그 표시

---

# ⚙️ 설치 및 실행 방법

## 1️⃣ Frontend 실행

```bash
cd frontend
npm install
npm run dev
브라우저 접속:

http://localhost:5173
```
2️⃣ Backend 실행
```
cd backend
npm install
npm run dev
서버 실행 주소:
http://localhost:5000
```
🔑 환경 변수 설정
backend/.env

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
✅ MongoDB 기반 사용자 데이터 영속화

✅ JWT 인증 시스템

✅ 실시간 채팅 (Socket.io)

✅ 매칭 알고리즘 고도화

✅ 모바일 반응형 UI

✅ 푸시 알림 시스템

✅ AWS 배포 (EC2 + S3 + Mongo Atlas)

🎯 프로젝트 목표

위치 기반 매칭 핵심 기능 구현

실시간 사용자 상호작용 구조 설계

확장 가능한 풀스택 구조 확보

🧠 기술적 의의
이 프로젝트는 단순 지도 표시 앱이 아니라,

위치 데이터 처리

실시간 인터랙션 설계

소셜 매칭 알고리즘 구조화

프론트엔드-백엔드 분리 아키텍처

를 통합적으로 구현하는 풀스택 위치 기반 SNS 플랫폼의 기초 설계입니다.

👨‍💻 개발자
Independent Full-Stack Developer
Location-Based Social Platform Architect
```
