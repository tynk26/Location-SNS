import { useState, useEffect, useRef } from "react";
import KakaoMap from "./components/KakaoMap";
import jessicaAvatar from "./assets/jessica.jpg";
import michaelAvatar from "./assets/michael.jpg";
import sominAvatar from "./assets/somin.jpg";
// import UserList from "./components/UserList";
// import RegisterForm from "./components/RegisterForm";
import LeftPanel from "./components/LeftPanel";
import MessengerPanel from "./components/MessengerPanel";

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
      <LeftPanel
        users={users}
        nickname={nickname}
        bio={bio}
        avatar={avatar}
        setNickname={setNickname}
        setBio={setBio}
        setAvatar={setAvatar}
        registerUser={registerUser}
      />

      <MessengerPanel
        chatMessages={chatMessages}
        chatInput={chatInput}
        setChatInput={setChatInput}
        sendMessage={sendMessage}
        chatEndRef={chatEndRef}
        avatar={jessicaAvatar}
      />
    </div>
  );
}

export default App;
