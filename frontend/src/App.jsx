import { useState, useEffect, useRef } from "react";
import KakaoMap from "./components/KakaoMap";
import jessicaAvatar from "./assets/jessica.jpg";
import michaelAvatar from "./assets/michael.jpg";
import sominAvatar from "./assets/somin.jpg";

function App() {
  const defaultUsers = [
    {
      id: 1,
      username: "Jessica Kim",
      profile: "서울시청 근처에서 커피 마시는 중 ☕",
      lat: 37.5662952,
      lng: 126.9779451,
      avatar: jessicaAvatar,
      location: "서울시청",
    },
    {
      id: 2,
      username: "Michael Park",
      profile: "시청 근처 1km 산책 중 🚶",
      lat: 37.5705,
      lng: 126.982,
      avatar: michaelAvatar,
      location: "서울시청 1km",
    },
    {
      id: 3,
      username: "Somin Lee",
      profile: "광화문에서 책 읽는 중 📚",
      lat: 37.5718,
      lng: 126.9769,
      avatar: sominAvatar,
      location: "광화문",
    },
  ];

  const [users, setUsers] = useState(defaultUsers);
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(null);

  const [chatMessages, setChatMessages] = useState([
    { from: "Jessica Kim", message: "안녕 마이클 😊", time: "10:00" },
    {
      from: "Michael Park",
      message: "안녕 제시카! 오늘 날씨 진짜 좋다 ☀️",
      time: "10:01",
    },
    {
      from: "Jessica Kim",
      message: "그러게! 시청 근처 카페 왔어 ☕",
      time: "10:02",
    },
    {
      from: "Michael Park",
      message: "나도 근처야 1km 안쪽이야 😆",
      time: "10:03",
    },
  ]);

  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const registerUser = () => {
    if (!nickname) return alert("닉네임 입력");

    navigator.geolocation.getCurrentPosition((pos) => {
      const newUser = {
        id: Date.now(),
        username: nickname,
        profile: bio,
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        avatar: avatar ? URL.createObjectURL(avatar) : "",
        location: "현재 위치",
      };

      setUsers((prev) => [...prev, newUser]);
      setNickname("");
      setBio("");
      setAvatar(null);
    });
  };

  const sendMessage = () => {
    if (!chatInput) return;

    setChatMessages((prev) => [
      ...prev,
      {
        from: "You",
        message: chatInput,
        time: new Date().toLocaleTimeString().slice(0, 5),
      },
    ]);

    setChatInput("");
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      {/* LEFT SIDE — BLACK */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: 15,
          backgroundColor: "#000",
          color: "#fff",
        }}
      >
        {/* REGISTER SECTION */}
        <div
          style={{
            background: "#111",
            padding: 20,
            borderRadius: 10,
            marginBottom: 10,
          }}
        >
          <h3>사용자 등록</h3>

          <input
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            style={{
              width: "100%",
              padding: 8,
              marginBottom: 10,
              background: "#222",
              color: "#fff",
              border: "1px solid #444",
            }}
          />

          <input
            placeholder="소개"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            style={{
              width: "100%",
              padding: 8,
              marginBottom: 10,
              background: "#222",
              color: "#fff",
              border: "1px solid #444",
            }}
          />

          <input
            type="file"
            onChange={(e) => setAvatar(e.target.files[0])}
            accept="image/*"
            style={{ marginBottom: 10, color: "#fff" }}
          />

          <button
            onClick={registerUser}
            style={{
              padding: 10,
              backgroundColor: "#ff385c",
              color: "#fff",
              border: "none",
              borderRadius: 5,
              cursor: "pointer",
            }}
          >
            등록
          </button>
        </div>

        {/* REGISTERED USERS */}
        <div
          style={{
            background: "#111",
            padding: 20,
            borderRadius: 10,
            marginBottom: 10,
            overflowY: "auto",
            maxHeight: 250,
          }}
        >
          <h4>등록된 사용자</h4>

          {users.map((u) => (
            <div
              key={u.id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
                background: "#1a1a1a",
                padding: 10,
                borderRadius: 8,
                border: "1px solid #333",
              }}
            >
              <img
                src={u.avatar}
                alt="avatar"
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginRight: 10,
                }}
              />
              <div>
                <div style={{ fontWeight: "bold" }}>{u.username}</div>
                <div style={{ fontSize: 12, color: "#ccc" }}>{u.profile}</div>
                <div style={{ fontSize: 11, color: "#777" }}>{u.location}</div>
              </div>
            </div>
          ))}
        </div>

        {/* MAP */}
        <div
          style={{
            flex: 1,
            borderRadius: 10,
            overflow: "hidden",
            border: "1px solid #333",
          }}
        >
          <KakaoMap users={users} />
        </div>
      </div>

      {/* RIGHT SIDE — MESSENGER UI */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "#ffffff",
          borderLeft: "1px solid #ddd",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            padding: 15,
            borderBottom: "1px solid #ddd",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <img
            src={jessicaAvatar}
            alt="chat-avatar"
            style={{ width: 45, height: 45, borderRadius: "50%" }}
          />
          <div>
            <div style={{ fontWeight: "bold", color: "#000" }}>Jessica Kim</div>
            <div style={{ fontSize: 12, color: "#666" }}>서울시청 • 온라인</div>
          </div>
        </div>

        {/* MESSAGES */}
        <div
          style={{
            flex: 1,
            padding: 20,
            overflowY: "auto",
            background: "#f0f2f5",
          }}
        >
          {chatMessages.map((msg, idx) => {
            const isMe = msg.from !== "Jessica Kim";

            return (
              <div
                key={idx}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: isMe ? "flex-end" : "flex-start",
                  marginBottom: 15,
                }}
              >
                <div
                  style={{
                    maxWidth: "70%",
                    padding: "10px 14px",
                    borderRadius: 18,
                    background: isMe ? "#0084ff" : "#ffffff",
                    color: isMe ? "#fff" : "#000",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
                  }}
                >
                  {msg.message}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#555",
                    marginTop: 4,
                  }}
                >
                  {msg.time}
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* INPUT */}
        <div
          style={{
            padding: 15,
            borderTop: "1px solid #ddd",
            display: "flex",
            gap: 10,
          }}
        >
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="메시지를 입력하세요..."
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 20,
              border: "1px solid #ccc",
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              padding: "8px 18px",
              backgroundColor: "#0084ff",
              color: "#fff",
              border: "none",
              borderRadius: 20,
              cursor: "pointer",
            }}
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
