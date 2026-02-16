function RegisterForm({
  nickname,
  setNickname,
  bio,
  setBio,
  setAvatar,
  registerUser,
}) {
  return (
    <div
      style={{
        background: "#111",
        padding: 20,
        borderRadius: 10,
        marginBottom: 10,
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
          cursor: "pointer",
        }}
      >
        등록
      </button>
    </div>
  );
}

export default RegisterForm;
