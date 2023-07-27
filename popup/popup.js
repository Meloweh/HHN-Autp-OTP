function listenForClicks() {
  document.addEventListener("click", async (e) => {
    if (e.target.tagName !== "BUTTON" || !e.target.closest("#popup-content")) {
      return;
    } 
  
    if (e.target.type === "reset") {
      document.body.textContent = "Pending...";
      try {
        const response = await browser.runtime.sendMessage({command: "removeCookie", data: "otp"});
        if (response.data && response.data !== null) {
          document.body.textContent = JSON.stringify(response.data);
        }
        
      } catch (error) {
        document.body.textContent = "Error: " + error;
      }
    } else if (e.target.id === "setup") {
      document.body.textContent = "Redirecting...";
      try {
        
        const response = await browser.runtime.sendMessage({command: "getCookie", data: "otp"});
        if (response.data === 'no-cookie') {
          let newURL = "http://login.hs-heilbronn.de/";
          browser.tabs.query({active: true, currentWindow: true}, tabs => {
            browser.tabs.sendMessage(tabs[0].id, {
              action: 'redirect_setup',
              url: newURL
            });
          });

        } else {
          document.body.textContent = JSON.stringify('Cookie is present. No need for a setup.');
        }
        
      } catch (error) {
        document.body.textContent = "Error: " + error;
      }
    } else {
      document.body.textContent = "Can't do " + e.target.type;
    }
  });
  
}

listenForClicks();