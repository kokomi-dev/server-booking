const { Server } = require("socket.io");
const users = new Map(); // userId -> socketId
const admins = new Set(); // socketId
const messageHistory = new Map(); // userId -> [messages]

function setupSocketIO(server) {
  const io = new Server(server, {
    cors: {
      origin: [
        process.env.LOCAL_HOST_PORT_WEB,
        process.env.LOCAL_HOST_PORT_ADMIN,
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`[+] Socket connected: ${socket.id}`);

    socket.on("register", ({ userId, isAdmin }) => {
      if (isAdmin) {
        admins.add(socket.id);
        console.log(`[ADMIN] Connected: ${socket.id}`);

        // Gửi toàn bộ conversation cho admin mới
        const allConversations = [...messageHistory.entries()].map(
          ([userId, messages]) => ({ userId, messages })
        );
        socket.emit("all_conversations", allConversations);
      } else {
        users.set(userId, socket.id);
        console.log(`[USER] ${userId} connected (${socket.id})`);

        // Gửi lịch sử chat nếu có
        const history = messageHistory.get(userId) || [];
        socket.emit("message_history", history);

        // Nếu chưa có, khởi tạo array trống
        if (!messageHistory.has(userId)) {
          messageHistory.set(userId, []);
        }

        // Thông báo cho admin
        admins.forEach((adminSocketId) => {
          io.to(adminSocketId).emit("user_connected", {
            userId,
            socketId: socket.id,
            hasMessages: history.length > 0,
          });
        });
      }
    });

    socket.on("user_message", ({ userId, message }) => {
      const msg = {
        userId,
        content: message,
        fromUser: true,
        timestamp: new Date(),
      };
      messageHistory.get(userId)?.push(msg);

      // Gửi tới admin
      admins.forEach((adminSocketId) => {
        io.to(adminSocketId).emit("new_message", msg);
      });

      socket.emit("message_confirmed", { messageId: msg.timestamp });
    });

    socket.on("admin_message", ({ userId, message }) => {
      const msg = {
        userId,
        content: message,
        fromUser: false,
        timestamp: new Date(),
      };
      messageHistory.get(userId)?.push(msg);

      // Gửi cho người dùng
      const userSocketId = users.get(userId);
      if (userSocketId) {
        io.to(userSocketId).emit("new_message", msg);
      }

      // Sync cho các admin khác
      admins.forEach((adminSocketId) => {
        io.to(adminSocketId).emit("admin_message_sync", msg);
      });
    });

    socket.on("disconnect", () => {
      if (admins.has(socket.id)) {
        admins.delete(socket.id);
        console.log(`[ADMIN] Disconnected: ${socket.id}`);
      } else {
        const userId = [...users.entries()].find(
          ([, socketId]) => socketId === socket.id
        )?.[0];

        if (userId) {
          users.delete(userId);
          console.log(`[USER] ${userId} disconnected`);

          admins.forEach((adminSocketId) => {
            io.to(adminSocketId).emit("user_disconnected", { userId });
          });
        }
      }
    });
  });
}

module.exports = setupSocketIO;
