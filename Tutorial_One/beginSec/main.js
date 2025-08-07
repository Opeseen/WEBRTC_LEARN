// grab out DOM element
const myVideoContainer = document.getElementById("myVideoContainer");
const myVideoElement = document.getElementById("myVideo");

let pc = null; // so we can access the pc object in the dev console

myVideoContainer.addEventListener("click", initiateWebRTC)

async function initiateWebRTC(){
  try {
    let localStream = await navigator.mediaDevices.getUserMedia({
      video: true
    });
    myVideoElement.srcObject = localStream; // set autoplay in the html
    // implementing webRTC
    pc = new RTCPeerConnection();
    // add an event listener, to indicate when we should start the signaling process
    pc.addEventListener("negotiationneeded", handleNegotiationNeededEvent);
    // add the type of media / data we wish to send and receive
    const tracks = localStream.getTracks();
    tracks.forEach(track => {
      pc.addTrack(track);
      console.log("track was added to pc object");
    });
    // getting stats related to our media track added to out pc
    let stats = await pc.getStats();
    stats.forEach(report => {
      console.log(report);
    });
    // listen for ice candidate gathered
    pc.addEventListener("icecandidate", (eventObject) => {
      console.log("ICE RECEIVED:", eventObject.candidate);
    });

  } catch (error) {
    console.log(error);
  };
};

// define our negotiation function
async function handleNegotiationNeededEvent(){
  const offer = await pc.createOffer();
  console.log("offer created", offer); 
  // add our offer to our pc object
  await pc.setLocalDescription(offer);
};

function getVideoIDs(){
  navigator.mediaDevices.enumerateDevices()
    .then(devicesArray => {
      devicesArray.forEach(devices => {
        console.log(devices.kind + ": " + devices.label + " id = " + devices.deviceId);

      })
    })
  
}