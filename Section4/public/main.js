import { initializeUi, DOM, logToCustomConsole } from "./modules/uiUtils.js";
import * as ws from "./modules/ws.js";
import { createRoom } from "./modules/ajax.js";

// Generate unique user code for every user that visit the page
const userId = Math.round(Math.random() * 1000000);

// initialize the DOM

initializeUi(userId);

// establish a ws connection
const wsClientConnection = new WebSocket(`/?userId=${userId}`);

// pass all of our websocket logic to another module
ws.registerSocketEvents(wsClientConnection);

// create room
DOM.createRoomButton.addEventListener("click", () => {
  const roomName = DOM.inputRoomNameElement.value;
  if (!roomName) {
    return alert("Your room name needs a name");
  }
  logToCustomConsole(
    "ws-server is checking whether room " +
      roomName +
      " is available...Pls wait"
  );
  createRoom(roomName, userId);
});
