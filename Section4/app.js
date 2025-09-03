import http from "http";
import express from "express";
import { WebSocketServer } from "ws";
import * as constants from "./constants.js";

// define global variables
const connections = [
  // will contain objects containing {ws_connection, userId}
];

// define state or our rooms
const rooms = [
  // will contain objects containing {roomName, peer1, peer2}
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

// room creation via a POST request
app.post("/create-room", (req, res) => {
  // parse the body of the incoming request
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    // extract variables from our body
    const { roomName, userId } = JSON.parse(body);
    // check if room already exists
    const existingRoom = rooms.find((room) => {
      return room.roomName === roomName;
    });
    if (existingRoom) {
      // a room of this name exists, and we need to send back a failure message back to the client
      const failureMessage = {
        data: {
          type: constants.type.ROOM_CHECK.RESPONSE_FAILURE,
          message:
            "That room has already been created. Try another name, or JOIN",
        },
      };
      res.status(400).json(failureMessage);
    } else {
      // the room does not already exist, so we have to add it to the rooms array
      rooms.push({
        roomName,
        peer1: userId,
        peer2: null,
      });
      // send a success message back to the client
      const successMessage = {
        data: {
          type: constants.type.ROOM_CHECK.RESPONSE_SUCCESS,
        },
      };
      res.status(200).json(successMessage);
    }
  });
}); // end CREATE Room

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
  ws.on("close", () => handleDisconnection(userId));
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

function handleDisconnection(userId) {
  // find the index of the connection associated with the userID
  const connectionIndex = connections.findIndex(
    (conn) => conn.userId === userId
  );
  if (connectionIndex === -1) {
    console.log(`User: ${userId} not found in connections`);
    return;
  }
  // Remove the user connections from the active connections array
  connections.splice(connectionIndex, 1);
  // provide feedback
  console.log(`User: ${userId} removed from connections`);
  console.log(`Total connected users: ${connections.length}`);
}

function handleMessage(data) {
  try {
  } catch (error) {
    console.log("Failed to parse message: ", error);
    return;
  }
}

// spin up server
server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
