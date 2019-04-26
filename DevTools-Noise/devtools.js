// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var global_panel;

// TODO - move audioCtx to extension background.js context
// is it possible to pass the data between this contexts?
// TODO - make a test sendMessage routine
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

chrome.devtools.panels.create(
  "NOISE",
  "",
  "empty.html",
  function (panel) {
    console.log("panel created");
    console.log(panel);
    global_panel = panel;
    audioCtx.resume();
  });

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

function makeSound(content) {
  if (content)
    playBuffer(content);
}

function handleRequest(entry) {
  console.log("entry: ", entry);
  entry.getContent(makeSound)
}

chrome.devtools.network.getHAR(function (result) {

  console.log("getHAR started (log)");

  var entries = result.entries;
  // if (!entries.length) {
  //   console.log("ChromeFirePHP suggests that you reload the page to track" +
  //     " FirePHP messages for all the requests");
  // }

  for (var i = 0; i < entries.length; ++i)
    handleRequest(entries[i]);

  chrome.devtools.network.onRequestFinished.addListener(handleRequest);
});
