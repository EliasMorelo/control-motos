(function() {
    var streaming_dos = false,
    video_dos = document.querySelector("#video-dos"),
    canvas_dos = document.querySelector("#canvas-dos"),
    startbutton_dos  = document.querySelector("#startbutton-dos"),
    restetbutton_dos  = document.querySelector("#restetbutton-dos"),
    texto_dos  = document.querySelector('#texto-dos'),
    height = 0;
    navigator.getMedia = ( navigator.getUserMedia ||
                           navigator.webkitGetUserMedia ||
                           navigator.mozGetUserMedia ||
                           navigator.msGetUserMedia);
  
  var front_dos = false;
  document.getElementById('flip-button').onclick = function() { front_dos = !front_dos; };
  var constraints_dos = {video : { facingMode: (front_dos? "user" : "environment")}};
  
    var m = navigator.mediaDevices.getUserMedia(constraints_dos);
      m.then(function(stream_dos) {
        if (navigator.mozGetUserMedia) {
          video_dos.mozSrcObject = stream_dos;
        } else {
          var vendorURL = window.URL || window.webkitURL;
          video_dos.srcObject = stream_dos;
        }
        video_dos.play();
      });
      m.catch(    function(err) {
        console.log("An error occured! " + err);
      });
  
  
  
    video_dos.addEventListener('canplay', function(ev){
      if (!streaming_dos) {
        canvas_dos.width =  video_dos.videoWidth;
        canvas_dos.height = video_dos.videoHeight;
        streaming_dos= true;
      }
    }, false);
    
    function takepictureDos() {
      canvas_dos.getContext('2d').drawImage(video_dos, 0, 0, canvas_dos.width, canvas_dos.height);
      var data_dos  = canvas_dos.toDataURL('image/png');
      texto_dos.setAttribute('value', data_dos);
    }
    startbutton_dos.addEventListener('click', function(ev){
      video_dos.pause();
      takepictureDos();
      ev.preventDefault();
    }, false);
    restetbutton_dos.addEventListener('click', function(ev){
     video_dos.play();
      takepictureDos();
    ev.preventDefault();
    },false);
  })();