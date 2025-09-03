import * as uiUtils from "./uiUtils.js";
import * as constants from "./constants.js";
import * as state from "./state.js";

// create a new room using thr fetch APi
export function createRoom(roomName, userId) {
  fetch("/create-room", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ roomName, userId }),
  })
    .then((response) => response.json())
    .then((resObj) => {
      if (resObj.data.type === constants.type.ROOM_CHECK.RESPONSE_SUCCESS) {
        state.setRoomName(roomName);
        uiUtils.logToCustomConsole("Room Created", constants.myColors.green);
        uiUtils.logToCustomConsole("Waiting for other peer");
        uiUtils.creatorToProceedToRoom();
      }
      if (resObj.data.type === constants.type.ROOM_CHECK.RESPONSE_FAILURE) {
        uiUtils.logToCustomConsole(
          "Room not available. Choose another name,",
          constants.myColors.red
        );
      }
    })
    .catch((err) => {
      console.log("An error occurred creating the room", err);
      uiUtils.logToCustomConsole(
        "Some sort of error  occurred trying to create a room. Sorry!",
        constants.myColors.red
      );
    });
}
