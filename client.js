const net = require("net");
const readline = require("readline");
const rl = readline.createInterface(process.stdin, process.stdout);
const options = {
  port: 9090,
  host: "localhost",
};
let nickname;
rl.question("Enter nickname: ", (nick) => {
  nickname = nick;
  const client = net.createConnection(options, () => {
    data = {
      type: "join",
      value: nickname,
    };
    client.write(JSON.stringify(data));
  });
  rl.on("line", (line) => {
    if (line[0] === "/" && Number.isInteger(parseInt(line.split("/")[1]))) {
      console.log("channel change");
      data = {
        type: "channel",
        value: parseInt(line.split("/")[1]),
      };
      client.write(JSON.stringify(data));
    } else if (line === "/quit") {
      data = {
        type: "quit",
      };
      client.write(JSON.stringify(data));
      client.end();
      rl.close();
    } else if (line[0] === "/") {
      data = {
        type: "private",
        receiver: line.split("/")[1].split(" ")[0],
        msg: line.split(" ")[1],
      };
      client.write(JSON.stringify(data));
    } else {
      data = {
        type: "broadcast",
        value: line,
      };
      client.write(JSON.stringify(data));
    }
  });
  client.on("data", (data) => {
    console.log(data.toString());
  });
});
