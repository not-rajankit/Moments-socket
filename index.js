const io = require("socket.io")(8900, {
  cors: {
    // origin: "http://localhost:3000",
    origin: "https://moments-frontend-sepia.vercel.app",
  },
});
let users = [];
const addUser = (userId, socketId) => {
  // console.log(socketId);
  const prevUser = users.find((u) => u.userId === userId);
  // console.log(prevUser);
  if (!prevUser) {
    users = [...users, { userId, socketId }];
    // console.log(users);
  }
};
const getUser = (userId) => {
  // console.log(users);
  const res = users.find((u) => u.userId === userId);
  // console.log(res);
  return res;
};
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

io.on("connection", (socket) => {
  //when connect
  console.log("a user connected!");

  //take userId and socketId
  socket.on("addUser", (userId) => {
    // console.log(userId);
    addUser(userId, socket.id);
    io.emit("getUser", users);
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    // console.log(user);
    io.to(user.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUser", users);
  });
});
