import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import KakaoMap from "./components/KakaoMap";
import jessicaAvatar from "./assets/jessica.jpg";
import michaelAvatar from "./assets/michael.jpg";
import sominAvatar from "./assets/somin.jpg";
import LeftPanel from "./components/LeftPanel";
import MessengerPanel from "./components/MessengerPanel";

const socket = io("http://localhost:5000");

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
  const [currentUser, setCurrentUser] = useState(null);

  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(null);

  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef(null);

  const ROOM_ID = "global_chat_room";

  /* --------------------------
     Restore Login
  -------------------------- */
  useEffect(() => {
    const savedUser = localStorage.getItem("loggedInUser");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setCurrentUser(parsed);
      setNickname(parsed.username);
    }
  }, []);

  /* --------------------------
     Socket Setup
  -------------------------- */
  useEffect(() => {
    socket.emit("joinRoom", ROOM_ID);

    socket.on("receiveMessage", (msg) => {
      setChatMessages((prev) => [
        ...prev,
        {
          from: msg.fromUser,
          message: msg.message,
          time: new Date().toLocaleTimeString().slice(0, 5),
        },
      ]);
    });

    return () => socket.off("receiveMessage");
  }, []);

  /* --------------------------
     Auto Scroll
  -------------------------- */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  /* --------------------------
     Login
  -------------------------- */
  const loginUser = (user) => {
    setCurrentUser(user);
    setNickname(user.username);
    localStorage.setItem("loggedInUser", JSON.stringify(user));
  };

  /* --------------------------
     Register
  -------------------------- */
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

  /* --------------------------
     Send Message
  -------------------------- */
  const sendMessage = () => {
    if (!chatInput) return;
    if (!currentUser) return alert("로그인 먼저 하세요");

    const payload = {
      roomId: ROOM_ID,
      fromUser: currentUser.username,
      message: chatInput,
    };

    socket.emit("sendMessage", payload);

    setChatInput("");
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      {/* LEFT PANEL */}
      <LeftPanel
        users={users}
        nickname={nickname}
        bio={bio}
        avatar={avatar}
        setNickname={setNickname}
        setBio={setBio}
        setAvatar={setAvatar}
        registerUser={registerUser}
        loginUser={loginUser}
        currentUser={currentUser}
      />

      {/* MAP IN CENTER */}
      <div style={{ flex: 1 }}>
        <KakaoMap users={users} />
      </div>

      {/* CHAT ON RIGHT */}
      <MessengerPanel
        chatMessages={chatMessages}
        chatInput={chatInput}
        setChatInput={setChatInput}
        sendMessage={sendMessage}
        chatEndRef={chatEndRef}
        avatar={currentUser?.avatar}
        currentUser={currentUser}
        users={users}
      />
    </div>
  );
}

export default App;
