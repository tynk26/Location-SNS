import RegisterForm from "./RegisterForm";
import UserList from "./UserList";
import KakaoMap from "./KakaoMap";

function LeftPanel({
  users,
  nickname,
  bio,
  avatar,
  setNickname,
  setBio,
  setAvatar,
  registerUser,
}) {
  return (
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
      <RegisterForm
        nickname={nickname}
        bio={bio}
        avatar={avatar}
        setNickname={setNickname}
        setBio={setBio}
        setAvatar={setAvatar}
        registerUser={registerUser}
      />

      <UserList users={users} />

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
  );
}

export default LeftPanel;
