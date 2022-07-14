// Importing the required modules
const WebSocketServer = require("ws");
const fs = require("fs");

const locationData = JSON.parse(
  fs.readFileSync("./static/mock-data/res_self_data.json", "utf-8")
);

const freq = (hz) => 1000 / hz;

// Creating a new websocket server
const wss = new WebSocketServer.Server({ port: 12321 });

// Creating connection using websocket
wss.on("connection", (ws) => {
  let timer;
  console.log("new client connected");
  // sending message
  ws.on("message", (data) => {
    console.log(`Client has sent us: ${JSON.parse(data)["event"]}`);
    switch (JSON.parse(data)["event"]) {
      case "getData": {
        let counter = 0;
        //   Sending data to client
        timer = setInterval(() => {
          if (counter === locationData.length) return clearInterval(timer);
          ws.send(
            JSON.stringify({
              event: "position-data",
              //defaulted id to 0
              data:
                counter === locationData.length
                  ? null
                  : { ...locationData[counter], id: 0 },
            })
          );
          counter++;
        }, freq(5));
        break;
      }
      case "stop": {
        clearInterval(timer);
        break;
      }
      default: {
        console.log(JSON.parse(data)["event"] === "getData");
      }
    }
  });
  // handling what to do when clients disconnects from server
  ws.on("close", () => {
    console.log("the client has connected");
    clearInterval(timer);
  });
  // handling client connection error
  ws.onerror = function () {
    console.log("Some Error occurred");
    clearInterval(timer);
  };
});

console.log("The WebSocket server is running on port 12321");
