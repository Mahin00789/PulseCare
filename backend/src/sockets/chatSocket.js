const jwt = require("jsonwebtoken");
const {
  createMessage,
  findConversationForUser,
  markConversationAsRead,
} = require("../services/chatService");

const onlineUsers = new Map();

const getOnlineUserIds = () => {
  return Array.from(onlineUsers.entries())
    .filter(([, sockets]) => sockets.size > 0)
    .map(([userId]) => userId);
};

const emitOnlineUsers = (io) => {
  io.emit("onlineUsers", getOnlineUserIds());
};

const requireSocketUser = (socket, callback) => {
  if (!socket.user) {
    callback?.({
      success: false,
      message: "Socket authentication required",
    });
    return false;
  }

  return true;
};

const registerChatSocket = (io) => {
  io.use((socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.split(" ")[1];

    if (!token) {
      return next();
    }

    try {
      socket.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      socket.user = null;
    }

    next();
  });

  io.on("connection", (socket) => {
    if (socket.user) {
      const userSockets = onlineUsers.get(socket.user.id) || new Set();
      userSockets.add(socket.id);
      onlineUsers.set(socket.user.id, userSockets);
      socket.join(`user:${socket.user.id}`);
      emitOnlineUsers(io);
    }

    socket.on("joinChat", async ({ conversationId } = {}, callback) => {
      if (!requireSocketUser(socket, callback)) {
        return;
      }

      const conversation = await findConversationForUser(
        conversationId,
        socket.user.id
      );

      if (!conversation) {
        callback?.({
          success: false,
          message: "You are not authorized to join this chat",
        });
        return;
      }

      socket.join(`conversation:${conversation.id}`);
      callback?.({
        success: true,
      });
    });

    socket.on("sendMessage", async ({ conversationId, text } = {}, callback) => {
      try {
        if (!requireSocketUser(socket, callback)) {
          return;
        }

        if (!text || !text.trim()) {
          callback?.({
            success: false,
            message: "Message text is required",
          });
          return;
        }

        const conversation = await findConversationForUser(
          conversationId,
          socket.user.id
        );

        if (!conversation) {
          callback?.({
            success: false,
            message: "You are not authorized to message this chat",
          });
          return;
        }

        const message = await createMessage(
          conversation.id,
          socket.user.id,
          text
        );

        io.to(`conversation:${conversation.id}`).emit("receiveMessage", {
          conversationId: conversation.id,
          message,
        });
        io.to(`user:${conversation.participantOneId}`).emit("chatUpdated");
        io.to(`user:${conversation.participantTwoId}`).emit("chatUpdated");

        callback?.({
          success: true,
          message,
        });
      } catch (error) {
        console.log(error);
        callback?.({
          success: false,
          message: "Unable to send message",
        });
      }
    });

    socket.on("typing", async ({ conversationId } = {}) => {
      if (!socket.user) {
        return;
      }

      const conversation = await findConversationForUser(
        conversationId,
        socket.user.id
      );

      if (conversation) {
        socket.to(`conversation:${conversation.id}`).emit("typing", {
          conversationId: conversation.id,
          userId: socket.user.id,
        });
      }
    });

    socket.on("stopTyping", async ({ conversationId } = {}) => {
      if (!socket.user) {
        return;
      }

      const conversation = await findConversationForUser(
        conversationId,
        socket.user.id
      );

      if (conversation) {
        socket.to(`conversation:${conversation.id}`).emit("stopTyping", {
          conversationId: conversation.id,
          userId: socket.user.id,
        });
      }
    });

    socket.on("markAsRead", async ({ conversationId } = {}, callback) => {
      if (!requireSocketUser(socket, callback)) {
        return;
      }

      const conversation = await markConversationAsRead(
        conversationId,
        socket.user.id
      );

      if (!conversation) {
        callback?.({
          success: false,
          message: "You are not authorized to update this chat",
        });
        return;
      }

      io.to(`conversation:${conversation.id}`).emit("messagesRead", {
        conversationId: conversation.id,
        readerId: socket.user.id,
      });
      io.to(`user:${socket.user.id}`).emit("chatUpdated");

      callback?.({
        success: true,
      });
    });

    socket.on("disconnect", () => {
      if (!socket.user) {
        return;
      }

      const userSockets = onlineUsers.get(socket.user.id);

      if (userSockets) {
        userSockets.delete(socket.id);

        if (userSockets.size === 0) {
          onlineUsers.delete(socket.user.id);
        }
      }

      emitOnlineUsers(io);
    });
  });
};

module.exports = registerChatSocket;
