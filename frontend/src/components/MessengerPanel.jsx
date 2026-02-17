function MessengerPanel({
  chatMessages,
  chatInput,
  setChatInput,
  sendMessage,
  chatEndRef,
  avatar,
  currentUser,
}) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "#ffffff",
        borderLeft: "1px solid #e4e6eb",
        fontFamily: "Helvetica, Arial, sans-serif",
      }}
    >
      {/* ================= HEADER ================= */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #e4e6eb",
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "#ffffff",
        }}
      >
        <div style={{ position: "relative" }}>
          <img
            src={avatar}
            alt="chat-avatar"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
          {/* Green Online Dot */}
          <div
            style={{
              position: "absolute",
              bottom: 2,
              right: 2,
              width: 10,
              height: 10,
              backgroundColor: "#31a24c",
              borderRadius: "50%",
              border: "2px solid white",
            }}
          />
        </div>

        <div>
          <div style={{ fontWeight: 600, fontSize: 15, color: "#050505" }}>
            {currentUser ? currentUser.username : "로그인 필요"}
          </div>
          <div style={{ fontSize: 12, color: "#65676b" }}>온라인</div>
        </div>
      </div>

      {/* ================= MESSAGE AREA ================= */}
      <div
        style={{
          flex: 1,
          padding: "16px",
          overflowY: "auto",
          background: "#ffffff",
        }}
      >
        {chatMessages.map((msg, idx) => {
          const isMe = currentUser && msg.from === currentUser.username;

          return (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent: isMe ? "flex-end" : "flex-start",
                marginBottom: 10,
              }}
            >
              {!isMe && (
                <img
                  src={avatar}
                  alt="user-avatar"
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    marginRight: 8,
                    alignSelf: "flex-end",
                  }}
                />
              )}

              <div
                style={{
                  maxWidth: "60%",
                  padding: "10px 14px",
                  borderRadius: 18,
                  fontSize: 14,
                  backgroundColor: isMe ? "#0084ff" : "#f0f2f5",
                  color: isMe ? "#ffffff" : "#050505",
                  lineHeight: 1.4,
                }}
              >
                {msg.message}
              </div>

              {isMe && (
                <img
                  src={avatar}
                  alt="my-avatar"
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    marginLeft: 8,
                    alignSelf: "flex-end",
                  }}
                />
              )}
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* ================= INPUT ================= */}
      <div
        style={{
          padding: "10px 16px",
          borderTop: "1px solid #e4e6eb",
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "#ffffff",
        }}
      >
        <input
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="메시지를 입력하세요..."
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: 20,
            border: "1px solid #ccd0d5",
            outline: "none",
            fontSize: 14,
            backgroundColor: "#f0f2f5",
            color: "#050505", // ✅ text black
            caretColor: "#050505", // ✅ cursor black
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            padding: "8px 18px",
            backgroundColor: "#0084ff",
            color: "#ffffff",
            border: "none",
            borderRadius: 20,
            fontWeight: 500,
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
