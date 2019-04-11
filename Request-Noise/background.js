chrome.webRequest.onBeforeRequest.addListener(
  // callback
  function(info) {
    console.log("Packet: ");
    console.log(info);

    // requestBody is empty now
    // need to find 
    console.log(info.requestBody); 
  },
  // filters
  {
    urls: [
      "<all_urls>"
    ],
    types: ["image"]
  },
  // extraInfoSpec
  ["requestBody"]);
