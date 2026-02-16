function MessengerPanel({
  chatMessages,
  chatInput,
  setChatInput,
  sendMessage,
  chatEndRef,
  avatar,
}) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "#ffffff",
        borderLeft: "1px solid #ddd",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: 15,
          borderBottom: "1px solid #ddd",
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "#fff",
        }}
      >
        <img
          src={avatar}
          alt="chat-avatar"
          style={{ width: 45, height: 45, borderRadius: "50%" }}
        />
        <div>
          <div style={{ fontWeight: "bold", color: "#000" }}>Jessica Kim</div>
          <div style={{ fontSize: 12, color: "#666" }}>서울시청 • 온라인</div>
        </div>
      </div>

      {/* MESSAGE AREA */}
      <div
        style={{
          flex: 1,
          padding: 20,
          overflowY: "auto",
          background: "#f0f2f5",
        }}
      >
        {chatMessages.map((msg, idx) => {
          const isMe = msg.from !== "Jessica Kim";

          return (
            <div
              key={idx}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: isMe ? "flex-end" : "flex-start",
                marginBottom: 15,
              }}
            >
              <div
                style={{
                  maxWidth: "70%",
                  padding: "10px 14px",
                  borderRadius: 18,
                  background: isMe ? "#0084ff" : "#ffffff",
                  color: isMe ? "#fff" : "#000",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
                }}
              >
                {msg.message}
              </div>

              <div
                style={{
                  fontSize: 11,
                  color: "#555",
                  marginTop: 4,
                }}
              >
                {msg.time}
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* INPUT */}
      <div
        style={{
          padding: 15,
          borderTop: "1px solid #ddd",
          display: "flex",
          gap: 10,
          background: "#fff",
        }}
      >
        <input
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="메시지를 입력하세요..."
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 20,
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "8px 18px",
            backgroundColor: "#0084ff",
            color: "#fff",
            border: "none",
            borderRadius: 20,
            cursor: "pointer",
          }}
        >
          전송
        </button>
      </div>
    </div>
  );
}

export default MessengerPanel;
