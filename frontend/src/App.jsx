import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("");

  const registerUser = () => {
    if (!nickname) {
      alert("닉네임 입력하세요");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        console.log("[FRONTEND] 위치:", latitude, longitude);

        axios
          .post("http://localhost:5000/api/users", {
            nickname,
            bio,
            lat: latitude,
            lng: longitude,
          })
          .then((res) => {
            console.log("[FRONTEND] 사용자 등록:", res.data);
            setStatus("등록 완료");
            fetchUsers();
          });
      },
      (error) => {
        console.error(error);
        alert("위치 권한 허용 필요");
      },
    );
  };

  const fetchUsers = () => {
    axios.get("http://localhost:5000/api/users").then((res) => {
      console.log("[FRONTEND] 사용자 목록:", res.data);
      setUsers(res.data);
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Location SNS MVP</h1>

      <h3>사용자 등록</h3>
      <input
        placeholder="닉네임"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <br />
      <br />
      <input
        placeholder="소개"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />
      <br />
      <br />
      <button onClick={registerUser}>내 위치로 등록</button>

      <p>{status}</p>

      <hr />

      <h3>등록된 사용자</h3>
      {users.map((user) => (
        <div key={user.id} style={{ marginBottom: 10 }}>
          <strong>{user.nickname}</strong> <br />
          {user.bio} <br />
          📍 {user.lat}, {user.lng}
        </div>
      ))}
    </div>
  );
}

export default App;
