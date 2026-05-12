const prisma = require("../../prisma/client");
const {
  createMessage,
  createOrGetConversation,
  findConversationForUser,
  getMessages,
  listConversations,
  markConversationAsRead,
  userSelect,
} = require("../services/chatService");

const getAvailableChatUsers = async (req, res) => {
  try {
    if (req.user.role === "PATIENT") {
      const patient = await prisma.patient.findUnique({
        where: {
          userId: req.user.id,
        },
        include: {
          doctor: {
            select: userSelect,
          },
        },
      });

      return res.status(200).json({
        success: true,
        users: patient?.doctor ? [patient.doctor] : [],
        lockedMessage: patient?.doctor
          ? null
          : "Assign a doctor to start secure healthcare communication.",
      });
    }

    const assignedPatients = await prisma.patient.findMany({
      where: {
        doctorId: req.user.id,
      },
      include: {
        user: {
          select: userSelect,
        },
      },
      orderBy: {
        user: {
          name: "asc",
        },
      },
    });

    const doctors = await prisma.user.findMany({
      where: {
        role: "DOCTOR",
        id: {
          not: req.user.id,
        },
      },
      select: userSelect,
      orderBy: {
        name: "asc",
      },
    });

    res.status(200).json({
      success: true,
      users: [
        ...assignedPatients.map((patient) => patient.user),
        ...doctors,
      ],
      lockedMessage: null,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getChatList = async (req, res) => {
  try {
    const conversations = await listConversations(req.user.id);

    res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const createConversation = async (req, res) => {
  try {
    const { receiverId } = req.body;

    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: "Receiver is required",
      });
    }

    const conversation = await createOrGetConversation(req.user, receiverId);

    if (!conversation) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to start this conversation",
      });
    }

    res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const fetchMessages = async (req, res) => {
  try {
    const result = await getMessages(req.params.conversationId, req.user.id);

    if (!result) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this conversation",
      });
    }

    res.status(200).json({
      success: true,
      conversation: result.conversation,
      messages: result.messages,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message text is required",
      });
    }

    const conversation = await findConversationForUser(
      req.params.conversationId,
      req.user.id
    );

    if (!conversation) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to message this conversation",
      });
    }

    const message = await createMessage(conversation.id, req.user.id, text);

    global.io?.to(`conversation:${conversation.id}`).emit("receiveMessage", {
      conversationId: conversation.id,
      message,
    });
    global.io?.to(`user:${conversation.participantOneId}`).emit("chatUpdated");
    global.io?.to(`user:${conversation.participantTwoId}`).emit("chatUpdated");

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const markAsRead = async (req, res) => {
  try {
    const conversation = await markConversationAsRead(
      req.params.conversationId,
      req.user.id
    );

    if (!conversation) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this conversation",
      });
    }

    global.io?.to(`conversation:${conversation.id}`).emit("messagesRead", {
      conversationId: conversation.id,
      readerId: req.user.id,
    });
    global.io?.to(`user:${req.user.id}`).emit("chatUpdated");

    res.status(200).json({
      success: true,
      message: "Messages marked as read",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createConversation,
  fetchMessages,
  getAvailableChatUsers,
  getChatList,
  markAsRead,
  sendMessage,
};
