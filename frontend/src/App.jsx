import { useState, useEffect } from "react";
import axios from "axios";
import KakaoMap from "./components/KakaoMap";

function App() {
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState(null); // actual file
  const [avatarUrl, setAvatarUrl] = useState(""); // to preview
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  const [useGPS, setUseGPS] = useState(true);
  const [latInput, setLatInput] = useState("");
  const [lngInput, setLngInput] = useState("");

  // preview selected file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
    if (file) {
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  const registerUser = () => {
    if (!nickname) {
      alert("닉네임 입력하세요");
      return;
    }

    const submitCoordinates = (lat, lng) => {
      const formData = new FormData();
      formData.append("nickname", nickname);
      formData.append("bio", bio);
      formData.append("lat", lat);
      formData.append("lng", lng);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      axios
        .post("http://localhost:5000/api/users", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          setStatus("등록 완료");
          setCurrentUserId(res.data.id);
          fetchUsers();
          setAvatarFile(null);
          setAvatarUrl("");
        })
        .catch((err) => {
          console.error(err);
          setStatus("등록 실패");
        });
    };

    if (useGPS) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          submitCoordinates(latitude, longitude);
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
      submitCoordinates(parseFloat(latInput), parseFloat(lngInput));
    }
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

      <input type="file" accept="image/*" onChange={handleFileChange} />
      {avatarUrl && (
        <div style={{ marginTop: 10 }}>
          <img
            src={avatarUrl}
            alt="preview"
            style={{ width: 80, height: 80, borderRadius: "50%" }}
          />
        </div>
      )}
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
        <div
          key={user.id}
          style={{ marginBottom: 10, display: "flex", alignItems: "center" }}
        >
          <img
            src={user.avatar || "https://via.placeholder.com/40"}
            alt="avatar"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              marginRight: 10,
            }}
          />
          <div>
            <strong>{user.nickname}</strong>
            <br />
            {user.bio}
            <br />
            📍 {user.lat}, {user.lng}
          </div>
        </div>
      ))}

      <hr />
      <h3>지도</h3>
      <KakaoMap currentUserId={currentUserId} />
    </div>
  );
}

export default App;
