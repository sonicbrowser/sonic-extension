chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.debugger.attach(
    { tabId: tab.id }, version,
    onAttach.bind(null, tab.id));

    // var buffer = [];
    // for (var i=0; i<audioCtx.sampleRate/10; i++) {
    //   // Math.random() is in [0; 1.0]
    //   // audio needs to be in [-1.0; 1.0]
    //   buffer.push(Math.random() * 2 - 1);
    // }
    
    // playBuffer(buffer);

});

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playBuffer(buffer) {
  var length = buffer.length;
  console.log("playBuffer with length ", length, " / 44100")
  var myArrayBuffer = audioCtx.createBuffer(2, length, audioCtx.sampleRate);
  for (var channel = 0; channel < myArrayBuffer.numberOfChannels; channel++) {
    // This gives us the actual array that contains the data inside AudioContext
    var nowBuffering = myArrayBuffer.getChannelData(channel);
    nowBuffering.set(buffer, 0);
  }
  // Get an AudioBufferSourceNode.
  // This is the AudioNode to use when we want to play an AudioBuffer
  var source = audioCtx.createBufferSource();

  // set the buffer in the AudioBufferSourceNode
  source.buffer = myArrayBuffer;

  // connect the AudioBufferSourceNode to the
  // destination so we can hear the sound
  source.connect(audioCtx.destination);

  // start the source playing
  source.start();
}

var version = "1.0";

function onAttach(tabId) {
  if (chrome.runtime.lastError) {
    alert(chrome.runtime.lastError.message);
    return;
  }

  // current tab
  chrome.debugger.sendCommand({ tabId: tabId }, "Network.enable");  

  // // all tabs
  // console.log("debugger started");
  // chrome.debugger.getTargets(function (result) {
  //   result.forEach(element => {
  //     // console.log(element.tabId, element.url);
  //     if (element.tabId)
  //       chrome.debugger.sendCommand({ tabId: element.tabId }, "Network.enable");  
  //   });
  // });

  // debugger listener for all events 
  chrome.debugger.onEvent.addListener(onEvent);

  function onEvent(debuggeeId, message, params) {
    console.log(debuggeeId, message, params);
    if (message == "Network.requestWillBeSent") {

    } else if (message == "Network.responseReceived") {
      catchRespone(params, debuggeeId);
    }
  }

  function catchRespone(params, debuggeeId) {
    chrome.debugger.sendCommand(debuggeeId, "Network.getResponseBody", {
      "requestId": params.requestId
    }, cbBody);
  }

  function cbBody(result) {
    if (result)
      playBuffer(convertCharsToBuffer(result.body));
  }
}

function convertCharsToBuffer(chars) {
  var buffer = [];
  var length = Math.min(chars.length, 44100);
  for (var i=0; i<length; i++)
  // audio needs to be in [-1.0; 1.0]
  buffer.push((chars.charCodeAt(i) % 255 / 256) * 2 - 1);
  return buffer
}
