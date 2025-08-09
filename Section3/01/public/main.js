import * as uiUtils from "./modules/uiUtils.js";

// Generate unique user code for every user that visit the page
const userId = Math.round(Math.random() * 1000000);

// initialize the DOM

uiUtils.initializeUi(userId);
