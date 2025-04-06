// grab out DOM element
const myVideoContainer = document.getElementById("myVideoContainer");
const myVideoElement = document.getElementById("myVideo");

myVideoContainer.addEventListener("click", () => {
  navigator.mediaDevices.getUserMedia({
    video: true
  }).then(stream => {
      myVideoElement.srcObject = stream; // set autoplay in the html
    }).catch( err => {
      console.log("An error occurred trying to get user video stream", err);
      
    })
})

function getVideoIDs(){
  navigator.mediaDevices.enumerateDevices()
    .then(devicesArray => {
      devicesArray.forEach(devices => {
        console.log(devices.kind + ": " + devices.label + " id = " + devices.deviceId);

      })
    })
  
}