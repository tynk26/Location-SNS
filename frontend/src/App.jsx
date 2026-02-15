import { useState, useEffect } from "react";
import axios from "axios";
import KakaoMap from "./components/KakaoMap";

function App() {
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("");

  const [useGPS, setUseGPS] = useState(true);
  const [latInput, setLatInput] = useState("");
  const [lngInput, setLngInput] = useState("");

  const [currentUserId, setCurrentUserId] = useState(null);

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
        });
    };

    if (useGPS) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          sendData(latitude, longitude);
        },
        (error) => {
          alert("위치 권한 허용 필요");
        },
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
    axios.get("http://localhost:5000/api/users").then((res) => {
      setUsers(res.data);
    });
  };

  // Static chat messages
  const chatMessages = [
    { from: "Jessica", message: "안녕 Michael! 오늘 기분 어때?" },
    { from: "Michael", message: "안녕 Jessica! 나는 좋아, 너는?" },
    { from: "Jessica", message: "나도 좋아. 오늘 맵 테스트 해볼래?" },
    { from: "Michael", message: "좋아, 내 위치 보내줄게." },
    { from: "Jessica", message: "완벽해 😄" },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        height: "100vh",
        width: "100vw",
        gap: "10px",
        fontFamily: "Arial, sans-serif",
        padding: "10px",
        boxSizing: "border-box",
      }}
    >
      {/* Top Left: Registration */}
      <div
        style={{
          gridColumn: "1 / 2",
          gridRow: "1 / 2",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            marginBottom: "20px",
          }}
        >
          <h3>사용자 등록</h3>

          <input
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />

          <input
            placeholder="소개"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />

          <label style={{ display: "block", marginBottom: "10px" }}>
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
                placeholder="위도 (Latitude)"
                value={latInput}
                onChange={(e) => setLatInput(e.target.value)}
                style={{
                  width: "48%",
                  padding: "8px",
                  marginRight: "4%",
                  marginBottom: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
              <input
                placeholder="경도 (Longitude)"
                value={lngInput}
                onChange={(e) => setLngInput(e.target.value)}
                style={{
                  width: "48%",
                  padding: "8px",
                  marginBottom: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </>
          )}

          {/* File input */}
          <input
            type="file"
            onChange={(e) => setAvatar(e.target.files[0])}
            accept="image/*"
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />

          {/* Register button full width and red */}
          <button
            onClick={registerUser}
            style={{
              width: "20%",
              padding: "10px",
              backgroundColor: "#ff385c",
              color: "white",
              fontWeight: "bold",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            등록
          </button>

          <p style={{ color: "green" }}>{status}</p>
        </div>

        {/* Top Left Users List */}
        <div>
          <h3>주변 사용자</h3>
          {users.map((user) => (
            <div
              key={user.id}
              style={{
                display: "flex",
                alignItems: "center",
                background: "white",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "8px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={
                  user.avatar
                    ? user.avatar.startsWith("/uploads/")
                      ? `http://localhost:5000${user.avatar}`
                      : user.avatar
                    : "https://via.placeholder.com/50"
                }
                alt="avatar"
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              />
              <div style={{ flex: 1 }}>
                <strong>{user.nickname}</strong>
                <div style={{ fontSize: "12px", color: "#555" }}>
                  {user.bio}
                </div>
                <div style={{ fontSize: "11px", color: "#888" }}>
                  📍 {user.lat}, {user.lng}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Left: Kakao Map */}
      <div
        style={{
          gridColumn: "1 / 2",
          gridRow: "2 / 3",
          borderTop: "1px solid #ddd",
          height: "100%",
        }}
      >
        <KakaoMap currentUserId={currentUserId} />
      </div>

      {/* Right Half: Static Chat */}
      <div
        style={{
          gridColumn: "2 / 3",
          gridRow: "1 / 3",
          padding: "20px",
          backgroundColor: "#f9f9f9",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        <h2>💬 Chat</h2>
        <div style={{ flex: 1, overflowY: "auto", marginBottom: "10px" }}>
          {[
            { from: "Jessica", message: "안녕 Michael! 오늘 기분 어때?" },
            { from: "Michael", message: "안녕 Jessica! 나는 좋아, 너는?" },
            { from: "Jessica", message: "나도 좋아. 오늘 맵 테스트 해볼래?" },
            { from: "Michael", message: "좋아, 내 위치 보내줄게." },
            { from: "Jessica", message: "완벽해 😄" },
          ].map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent:
                  msg.from === "Jessica" ? "flex-start" : "flex-end",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  background: msg.from === "Jessica" ? "#e5e5ea" : "#ff385c",
                  color: msg.from === "Jessica" ? "#000" : "#fff",
                  padding: "8px 12px",
                  borderRadius: "15px",
                  maxWidth: "70%",
                  wordBreak: "break-word",
                }}
              >
                <strong>{msg.from}:</strong> {msg.message}
              </div>
            </div>
          ))}
        </div>

        <input
          placeholder="메시지 입력"
          style={{
            padding: "8px",
            borderRadius: "10px",
            border: "1px solid #ccc",
          }}
          disabled
        />
        <button
          style={{
            marginTop: "5px",
            padding: "10px",
            backgroundColor: "#ccc",
            border: "none",
            borderRadius: "5px",
            cursor: "not-allowed",
          }}
          disabled
        >
          보내기
        </button>
      </div>
    </div>
  );
}

export default App;
