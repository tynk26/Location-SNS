import React from "react";

function LeftPanel({
  users,
  nickname,
  bio,
  avatar,
  setNickname,
  setBio,
  setAvatar,
  registerUser,
  loginUser,
  currentUser,
}) {
  return (
    <div
      style={{
        width: "320px",
        padding: "20px",
        borderRight: "1px solid #ddd",
        overflowY: "auto",
      }}
    >
      <h2>회원가입</h2>

      <input
        type="text"
        placeholder="닉네임"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <input
        type="text"
        placeholder="소개"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <input
        type="file"
        onChange={(e) => setAvatar(e.target.files[0])}
        style={{ marginBottom: "10px" }}
      />

      <button onClick={registerUser} style={{ width: "100%" }}>
        회원가입
      </button>

      <hr style={{ margin: "20px 0" }} />

      <h3>주변 사용자</h3>

      {users.map((user) => (
        <div
          key={user.id}
          style={{
            border: "1px solid #eee",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "6px",
          }}
        >
          <img
            src={user.avatar}
            alt=""
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />

          <div>
            <strong>{user.username}</strong>
          </div>
          <div>{user.profile}</div>
          <div style={{ fontSize: "12px", color: "gray" }}>
            위치: {user.location}
          </div>

          <button
            onClick={() => loginUser(user)}
            style={{
              marginTop: "8px",
              width: "100%",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              padding: "6px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            로그인
          </button>

          {currentUser?.id === user.id && (
            <div style={{ fontSize: "12px", color: "green" }}>
              현재 로그인 사용자
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default LeftPanel;
