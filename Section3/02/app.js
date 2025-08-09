import http from "http";
import express from "express";
import { WebSocketServer } from "ws";

// define global variables
const connections = [
  // will contain objects containing{ws_connection, userId}
];

// define a port for live and testing environment;
const PORT = process.env.PORT || 8080;

// initialize the express application
const app = express();
app.use(express.static("public"));
// create an http server and pass our express application to our server
const server = http.createServer(app);

// server static html file
app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/public/index.html");
});

// websocket server setup
//  mount our ws server onto our http server
const ws = new WebSocketServer({ server });

// define a function thats called when a new connection is established
ws.on("connection", (ws, req) => handleConnection(ws, req));

function handleConnection(ws, req) {
  const userId = extractUserId(req);
  console.log(`User: ${userId} connected to ws server`);
  // update our connections array
  addConnection(ws, userId);

  // register all 3 event listener
  ws.on("message", (data) => handleMessage(data));
  ws.on("close", (data) => handleDisconnection(data));
  ws.on("error", () => console.log("A ws error has occurred"));
}

function addConnection(ws, userId) {
  connections.push({
    wsConnection: ws,
    userId,
  });
  console.log("Total connected users: " + connections.length);
}

function extractUserId(req) {
  const queryParam = new URLSearchParams(req.url.split("?")[1]);
  return Number(queryParam.get("userId"));
}

// spin up server
server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
