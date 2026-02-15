import { useState, useEffect } from "react";
import axios from "axios";
import KakaoMap from "./components/KakaoMap";

function App() {
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("");

  const [useGPS, setUseGPS] = useState(true);
  const [latInput, setLatInput] = useState("");
  const [lngInput, setLngInput] = useState("");

  const registerUser = () => {
    if (!nickname) {
      alert("닉네임 입력하세요");
      return;
    }

    if (useGPS) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          sendUser(latitude, longitude);
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

      sendUser(parseFloat(latInput), parseFloat(lngInput));
    }
  };

  const sendUser = (lat, lng) => {
    axios
      .post("http://localhost:5000/api/users", {
        nickname,
        bio,
        lat,
        lng,
      })
      .then((res) => {
        setStatus("등록 완료");
        fetchUsers();
      });
  };

  const fetchUsers = () => {
    axios.get("http://localhost:5000/api/users").then((res) => {
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

      <label>
        <input
          type="checkbox"
          checked={useGPS}
          onChange={() => setUseGPS(!useGPS)}
        />
        GPS 사용
      </label>

      {!useGPS && (
        <>
          <br />
          <br />
          <input
            placeholder="위도 (Latitude)"
            value={latInput}
            onChange={(e) => setLatInput(e.target.value)}
          />
          <br />
          <br />
          <input
            placeholder="경도 (Longitude)"
            value={lngInput}
            onChange={(e) => setLngInput(e.target.value)}
          />
        </>
      )}

      <br />
      <br />
      <button onClick={registerUser}>등록</button>

      <p>{status}</p>

      <hr />

      <h3>등록된 사용자</h3>
      {users.map((user) => (
        <div key={user.id} style={{ marginBottom: 10 }}>
          <strong>{user.nickname}</strong>
          <br />
          {user.bio}
          <br />
          📍 {user.lat}, {user.lng}
        </div>
      ))}

      <hr />
      <h3>지도</h3>
      <KakaoMap />
    </div>
  );
}

export default App;
