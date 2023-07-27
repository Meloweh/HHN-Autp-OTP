(function() {
  if (window.hasRun) {
    return;
  }
  const otplib = require("otplib");
  window.hasRun = true;

  function get_lappo(own_name) {
    wrapper = document.getElementById("kc-content-wrapper");
    if (!wrapper) return false;
    const occurrences = wrapper.querySelectorAll('.pf-c-tile__title');
    result = false;
    occurrences.forEach(element => {
      if (element.innerHTML == own_name) {
        result = element;
      }
    });
    return result;
  }

  function has_pwd_label() {
    result = document.querySelector('[for="password"]');
    if (result) return true;
    return false;
  }

  function set_prevurl_relevant() {
    previousURL_str = localStorage.getItem('previousURL');
    if (previousURL_str) {
      previousURL = JSON.parse(previousURL_str);
      previousURL.relevant = true;
      previousURL_str_new = JSON.stringify(previousURL);
      localStorage.setItem('previousURL', previousURL_str_new);
    }
  }

  function is_prevurl_relevant() {
    previousURL_str = localStorage.getItem('previousURL');
    if (previousURL_str) {
      previousURL = JSON.parse(previousURL_str);
      return previousURL.relevant;
    }
    return false;
  }

  function go_to_prev_url() {
    previousURL_str = localStorage.getItem('previousURL');
    if (previousURL_str) {
      previousURL = JSON.parse(previousURL_str);
      if (previousURL.relevant) {
        window.location.href = previousURL.url;
        localStorage.removeItem('previousURL');
        return;
      }
    }
  }

  function set_prevurl() {
    currurl = window.location.href;
    refobj = {
      url: currurl,
      relevant: false
    };
    currurl_str = JSON.stringify(refobj);
    localStorage.setItem('previousURL', currurl_str);
  }

  // content_script.js

  function generateRandomCharset(length) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let randomCharset = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      randomCharset += charset[randomIndex];
    }
  
    return randomCharset;
  }

    function get_otp_code(secret) {
        otplib.authenticator.options = {
            algorithm: 'sha1',
            step: 30,
            digits: 6
        }
        const token = otplib.authenticator.generate(secret);
        return token;
    }

  function do_otp(device, giraffe) {
      lappo = get_lappo(device);
      if (lappo) {
          parent = lappo.parentNode.parentNode;
          target_id = parent.getAttribute("for");
          radio = document.getElementById(target_id);
          radio.checked = "true";

          otp = document.getElementById("otp");

          const token = get_otp_code(giraffe);
          otp.value = token;

          login = document.getElementById("kc-login");
          setTimeout(() => {
              login.click();
          }, 500);
          return;
      }
  }

  function general_redirect() {
    const observer = new MutationObserver(function (mutationsList, observer) {
     window.pause = true;
      mutationsList.forEach((mutation) => {
        if (mutation.type === "childList" || mutation.type === 'attributes') {
          child_login = document.querySelector('[aria-label="Anmelden"]');
          if (child_login) {
            set_prevurl_relevant();
            child_login.parentNode.click();
            return;
          }
          login = document.querySelector('[href="https://ilias.hs-heilbronn.de/openidconnect.php"]');
          if (login) {
            set_prevurl_relevant();
            login.click();
            return;
          }
          if (has_pwd_label()) {
            set_prevurl_relevant();
            login = document.getElementById("kc-login");
            if (login) {
              username = document.getElementById("username");
              if (username && username.value.length > 0) {
                login.click();
              }
            }
            window.pause = true;
            return;
          }

          mdilogin = document.getElementsByClassName("mdi-login");
          if (mdilogin.length > 0) {
            target = mdilogin[0];
            target.parentNode.parentNode.click();
            return;
          }

          browser.runtime.sendMessage({command: "getCookie", data: "otp"})
          .then(response => {
            window.otp = response.data;
            if (response.data === "no-cookie") {
              login = document.getElementById("kc-login");
              if (login) {
                return;
              }
              if (window.location.href === "https://login.hs-heilbronn.de/") {
                target = document.querySelector('[href="/realms/hhn/account"]');
                if (target) {
                  target.click();
                  return;
                }
              }
    
              if (window.location.href === "https://login.hs-heilbronn.de/realms/hhn/account/#/") {
                target = document.querySelector('[href="/realms/hhn/account"]');
                if (target) {
                  target.click();
                  return;
                }
              }
    
              towards_otp_setup = document.getElementById("landing-signingin");
              if (towards_otp_setup) {
                towards_otp_setup.firstElementChild.click();
              }
    
              otp_setup = document.getElementById("otp-set-up");
              if (otp_setup) {
                otp_setup.click();
                return;
              }
    
              mode_manual = document.getElementById("mode-manual");
              if (mode_manual) {
                mode_manual.click();
                return;
              }
    
              otp_key = document.getElementById("kc-totp-secret-key");
              user_label = document.getElementById("userLabel");
              if (otp_key && user_label) {
                giraffe = otp_key.innerHTML.replaceAll(' ', '');
                booga = generateRandomCharset(15);
    
                otp_data = {
                  giraffe: giraffe,
                  booga: booga
                }
    
                browser.runtime.sendMessage({command: "setCookie", data: { name: "otp", value: JSON.stringify(otp_data) }})
                .then(response2 => {
                  if (response2.data === "no-cookie") {
                    return;
                  }

                  keks = JSON.parse(response2.data.value);
                  
                  user_label.value = keks.booga
                  otp_input = document.getElementById("totp");

                  if (!otp_input) return;

                  otp_input.value = get_otp_code(keks.giraffe);

                  saveTOTPBtn = document.getElementById("saveTOTPBtn");
                  if (!saveTOTPBtn) return;
                  setTimeout(() => {
                    saveTOTPBtn.click();
                    return;
                  }, 500);
                });
              }
      
            } else {
              keks = JSON.parse(response.data.value);
              do_otp(keks.booga, keks.giraffe);
              return;
            }
          });
        }
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  window.will_otp = true;
  window.step = "none";
  general_redirect();

  function t() {
    setTimeout(() => {
      if (!window.pause) {
        id = "temp549973";
        const hypo = document.getElementById(id);
        if (hypo) {
          hypo.remove();
        } else {
          const temp_div = document.createElement('div');
          temp_div.setAttribute("id", id);
          document.body.appendChild(temp_div);
        }
      }
      t();
    }, 1000);
  }
  t();

  /*
  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "getCookie") {
      //console.log(message.data);
      window.otp = message.data;
      alert(JSON.stringify(JSON.parse(window.otp.value)));

      if (message.data !== "no-cookie") {

      } else {

      }
      
    }
  });*/
  browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'redirect_setup') {
      window.location.href = request.url;
    }
  });
})();
