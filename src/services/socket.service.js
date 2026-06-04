import { io } from "socket.io-client";
import { SOCKET_URL } from "../config/apiConfig";

const socket = io(SOCKET_URL, {
  autoConnect: false,
});

export const connectSocket = (userId) => {
  if (!socket.connected) {
    socket.connect();
    socket.emit("join", userId);
  }
};

export const onNewNotification = (callback) => {
  socket.off("new-notification");
  socket.on("new-notification", callback);
};

export const onFollowUpdate = (callback) => {
  socket.off("follow-updated");
  socket.on("follow-updated", callback);
};

export default socket;
