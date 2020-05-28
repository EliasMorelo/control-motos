(function() {
  var streaming = false,
      video        = document.querySelector('#video'),
      canvas       = document.querySelector('#canvas'),
      photo        = document.querySelector('#photo'),
      startbutton  = document.querySelector('#startbutton'),
      restetbutton = document.querySelector('#restetbutton'),
      texto = document.querySelector('#texto'),
      height = 0;
  navigator.getMedia = ( navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia ||
                         navigator.msGetUserMedia);

var front = false;
document.getElementById('flip-button').onclick = function() { front = !front; };
var constraints = {video : { facingMode: (front? "user" : "environment")}};

  var p = navigator.mediaDevices.getUserMedia(constraints);
    p.then(function(stream) {
      if (navigator.mozGetUserMedia) {
        video.mozSrcObject = stream;
      } else {
        var vendorURL = window.URL || window.webkitURL;
        video.srcObject = stream;
      }
      video.play();
    });
    p.catch(    function(err) {
      console.log("An error occured! " + err);
    });



  video.addEventListener('canplay', function(ev){
    if (!streaming) {
      canvas.width =  video.videoWidth;
      canvas.height = video.videoHeight;
      streaming = true;
    }
  }, false);
  
  function takepicture() {
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    var data = canvas.toDataURL('image/png');
    texto.setAttribute('value', data);
  }
  startbutton.addEventListener('click', function(ev){
    video.pause();
    takepicture();
    ev.preventDefault();
  }, false);
  restetbutton.addEventListener('click', function(ev){video.play();
    takepicture();
  ev.preventDefault();
  },false);
})();