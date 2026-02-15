import { useState, useEffect, useRef } from "react";
import axios from "axios";
import KakaoMap from "./components/KakaoMap";

function App() {
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [useGPS, setUseGPS] = useState(true);
  const [latInput, setLatInput] = useState("");
  const [lngInput, setLngInput] = useState("");

  const [notifications, setNotifications] = useState([
    {
      type: "like",
      message: "Jessica님이 당신을 좋아합니다",
      time: "09:30 AM",
      read: false,
    },
    {
      type: "new_user",
      message: "Michael님이 근처에 가입했습니다",
      time: "09:45 AM",
      read: true,
    },
    {
      type: "message",
      message: "Jessica님이 메시지를 보냈습니다",
      time: "10:00 AM",
      read: false,
    },
  ]);

  const [chatMessages, setChatMessages] = useState([
    {
      from: "Jessica",
      message: "안녕 Michael! 오늘 기분 어때?",
      time: "10:00 AM",
    },
    {
      from: "Michael",
      message: "안녕 Jessica! 나는 좋아, 너는?",
      time: "10:01 AM",
    },
    {
      from: "Jessica",
      message: "나도 좋아. 오늘 맵 테스트 해볼래?",
      time: "10:02 AM",
    },
    { from: "Michael", message: "좋아, 내 위치 보내줄게.", time: "10:03 AM" },
    { from: "Jessica", message: "완벽해 😄", time: "10:04 AM" },
  ]);

  const [chatInput, setChatInput] = useState("");
  const [typingUser, setTypingUser] = useState("");
  const chatEndRef = useRef(null);

  const registerUser = () => {
    if (!nickname) {
      alert("닉네임 입력하세요");
      return;
    }

    const sendData = (lat, lng) => {
      const formData = new FormData();
      formData.append("nickname", nickname);
      formData.append("bio", bio);
      formData.append("lat", lat);
      formData.append("lng", lng);
      if (avatar) formData.append("avatar", avatar);

      axios
        .post("http://localhost:5000/api/users", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          setStatus("등록 완료");
          setCurrentUserId(res.data.id);
          fetchUsers();
          setNotifications((prev) => [
            ...prev,
            {
              type: "registration",
              message: "회원가입 완료!",
              time: new Date().toLocaleTimeString(),
              read: false,
            },
          ]);
        });
    };

    if (useGPS) {
      navigator.geolocation.getCurrentPosition(
        (position) =>
          sendData(position.coords.latitude, position.coords.longitude),
        () => alert("위치 권한 허용 필요"),
      );
    } else {
      if (!latInput || !lngInput) {
        alert("좌표 입력하세요");
        return;
      }
      sendData(parseFloat(latInput), parseFloat(lngInput));
    }
  };

  const fetchUsers = () => {
    axios
      .get("http://localhost:5000/api/users")
      .then((res) => setUsers(res.data));
  };

  useEffect(() => {
    if (chatEndRef.current)
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    fetchUsers();
  }, [currentUserId]);

  const handleSendChat = () => {
    if (!chatInput) return;
    setChatMessages((prev) => [
      ...prev,
      {
        from: "You",
        message: chatInput,
        time: new Date().toLocaleTimeString(),
      },
    ]);
    setChatInput("");
    setTypingUser("");
  };

  const handleTyping = (e) => {
    setChatInput(e.target.value);
    setTypingUser("You");
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return "❤️";
      case "new_user":
        return "🆕";
      case "message":
        return "💬";
      case "registration":
        return "✅";
      default:
        return "🔔";
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Left Column */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          padding: 10,
        }}
      >
        {/* Top 50%: Registration */}
        <div
          style={{
            flex: 1,
            background: "#fff",
            padding: 20,
            borderRadius: 10,
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            overflowY: "auto",
          }}
        >
          <h3 style={{ color: "#000" }}>사용자 등록</h3>
          <input
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            style={{
              width: "100%",
              padding: 8,
              marginBottom: 10,
              borderRadius: 5,
              border: "1px solid #ccc",
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
              borderRadius: 5,
              border: "1px solid #ccc",
            }}
          />

          <label style={{ display: "block", marginBottom: 10 }}>
            <input
              type="checkbox"
              checked={useGPS}
              onChange={() => setUseGPS(!useGPS)}
            />{" "}
            GPS 사용
          </label>

          {!useGPS && (
            <>
              <input
                placeholder="위도"
                value={latInput}
                onChange={(e) => setLatInput(e.target.value)}
                style={{
                  width: "48%",
                  padding: 8,
                  marginRight: "4%",
                  marginBottom: 10,
                  borderRadius: 5,
                  border: "1px solid #ccc",
                }}
              />
              <input
                placeholder="경도"
                value={lngInput}
                onChange={(e) => setLngInput(e.target.value)}
                style={{
                  width: "48%",
                  padding: 8,
                  marginBottom: 10,
                  borderRadius: 5,
                  border: "1px solid #ccc",
                }}
              />
            </>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setAvatar(e.target.files[0]);
              setAvatarPreview(URL.createObjectURL(e.target.files[0]));
            }}
            style={{ marginBottom: 10 }}
          />

          <div style={{ width: "100%", marginTop: 10 }}>
            <button
              onClick={registerUser}
              style={{
                display: "block",
                width: "30%",
                padding: 10,
                backgroundColor: "#ff385c",
                color: "#fff",
                borderRadius: 5,
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              등록
            </button>
          </div>

          <p style={{ color: "green" }}>{status}</p>

          <hr />
          <h3 style={{ color: "#000" }}>등록된 사용자</h3>
          {users.map((user) => (
            <div
              key={user.id}
              style={{
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <img
                src={user.id === currentUserId ? avatarPreview : user.avatar}
                alt="avatar"
                style={{ width: 40, height: 40, borderRadius: "50%" }}
              />
              <div style={{ color: "#000" }}>
                <strong>{user.nickname}</strong>
                <div style={{ fontSize: 12 }}>{user.bio}</div>
                <div style={{ fontSize: 11 }}>
                  📍 {user.lat}, {user.lng}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom 50%: Kakao Map */}
        <div
          style={{
            flex: 1,
            borderRadius: 10,
            overflow: "hidden",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <KakaoMap currentUserId={currentUserId} />
        </div>
      </div>

      {/* Right Column */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          padding: 10,
        }}
      >
        {/* Top 50%: Chat */}
        <div
          style={{
            flex: 1,
            background: "#fff",
            padding: 10,
            borderRadius: 10,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h3>💬 Chat</h3>
          <div style={{ flex: 1, overflowY: "auto", paddingRight: 5 }}>
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.from === "Jessica" ? "flex-start" : "flex-end",
                  marginBottom: 6,
                }}
              >
                <div
                  style={{
                    background: msg.from === "Jessica" ? "#e5e5ea" : "#ff385c",
                    color: msg.from === "Jessica" ? "#000" : "#fff",
                    padding: "8px 12px",
                    borderRadius: 15,
                    maxWidth: "70%",
                    wordBreak: "break-word",
                    transition: "0.2s",
                  }}
                >
                  <strong>{msg.from}:</strong> {msg.message}
                  <div
                    style={{ fontSize: 10, color: "#666", textAlign: "right" }}
                  >
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}
            {typingUser && (
              <div style={{ fontSize: 12, color: "#999" }}>
                {typingUser} is typing...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div style={{ display: "flex", gap: 5, marginTop: 5 }}>
            <input
              value={chatInput}
              onChange={handleTyping}
              placeholder="메시지 입력"
              style={{
                flex: 1,
                padding: 8,
                borderRadius: 10,
                border: "1px solid #ccc",
              }}
            />
            <button
              onClick={handleSendChat}
              style={{
                padding: "8px 15px",
                borderRadius: 10,
                backgroundColor: "#ff385c",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              보내기
            </button>
          </div>
        </div>

        {/* Bottom 50%: Notifications */}
        <div
          style={{
            flex: 1,
            background: "#000000",
            padding: 10,
            borderRadius: 10,
            overflowY: "auto",
          }}
        >
          <h4 style={{ color: "#fff" }}>🔔 알림</h4>
          {notifications.length === 0 && (
            <div style={{ fontSize: 12, color: "#fff" }}>
              새 알림이 없습니다
            </div>
          )}
          {notifications.map((note, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: 12,
                borderBottom: "1px solid #333",
                padding: "6px 0",
                backgroundColor: note.read ? "#000" : "#111",
              }}
            >
              <div style={{ color: "#fff" }}>
                <span style={{ marginRight: 6 }}>
                  {getNotificationIcon(note.type)}
                </span>
                {note.message}
              </div>
              <div style={{ color: "#999", fontSize: 10 }}>{note.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
