function setCookie({ name, value }, sendResponse) {
  browser.cookies.set({
      url: "https://login.hs-heilbronn.de", // Use your site's URL here
      name: name,
      value: value
  }).then((cookie) => {
    console.log(cookie);
    // After setting the cookie, retrieve it and send it back to the content script
    getCookie(name, sendResponse);
  }, (error) => {
    console.log(error);
  });
}

function getCookie(name, sendResponse) {
  browser.cookies.get({
    url: "https://login.hs-heilbronn.de", // Use your site's URL here
    name: name
  }).then((cookie) => {
      if (!cookie) {
          cookie = "no-cookie";
      }
      sendResponse({command: "getCookie", data: cookie});
  }, (error) => {
    console.log(error);
  });
}

function removeCookie({ name }, sendResponse) {
    browser.cookies.remove({
        url: "https://login.hs-heilbronn.de",
        name: "otp"
    }).then((wasRemoved) => {
        sendResponse({command: "removeCookie", data: wasRemoved});
    }, (error) => {
        console.log(error);
    });
}


browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "getCookie") {
        getCookie(message.data, sendResponse);
        return true; // indicates we are going to send a response asynchronously
    } else if (message.command === "setCookie") {
        setCookie(message.data, sendResponse);
        return true; // indicates we are going to send a response asynchronously
    } else if (message.command === "removeCookie") {
        removeCookie(message.data, sendResponse);
        return true; // indicates we are going to send a response asynchronously
    }
});
