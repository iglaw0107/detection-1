import app from "./app";
import { connectDB } from "./config/db";
import { setupSocket } from "./socket/index";

import { createServer } from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 5000;

// ✅ Connect DB
connectDB();

// ✅ Create HTTP server
const httpServer = createServer(app);

// ✅ Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

// ✅ Attach socket logic
setupSocket(io);

// ✅ Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});