const net = require("net");
let connections = [];

const server = net.createServer((conn) => {
  console.log(
    "new client joined: " + conn.remoteAddress + ":" + conn.remotePort
  );

  conn.on("data", (data) => {
    data = JSON.parse(data);
    switch (data.type) {
      case "join":
        conn.write("welcome " + data.value + "\n");
        conn.nickname = data.value;
        conn.channel = 1;
        connections.push(conn);
        break;
      case "broadcast":
        send(
          conn.nickname,
          conn.channel,
          data.value + " (" + conn.channel + ")"
        );
        break;
      case "private":
        send(conn.nickname, data.receiver, data.msg + " (private)");
        break;
      case "quit":
        removeSocket(conn);
        break;
      case "channel":
        conn.channel = data.value;
        break;
      default:
        break;
    }
  });

  conn.on("end", () => {
    console.log("client left");
  });
});

const send = (from, to, msg) => {
  connections.forEach((conn) => {
    if (conn.nickname === to || conn.channel === to) {
      conn.write(from + ": " + msg);
    }
  });
};

const removeSocket = (socket) => {
  connections.forEach((conn, index) => {
    if (conn.nickname === socket.nickname) {
      connections.splice(index, 1);
    }
  });
};

server.listen(9090);
