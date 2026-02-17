require("dotenv").config();
const http = require("http");
const { createApp } = require("./app");
const { initSocket } = require("./socket");

const PORT = process.env.PORT || 5000;

const app = createApp();
const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
  console.log(`[SERVER] Running on http://localhost:${PORT}`);
});
