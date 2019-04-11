// requestBody is empty now, 

chrome.webRequest.onBeforeRequest.addListener(
  // callback
  function(info) {
    console.log("Packet: ");
    console.log(info);
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
