(()=>{function o(o,e){browser.cookies.get({url:"https://login.hs-heilbronn.de",name:o}).then((o=>{o||(o="no-cookie"),e({command:"getCookie",data:o})}),(o=>{console.log(o)}))}browser.runtime.onMessage.addListener(((e,n,t)=>"getCookie"===e.command?(o(e.data,t),!0):"setCookie"===e.command?(function({name:e,value:n},t){browser.cookies.set({url:"https://login.hs-heilbronn.de",name:e,value:n}).then((n=>{console.log(n),o(e,t)}),(o=>{console.log(o)}))}(e.data,t),!0):"removeCookie"===e.command?(function({name:o},e){browser.cookies.remove({url:"https://login.hs-heilbronn.de",name:"otp"}).then((o=>{e({command:"removeCookie",data:o})}),(o=>{console.log(o)}))}(e.data,t),!0):void 0))})();