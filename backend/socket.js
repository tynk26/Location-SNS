const { Server } = require("socket.io");

function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`[SOCKET] connected: ${socket.id}`);

    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`[SOCKET] ${socket.id} joined room ${roomId}`);
    });

    // broadcast to ALL (including sender)
    socket.on("sendMessage", ({ roomId, fromUser, message }) => {
      if (!roomId || !fromUser || !message) return;
      io.to(roomId).emit("receiveMessage", { fromUser, message });
    });

    socket.on("disconnect", () => {
      console.log(`[SOCKET] disconnected: ${socket.id}`);
    });
  });

  return io;
}

module.exports = { initSocket };
