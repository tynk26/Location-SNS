import { useState, useEffect, useRef } from "react";
import KakaoMap from "./components/KakaoMap";
import jessicaAvatar from "./assets/jessica.jpg";
import michaelAvatar from "./assets/michael.jpg";
import sominAvatar from "./assets/somin.jpg"; // ✅ NEW

function App() {
  const defaultUsers = [
    {
      id: 1,
      username: "Jessica Kim",
      profile: "서울시청 근처에서 커피 마시는 중 ☕",
      lat: 37.5662952,
      lng: 126.9779451,
      avatar: jessicaAvatar,
    },
    {
      id: 2,
      username: "Michael Park",
      profile: "시청 근처 1km 산책 중 🚶",
      lat: 37.5705,
      lng: 126.982,
      avatar: michaelAvatar,
    },
    {
      id: 3, // ✅ NEW USER
      username: "Somin Lee",
      profile: "광화문에서 책 읽는 중 📚",
      lat: 37.5718, // 광화문 (시청 반경 내)
      lng: 126.9769,
      avatar: sominAvatar,
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
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
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
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        fontFamily: "Arial",
        background: "#f0f2f5",
      }}
    >
      {/* LEFT SIDE — BLACK THEME */}
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
        <div
          style={{
            flex: 1,
            padding: 20,
            borderRadius: 10,
            background: "#111",
            overflowY: "auto",
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
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            등록
          </button>

          <h4 style={{ marginTop: 25 }}>등록된 사용자</h4>

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
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginRight: 10,
                }}
              />
              <div>
                <div style={{ fontWeight: "bold" }}>{u.username}</div>
                <div style={{ fontSize: 12, color: "#ccc" }}>{u.profile}</div>
                <div style={{ fontSize: 11, color: "#777" }}>
                  {u.lat.toFixed(4)}, {u.lng.toFixed(4)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* MAP */}
        <div
          style={{
            flex: 1,
            marginTop: 10,
            borderRadius: 10,
            overflow: "hidden",
            border: "1px solid #333",
          }}
        >
          <KakaoMap users={users} />
        </div>
      </div>

      {/* RIGHT SIDE — CHAT (UNCHANGED) */}
      <div
        style={{
          flex: 1,
          padding: 10,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            flex: 1,
            background: "#fff",
            borderRadius: 10,
            padding: 15,
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <h3>💬 채팅</h3>

          <div style={{ flex: 1, overflowY: "auto", marginTop: 10 }}>
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  textAlign: msg.from === "Jessica Kim" ? "left" : "right",
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: 15,
                    background:
                      msg.from === "Jessica Kim" ? "#e5e5ea" : "#ff385c",
                    color: msg.from === "Jessica Kim" ? "#000" : "#fff",
                  }}
                >
                  {msg.message}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div style={{ display: "flex", marginTop: 10 }}>
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="메시지 입력"
              style={{ flex: 1, padding: 8 }}
            />
            <button
              onClick={sendMessage}
              style={{
                padding: "8px 15px",
                backgroundColor: "#ff385c",
                color: "#fff",
                border: "none",
                borderRadius: 5,
                marginLeft: 5,
                cursor: "pointer",
              }}
            >
              보내기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
