import { io } from "socket.io-client";
import { SOCKET_URL } from "../config/apiConfig";

const socket = io(SOCKET_URL, {
  autoConnect: false,
});

export const connectSocket = (userId) => {
  if (!socket.connected) {
    socket.connect();
    // Only emit "join" if userId is provided (for authenticated users)
    if (userId) {
      socket.emit("join", userId);
    }
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

// ✅ NEW - Listen for story published events for category filtering
export const onStoryPublished = (callback) => {
  socket.off("story-published");
  socket.on("story-published", callback);
};

export default socket;
