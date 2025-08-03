export async function onRequestGet(context) {
  const { request } = context;

  function getCookie(request, name) {
    const cookieHeader = request.headers.get("Cookie");
    if (!cookieHeader) return null;

    const cookies = cookieHeader.split(";").map(c => c.trim());
    for (const cookie of cookies) {
      const [key, value] = cookie.split("=");
      if (key === name) return decodeURIComponent(value);
    }
    return null;
  }

  const user_id = getCookie(request, "user_id") || "Not set";
  const page_is = getCookie(request, "page_is") || 2;
  const upage_is = Number(getCookie(request, "upage_is") || 0) + 1;

  let html = '';

  if (!getCookie(request, "user_id")) {
    html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Join Viewer</title>
          <meta charset="UTF-8" />
          <style>
            body,p { font-family: Arial, sans-serif; margin: 0;padding: 0; }
          </style>
        </head>
        <body>
          <p>Join WhatsApp</p>
        </body>
      </html>
    `;
  } else {
    html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Join Viewer</title>
          <meta charset="UTF-8" />
          <style>
            body,p { font-family: Arial, sans-serif; margin: 0;padding: 0;}
            .tp-btn-2{font-size:12px;padding:0;color:#00e;background:0 0;font-weight:700;cursor:pointer;text-transform:uppercase}button.tp-btn-2:hover, button.tp-btn-2:focus{color: #222;background: transparent;}.pkclass{text-align:center;margin: 0;padding: 0;line-height:normal}
          </style>
        </head>
        <body>
          <div class="pkhinsert pkclass"><div style="font-size: 12px;margin: 0;line-height: normal;"><strong>You are <span style="color:red;">${upage_is}/${page_is}</span>.</strong></div></div><div class="pkheader pkclass"><button id="nextbtn" class="tp-btn-2 tp-blue" onclick="runtimer()">Open</button></div>

          <div class="pkfooters pkfooter pkclass"></div>

          <script>
function runtimer() {
    document.querySelector('.pkheader').innerHTML = '<button class="tp-btn-2 tp-blue">Wait... <span id="tp-time">10</span></button>';
    timer(10);
}
const bpkc={get:e=>(e=document.cookie.match(new RegExp("(?:^|; )"+e.replace(/([.$?*|{}()[\]\\/+^])/g,"$1")+"=([^;]*)")))?decodeURIComponent(e[1]):void 0,set:(e,o,n={})=>{(n={path:"/",...n}).expires instanceof Date&&(n.expires=n.expires.toUTCString());let t=unescape(encodeURIComponent(e))+"="+unescape(encodeURIComponent(o));for(var c in n){t+="; "+c;var p=n[c];!0!==p&&(t+="="+p)}document.cookie=t}};

function timer(timeset) {
    let count = timeset;
    const timeElem = document.getElementById("tp-time");
    let interval = 2000;
    let counter;

    // Start countdown
    function startCountdown() {
        counter = setInterval(() => {
            if (timeElem) {
                count--;
                if (count <= 0) {
                    document.querySelector('.pkheader').innerHTML =
                        "<button class='tp-btn-2 tp-blue' onclick='scrollToTarget()'>Next</button>";
                    clearInterval(counter);
                    document.removeEventListener("visibilitychange", handleVisibility);
                    return;
                }
                timeElem.innerHTML = count;
            }
        }, interval);
    }

    // Stop countdown
    function stopCountdown() {
        clearInterval(counter);
    }

    // Handle tab visibility
    function handleVisibility() {
        if (document.visibilityState === "hidden") {
            stopCountdown();
        } else if (document.visibilityState === "visible") {
            startCountdown();
        }
    }

    // Start the countdown and attach visibility handler
    startCountdown();
    document.addEventListener("visibilitychange", handleVisibility);
}

  function scrollToTarget() {
    document.querySelector('.pkheader').innerHTML = "<button class='tp-btn-2 tp-blue'>Scroll Down</button>";

    var cookie_link_id = bpkc.get("user_id");
    var cookie_step_id = Number(bpkc.get("upage_is"));
    var StepsToGo = Number(bpkc.get("page_is"));
        if (cookie_step_id + 1 >= StepsToGo) {
            var next_target = cookie_link_id;
        if (!cookie_link_id.includes("f.sharelink")) {
            var next_target = 'https://r.sharelinks.in/link/?url=' + encodeURIComponent(cookie_link_id);
        }
         window.parent.postMessage({ link: 'manual', content: next_target, scroll:'true' }, '*');
    } else {
      window.parent.postMessage({ link: 'random', content: 'auto', scroll:'true' }, '*');
    }
}

  	        // addEventListener support for IE8
        function bindEvent(element, eventName, eventHandler) {
            if (element.addEventListener) {
                element.addEventListener(eventName, eventHandler, false);
            } else if (element.attachEvent) {
                element.attachEvent('on' + eventName, eventHandler);
            }
        }
	        // Listen to message from child window
        bindEvent(window, 'message', function (e) {

                if (e.data.footer === "click") {
                savecookie()
                }
        });

    function savecookie() {
        var cookie_step_id = Number(bpkc.get("upage_is"));
	var StepsToGo = Number(bpkc.get("page_is"));
        var next_status = cookie_step_id + 1;
        bpkc.set("upage_is", next_status, {
            secure: 1,
            "max-age": 600,
		sameSite: "None"
        });

        if (cookie_step_id + 1 >= StepsToGo) {
            bpkc.set("upage_is", 1, {
                secure: 1,
                "max-age": 0,
		sameSite: "None"
            });
            bpkc.set("page_is", 1, {
                secure: 1,
                "max-age": 0,
		sameSite: "None"
            });
            bpkc.set("user_id", 1, {
                secure: 1,
                "max-age": 0,
		sameSite: "None"
            });

        }

    }
        
    </Script>
        </body>
      </html>
    `;
  }

  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
}
