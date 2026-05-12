import { useCallback, useEffect, useMemo, useState } from "react";

import API from "../services/api.js";
import socket, { connectSocket } from "../services/socket.js";
import { getCurrentUserFromToken } from "../utils/auth.js";

function useChat() {
  const currentUser = useMemo(() => getCurrentUserFromToken(), []);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUserId, setTypingUserId] = useState(null);
  const [lockedMessage, setLockedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState("");

  const totalUnread = conversations.reduce(
    (sum, conversation) => sum + (conversation.unreadCount || 0),
    0
  );

  const fetchConversations = useCallback(async () => {
    const res = await API.get("/chat/conversations");
    setConversations(res.data.conversations);
    return res.data.conversations;
  }, []);

  const loadChatBootstrap = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [usersRes, conversationsRes] = await Promise.all([
        API.get("/chat/users"),
        API.get("/chat/conversations"),
      ]);

      setAvailableUsers(usersRes.data.users);
      setLockedMessage(usersRes.data.lockedMessage);
      setConversations(conversationsRes.data.conversations);
    } catch (err) {
      console.log(err);
      setError("Unable to load secure chat right now.");
    } finally {
      setLoading(false);
    }
  }, []);

  const openConversation = useCallback(async (conversation) => {
    if (!conversation) {
      setActiveConversation(null);
      setMessages([]);
      return;
    }

    try {
      setMessagesLoading(true);
      setError("");
      setActiveConversation(conversation);

      socket.emit("joinChat", {
        conversationId: conversation.id,
      });

      const res = await API.get(
        `/chat/conversations/${conversation.id}/messages`
      );

      setMessages(res.data.messages);
      socket.emit("markAsRead", {
        conversationId: conversation.id,
      });
      API.patch(`/chat/conversations/${conversation.id}/read`).catch(() => {});
      setConversations((items) =>
        items.map((item) =>
          item.id === conversation.id ? { ...item, unreadCount: 0 } : item
        )
      );
    } catch (err) {
      console.log(err);
      setError("Unable to open this conversation.");
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  const startConversation = useCallback(
    async (receiverId) => {
      try {
        setError("");
        const res = await API.post("/chat/conversations", {
          receiverId,
        });
        const conversation = res.data.conversation;
        await fetchConversations();
        await openConversation(conversation);
      } catch (err) {
        console.log(err);
        setError("This conversation is not available for your care role.");
      }
    },
    [fetchConversations, openConversation]
  );

  const sendMessage = useCallback(
    (text) => {
      if (!activeConversation || !text.trim()) {
        return;
      }

      socket.emit(
        "sendMessage",
        {
          conversationId: activeConversation.id,
          text,
        },
        (response) => {
          if (!response?.success) {
            setError(response?.message || "Unable to send message.");
          }
        }
      );
    },
    [activeConversation]
  );

  const sendTyping = useCallback(() => {
    if (activeConversation) {
      socket.emit("typing", {
        conversationId: activeConversation.id,
      });
    }
  }, [activeConversation]);

  const sendStopTyping = useCallback(() => {
    if (activeConversation) {
      socket.emit("stopTyping", {
        conversationId: activeConversation.id,
      });
    }
  }, [activeConversation]);

  useEffect(() => {
    connectSocket();
    loadChatBootstrap();

    const handleMessage = ({ conversationId, message }) => {
      setConversations((items) =>
        items.map((item) =>
          item.id === conversationId
            ? {
                ...item,
                lastMessage: message,
                unreadCount:
                  activeConversation?.id === conversationId ||
                  message.senderId === currentUser?.id
                    ? 0
                    : (item.unreadCount || 0) + 1,
                updatedAt: message.createdAt,
              }
            : item
        )
      );

      if (activeConversation?.id === conversationId) {
        setMessages((items) =>
          items.some((item) => item.id === message.id)
            ? items
            : [...items, message]
        );
        socket.emit("markAsRead", {
          conversationId,
        });
      }
    };

    const handleTyping = ({ conversationId, userId }) => {
      if (activeConversation?.id === conversationId) {
        setTypingUserId(userId);
      }
    };

    const handleStopTyping = ({ conversationId }) => {
      if (activeConversation?.id === conversationId) {
        setTypingUserId(null);
      }
    };

    socket.on("receiveMessage", handleMessage);
    socket.on("chatUpdated", fetchConversations);
    socket.on("onlineUsers", setOnlineUsers);
    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("receiveMessage", handleMessage);
      socket.off("chatUpdated", fetchConversations);
      socket.off("onlineUsers", setOnlineUsers);
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
    };
  }, [
    activeConversation,
    currentUser,
    fetchConversations,
    loadChatBootstrap,
  ]);

  return {
    activeConversation,
    availableUsers,
    conversations,
    currentUser,
    error,
    loading,
    lockedMessage,
    messages,
    messagesLoading,
    onlineUsers,
    openConversation,
    refreshConversations: fetchConversations,
    sendMessage,
    sendStopTyping,
    sendTyping,
    startConversation,
    totalUnread,
    typingUserId,
  };
}

export default useChat;
