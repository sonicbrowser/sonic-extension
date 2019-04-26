# Chrome Sonification Extension

3 different approaches to get HTTP body:
1. Response-Noise - utilize chrome.debugger (Network.responseReceived command) to get Response.body
2. Request-Noise - utilize webRequest event onBeforeRequest (work in progress, requestBody in callback is empty, possible bug in Chrome)
3. DevTools-Noise - utilize DevTools network capabilities (but has drawback on AudioContext activation policy and DevTools window MUST be kept open)

To install use "Load unpacked". All works only on current tab, but 2 first may be extended to work with all tabs (opened after extension installation), see below.

TODO:
1. Merge 1+2 extension in one (play sound on both requests+responses).
2. Not create AudioBuffer on each play, but use one (or limited array of AudioBuffers) and make Interface to play through it.
3. Messages system to use common AudioBuffer, can be connected with DevTools.

Links:
- https://developer.chrome.com/extensions/webRequest#event-onBeforeRequest
- https://chromedevtools.github.io/devtools-protocol/tot/Network

Multiple tabs info:
- possible idea - https://stackoverflow.com/questions/55157551/is-it-possible-to-use-chrome-debugger-on-multiple-tabs
- possible implementation, how adds <SCRIPT>, not <IFRAME> - https://medium.com/@tarundugar1992/chrome-extension-intercepting-and-reading-the-body-of-http-requests-dd9ebdf2348b
