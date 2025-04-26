chrome.action.onClicked.addListener((tab) => {
  chrome.tabCapture.capture({ audio: true, video: false }, (stream) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError.message);
      return;
    }
    console.log("Audio stream captured:", stream);
    // You can pass the stream to a recorder here
  });
});
