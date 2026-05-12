import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  auth: {
    token: localStorage.getItem("token"),
  },
  autoConnect: false,
  transports: ["websocket"],
});

export const connectSocket = () => {
  socket.auth = {
    token: localStorage.getItem("token"),
  };

  if (!socket.connected) {
    socket.connect();
  }
};

export default socket;
