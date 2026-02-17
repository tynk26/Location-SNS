import React from "react";

function MessengerPanel({
  chatMessages,
  chatInput,
  setChatInput,
  sendMessage,
  chatEndRef,
  currentUser,
  users,
}) {
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const getAvatarByUsername = (username) => {
    const user = users.find((u) => u.username === username);
    return user?.avatar;
  };

  return (
    <div
      style={{
        width: "320px",
        borderLeft: "1px solid #ddd",
        display: "flex",
        flexDirection: "column",
        background: "#f5f7fb",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: "15px",
          fontWeight: "bold",
          borderBottom: "1px solid #ddd",
          background: "white",
        }}
      >
        💬 Global Chat
      </div>

      {/* MESSAGE AREA */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "15px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {chatMessages.map((msg, index) => {
          const isMe = currentUser?.username === msg.from;
          const avatar = getAvatarByUsername(msg.from);

          return (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: isMe ? "row-reverse" : "row",
                alignItems: "flex-end",
                gap: "8px",
              }}
            >
              {/* Avatar */}
              <img
                src={avatar}
                alt="avatar"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />

              {/* Message Bubble */}
              <div
                style={{
                  background: isMe ? "#0084ff" : "white",
                  color: isMe ? "white" : "black",
                  padding: "8px 12px",
                  borderRadius: "18px",
                  maxWidth: "200px",
                  fontSize: "14px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                {msg.message}
                <div
                  style={{
                    fontSize: "10px",
                    marginTop: "4px",
                    opacity: 0.7,
                    textAlign: "right",
                  }}
                >
                  {msg.time}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={chatEndRef} />
      </div>

      {/* INPUT AREA */}
      <div
        style={{
          display: "flex",
          padding: "10px",
          borderTop: "1px solid #ddd",
          background: "white",
        }}
      >
        <input
          type="text"
          placeholder={
            currentUser
              ? `${currentUser.username}로 메시지 보내기`
              : "로그인 먼저 하세요"
          }
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={handleKeyPress}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "20px",
            border: "1px solid #ccc",
            outline: "none",
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            marginLeft: "8px",
            padding: "8px 14px",
            borderRadius: "20px",
            border: "none",
            background: "#0084ff",
            color: "white",
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
