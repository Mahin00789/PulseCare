import { useEffect, useMemo, useRef, useState } from "react";
import {
  LockKeyhole,
  MessageCircle,
  Send,
  ShieldCheck,
  Stethoscope,
  UserRound,
  UsersRound,
} from "lucide-react";

import useChat from "../../hooks/useChat.js";

const formatTime = (value) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

const formatDate = (value) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

function ChatPanel({ chat, role = "PATIENT", compact = false }) {
  const internalChat = useChat();
  const {
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
    sendMessage,
    sendStopTyping,
    sendTyping,
    startConversation,
    typingUserId,
  } = chat || internalChat;
  const [draft, setDraft] = useState("");
  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const selectedUserIds = useMemo(
    () =>
      new Set(
        conversations.map(
          (conversation) => conversation.otherParticipant?.id
        )
      ),
    [conversations]
  );

  const newChatUsers = availableUsers.filter(
    (user) => !selectedUserIds.has(user.id)
  );
  const activeParticipant = activeConversation?.otherParticipant;
  const isLocked = role === "PATIENT" && lockedMessage;
  const isOnline =
    activeParticipant && onlineUsers.includes(activeParticipant.id);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeConversation]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!draft.trim()) {
      return;
    }

    sendMessage(draft);
    setDraft("");
    sendStopTyping();
  };

  const handleDraftChange = (event) => {
    setDraft(event.target.value);
    sendTyping();

    window.clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = window.setTimeout(sendStopTyping, 900);
  };

  return (
    <section className="rounded-2xl bg-[#f8fbff] p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-100">
              <MessageCircle size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Secure Care Chat
              </h2>
              <p className="text-xs font-medium text-slate-400">
                Realtime healthcare communication
              </p>
            </div>
          </div>
        </div>

        <span className="inline-flex w-fit items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
          <ShieldCheck size={14} />
          Protected
        </span>
      </div>

      {isLocked ? (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-blue-100 bg-white p-6 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
            <LockKeyhole size={24} />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            Chat is locked
          </h3>
          <p className="mt-2 max-w-sm text-sm font-medium leading-6 text-slate-500">
            {lockedMessage}
          </p>
        </div>
      ) : (
        <div
          className={`grid gap-4 ${
            compact ? "xl:grid-cols-[0.42fr_0.58fr]" : "xl:grid-cols-[0.34fr_0.66fr]"
          }`}
        >
          <aside className="min-h-96 rounded-2xl bg-white p-3 shadow-sm">
            <div className="mb-3 flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase text-slate-400">
                Conversations
              </span>
              <span className="rounded-lg bg-blue-50 px-2 py-1 text-[11px] font-bold text-blue-700">
                {conversations.length}
              </span>
            </div>

            {loading ? (
              <div className="rounded-xl bg-blue-50 p-4 text-xs font-bold text-blue-700">
                Loading secure chats...
              </div>
            ) : conversations.length === 0 ? (
              <div className="rounded-xl bg-blue-50 p-4 text-xs font-bold leading-5 text-blue-700">
                No conversations yet. Select an available care contact below.
              </div>
            ) : (
              <div className="space-y-2">
                {conversations.map((conversation) => {
                  const person = conversation.otherParticipant;
                  const online = onlineUsers.includes(person?.id);

                  return (
                    <button
                      className={`w-full rounded-xl p-3 text-left transition ${
                        activeConversation?.id === conversation.id
                          ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                          : "bg-[#f8fbff] text-slate-700 hover:bg-blue-50"
                      }`}
                      key={conversation.id}
                      onClick={() => openConversation(conversation)}
                      type="button"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/80 text-blue-700">
                          {person?.role === "DOCTOR" ? (
                            <Stethoscope size={18} />
                          ) : (
                            <UserRound size={18} />
                          )}
                          <span
                            className={`absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white ${
                              online ? "bg-emerald-400" : "bg-slate-300"
                            }`}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-xs font-bold">
                              {person?.name}
                            </p>
                            {conversation.unreadCount > 0 && (
                              <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="mt-1 truncate text-[11px] font-medium opacity-75">
                            {conversation.lastMessage?.text || "Secure thread"}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {newChatUsers.length > 0 && (
              <div className="mt-4 border-t border-blue-50 pt-4">
                <p className="mb-2 px-1 text-xs font-bold uppercase text-slate-400">
                  Start Chat
                </p>
                <div className="space-y-2">
                  {newChatUsers.map((user) => (
                    <button
                      className="flex w-full items-center gap-3 rounded-xl bg-[#f8fbff] p-3 text-left text-xs font-bold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
                      key={user.id}
                      onClick={() => startConversation(user.id)}
                      type="button"
                    >
                      <UsersRound size={16} />
                      <span className="truncate">{user.name}</span>
                      <span className="ml-auto text-[10px] text-slate-400">
                        {user.role}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>

          <div className="flex min-h-96 flex-col rounded-2xl bg-white shadow-sm">
            {activeConversation ? (
              <>
                <div className="flex items-center justify-between border-b border-blue-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                      {activeParticipant?.role === "DOCTOR" ? (
                        <Stethoscope size={19} />
                      ) : (
                        <UserRound size={19} />
                      )}
                      <span
                        className={`absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white ${
                          isOnline ? "bg-emerald-400" : "bg-slate-300"
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {activeParticipant?.name}
                      </h3>
                      <p className="text-xs font-medium text-slate-400">
                        {typingUserId
                          ? "Typing..."
                          : isOnline
                            ? "Online"
                            : "Offline"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto p-4">
                  {messagesLoading ? (
                    <div className="rounded-xl bg-blue-50 p-4 text-xs font-bold text-blue-700">
                      Loading messages...
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex h-full min-h-56 items-center justify-center rounded-2xl border border-dashed border-blue-100 p-6 text-center">
                      <p className="max-w-xs text-sm font-medium leading-6 text-slate-500">
                        Start this secure care conversation with a clear update.
                      </p>
                    </div>
                  ) : (
                    messages.map((message, index) => {
                      const own = message.senderId === currentUser?.id;
                      const previous = messages[index - 1];
                      const showDate =
                        !previous ||
                        formatDate(previous.createdAt) !==
                          formatDate(message.createdAt);

                      return (
                        <div key={message.id}>
                          {showDate && (
                            <div className="my-4 text-center text-[11px] font-bold text-slate-300">
                              {formatDate(message.createdAt)}
                            </div>
                          )}
                          <div
                            className={`flex ${
                              own ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm font-medium leading-6 shadow-sm ${
                                own
                                  ? "rounded-br-md bg-blue-600 text-white"
                                  : "rounded-bl-md bg-[#f8fbff] text-slate-700"
                              }`}
                            >
                              <p>{message.text}</p>
                              <p
                                className={`mt-1 text-[10px] font-bold ${
                                  own ? "text-blue-100" : "text-slate-300"
                                }`}
                              >
                                {formatTime(message.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={bottomRef} />
                </div>

                <form
                  className="flex gap-2 border-t border-blue-50 p-3"
                  onSubmit={handleSubmit}
                >
                  <input
                    className="min-w-0 flex-1 rounded-xl border border-blue-50 bg-[#f8fbff] px-4 py-3 text-sm font-medium outline-none transition placeholder:text-slate-300 focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-50"
                    onBlur={sendStopTyping}
                    onChange={handleDraftChange}
                    placeholder="Type a secure message"
                    value={draft}
                  />
                  <button
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-100 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    disabled={!draft.trim()}
                    type="submit"
                  >
                    <Send size={18} />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <MessageCircle size={24} />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Select a conversation
                </h3>
                <p className="mt-2 max-w-sm text-sm font-medium leading-6 text-slate-500">
                  Choose a recent chat or start a new authorized care conversation.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-xs font-bold text-rose-600">
          {error}
        </div>
      )}
    </section>
  );
}

export default ChatPanel;
