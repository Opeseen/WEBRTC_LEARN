import * as state from "./state.js";
import * as uiUtils from "./uiUtils.js";
import * as constants from "./constants.js";

// Event listeners that the browsers websocket object gives us
export function registerSocketEvents(wsClientConnection) {
  // update our user state with this wsClientObject
  state.setWsConnection(wsClientConnection);
  // listen for those 4 events
  wsClientConnection.onopen = () => {
    // tell the user that they have connected with our own ws server
    uiUtils.logToCustomConsole("You have connected to our websocket server");

    // register the remaining 3 events
    wsClientConnection.onmessage = handleMessage;
    wsClientConnection.onclose = handleClose;
    wsClientConnection.onerror = handleError;
  };
}

function handleMessage(message) {
  console.log(message);
}

function handleClose() {
  uiUtils.logToCustomConsole(
    "You have been disconnected from our ws server",
    null,
    true,
    constants.myColors.red
  );
}

function handleError() {
  uiUtils.logToCustomConsole("An error was thrown", constants.myColors.red);
}
