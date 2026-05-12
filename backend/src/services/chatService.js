const prisma = require("../../prisma/client");

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
};

const normalizePair = (firstUserId, secondUserId) => {
  const ids = [Number(firstUserId), Number(secondUserId)].sort((a, b) => a - b);
  return {
    participantOneId: ids[0],
    participantTwoId: ids[1],
  };
};

const getOtherParticipant = (conversation, userId) => {
  return conversation.participantOneId === userId
    ? conversation.participantTwo
    : conversation.participantOne;
};

const getConversationTypeForUsers = async (currentUser, otherUserId) => {
  const otherUser = await prisma.user.findUnique({
    where: {
      id: Number(otherUserId),
    },
    select: userSelect,
  });

  if (!otherUser || currentUser.id === otherUser.id) {
    return null;
  }

  if (currentUser.role === "DOCTOR" && otherUser.role === "DOCTOR") {
    return "DOCTOR_DOCTOR";
  }

  const doctorId =
    currentUser.role === "DOCTOR"
      ? currentUser.id
      : otherUser.role === "DOCTOR"
        ? otherUser.id
        : null;

  const patientUserId =
    currentUser.role === "PATIENT"
      ? currentUser.id
      : otherUser.role === "PATIENT"
        ? otherUser.id
        : null;

  if (!doctorId || !patientUserId) {
    return null;
  }

  const patient = await prisma.patient.findUnique({
    where: {
      userId: patientUserId,
    },
    select: {
      doctorId: true,
    },
  });

  if (patient?.doctorId !== doctorId) {
    return null;
  }

  return "DOCTOR_PATIENT";
};

const canAccessConversation = (conversation, userId) => {
  return (
    conversation.participantOneId === userId ||
    conversation.participantTwoId === userId
  );
};

const findConversationForUser = async (conversationId, userId) => {
  const conversation = await prisma.conversation.findUnique({
    where: {
      id: Number(conversationId),
    },
    include: {
      participantOne: {
        select: userSelect,
      },
      participantTwo: {
        select: userSelect,
      },
    },
  });

  if (!conversation || !canAccessConversation(conversation, userId)) {
    return null;
  }

  return conversation;
};

const createOrGetConversation = async (currentUser, otherUserId) => {
  const type = await getConversationTypeForUsers(currentUser, otherUserId);

  if (!type) {
    return null;
  }

  const pair = normalizePair(currentUser.id, otherUserId);

  return prisma.conversation.upsert({
    where: {
      participantOneId_participantTwoId: pair,
    },
    update: {},
    create: {
      ...pair,
      type,
    },
    include: {
      participantOne: {
        select: userSelect,
      },
      participantTwo: {
        select: userSelect,
      },
    },
  });
};

const listConversations = async (userId) => {
  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [
        {
          participantOneId: userId,
        },
        {
          participantTwoId: userId,
        },
      ],
    },
    include: {
      participantOne: {
        select: userSelect,
      },
      participantTwo: {
        select: userSelect,
      },
      messages: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        include: {
          sender: {
            select: userSelect,
          },
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const unreadCounts = await prisma.message.groupBy({
    by: ["conversationId"],
    where: {
      conversationId: {
        in: conversations.map((conversation) => conversation.id),
      },
      senderId: {
        not: userId,
      },
      isRead: false,
    },
    _count: {
      id: true,
    },
  });

  const unreadByConversation = new Map(
    unreadCounts.map((item) => [item.conversationId, item._count.id])
  );

  return conversations.map((conversation) => ({
    id: conversation.id,
    type: conversation.type,
    otherParticipant: getOtherParticipant(conversation, userId),
    lastMessage: conversation.messages[0] || null,
    unreadCount: unreadByConversation.get(conversation.id) || 0,
    updatedAt: conversation.updatedAt,
  }));
};

const createMessage = async (conversationId, senderId, text) => {
  const message = await prisma.message.create({
    data: {
      conversationId: Number(conversationId),
      senderId,
      text: text.trim(),
    },
    include: {
      sender: {
        select: userSelect,
      },
      conversation: {
        include: {
          participantOne: {
            select: userSelect,
          },
          participantTwo: {
            select: userSelect,
          },
        },
      },
    },
  });

  await prisma.conversation.update({
    where: {
      id: Number(conversationId),
    },
    data: {
      updatedAt: new Date(),
    },
  });

  return message;
};

const getMessages = async (conversationId, userId) => {
  const conversation = await findConversationForUser(conversationId, userId);

  if (!conversation) {
    return null;
  }

  const messages = await prisma.message.findMany({
    where: {
      conversationId: conversation.id,
    },
    include: {
      sender: {
        select: userSelect,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return {
    conversation,
    messages,
  };
};

const markConversationAsRead = async (conversationId, userId) => {
  const conversation = await findConversationForUser(conversationId, userId);

  if (!conversation) {
    return null;
  }

  await prisma.message.updateMany({
    where: {
      conversationId: conversation.id,
      senderId: {
        not: userId,
      },
      isRead: false,
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });

  return conversation;
};

module.exports = {
  createMessage,
  createOrGetConversation,
  findConversationForUser,
  getMessages,
  getOtherParticipant,
  listConversations,
  markConversationAsRead,
  userSelect,
};
