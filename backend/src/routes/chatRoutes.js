const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const {
  createConversation,
  fetchMessages,
  getAvailableChatUsers,
  getChatList,
  markAsRead,
  sendMessage,
} = require("../controllers/chatController");

router.use(protect);

router.get("/users", getAvailableChatUsers);
router.get("/conversations", getChatList);
router.post("/conversations", createConversation);
router.get("/conversations/:conversationId/messages", fetchMessages);
router.post("/conversations/:conversationId/messages", sendMessage);
router.patch("/conversations/:conversationId/read", markAsRead);

module.exports = router;
