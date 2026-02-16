function UserList({ users }) {
  return (
    <div
      style={{
        background: "#111",
        padding: 20,
        borderRadius: 10,
        marginBottom: 10,
        overflowY: "auto",
        maxHeight: 250,
      }}
    >
      <h4>등록된 사용자</h4>

      {users.map((u) => (
        <div
          key={u.id}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 10,
            background: "#1a1a1a",
            padding: 10,
            borderRadius: 8,
            border: "1px solid #333",
          }}
        >
          <img
            src={u.avatar}
            alt="avatar"
            style={{
              width: 45,
              height: 45,
              borderRadius: "50%",
              objectFit: "cover",
              marginRight: 10,
            }}
          />
          <div>
            <div style={{ fontWeight: "bold" }}>{u.username}</div>
            <div style={{ fontSize: 12, color: "#ccc" }}>{u.profile}</div>
            <div style={{ fontSize: 11, color: "#777" }}>{u.location}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserList;
