export async function onRequestGet(context) {
  const { request } = context;
  const url = new URL(request.url);
  const { searchParams } = url;

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

  function setCookie(name, value, options = {}) {
    let cookie = `${name}=${encodeURIComponent(value)}`;
    if (options.expires) cookie += `; Expires=${options.expires.toUTCString()}`;
    if (options.maxAge) cookie += `; Max-Age=${options.maxAge}`;
    if (options.path) cookie += `; Path=${options.path}`;
    if (options.httpOnly) cookie += `; HttpOnly`;
    if (options.sameSite) cookie += `; SameSite=${options.sameSite}`;
    if (options.secure) cookie += `; Secure`;
    return cookie;
  }

  function getRandomUrl() {
    const urls = [
      '/union-bank-personal-loan/',
      '/bandhan-bank-personal-loan/',
      '/idbi-bank-personal-loan/',
      '/bank-of-baroda-personal-loan/',
    ];
    const randomIndex = Math.floor(Math.random() * urls.length);
    return urls[randomIndex];
  }

  try {
    const cookie = getCookie(request, "user_id");
    const upage_is = Number(getCookie(request, "upage_is")) + 1;
    const page_is = getCookie(request, "page_is");

    let randomUrl = '';
    let target = '';
    let follow = '';

    if (cookie && upage_is >= page_is) {
      if (!cookie.includes("s.sharelink")) {
        randomUrl = `https://r.sharelinks.in/link/?url=${encodeURIComponent(cookie)}`;
      } else {
        randomUrl = cookie;
      }
      target = "_blank";
      follow = ` rel="nofollow noopener external"`;
    } else {
      randomUrl = getRandomUrl();
      target = "_top";
      follow = "";
    }

    if (searchParams.get('id')) {
      const userAgent = request.headers.get("user-agent") || "";

      const blockedAgents = [
        "facebookexternalhit",
        "Facebot",
        "WhatsApp",
        "TelegramBot",
        "bot"
      ];

      const isBlocked = blockedAgents.some(agent =>
        userAgent.toLowerCase().includes(agent.toLowerCase())
      );

      if (isBlocked) {
        return new Response("Forbidden", {
          status: 403,
          headers: { "Content-Type": "text/plain" }
        });
      }

      const keyName = searchParams.get('id');
      const page = searchParams.get('page') || 2;

      const headers = new Headers();
      headers.append("Set-Cookie", setCookie("user_id", keyName, { path: "/", maxAge: 600, secure: true }));
      headers.append("Set-Cookie", setCookie("page_is", page, { path: "/", maxAge: 600, secure: true }));
      headers.append("Set-Cookie", setCookie("upage_is", 0, { path: "/", maxAge: 600, secure: true }));
      headers.set("Location", getRandomUrl());

      return new Response(null, {
        status: 302,
        headers,
      });
    }

    // Optional: handle non-set requests (can redirect or serve page)
    return new Response("OK", {
      status: 200,
      headers: { "Content-Type": "text/plain" }
    });

  } catch (err) {
    return new Response("Internal Error (caught): " + err.message, {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
