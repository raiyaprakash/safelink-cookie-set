export async function onRequestGet(context) {
  const { request } = context;
  const url = new URL(request.url);
  const path = url.pathname; // e.g. "/85ftSIaK" or "/join"

  // 🔹 Exclude /join path completely
  if (path.startsWith("/join")) {
    return context.next(); // continue without touching cookies
  }
    // 🔹 Exclude static assets
  const staticExtensions = [
    ".css", ".js", ".png", ".jpg", ".jpeg", ".gif",
    ".svg", ".ico", ".webp", ".json", ".txt", ".map",
    ".woff", ".woff2", ".ttf", ".eot", ".mp4", ".mp3"
  ];
  if (staticExtensions.some(ext => path.toLowerCase().endsWith(ext))) {
    return context.next();
  }

  function setCookie(name, value, options = {}) {
    let cookie = `${name}=${encodeURIComponent(value)}`;
    if (options.expires) cookie += `; Expires=${options.expires.toUTCString()}`;
    if (options.maxAge) cookie += `; Max-Age=${options.maxAge}`;
    if (options.path) cookie += `; Path=${options.path}`;
    if (options.domain) cookie += `; Domain=${options.domain}`;
    if (options.httpOnly) cookie += `; HttpOnly`;
    if (options.sameSite) cookie += `; SameSite=${options.sameSite}`;
    if (options.secure) cookie += `; Secure`;
    return cookie;
  }

  function getRandomUrl() {
    const urls = [
      //'https://www.pkptimes.com/2025/08/sbi-home-loan.html?m=1',
      //'https://www.pkptimes.com/2025/08/sbi-multi-purpose-gold-loan.html?m=1',
      //'https://www.pkptimes.com/2025/08/pm-mudra-loan-yojana.html?m=1',
      'https://www.pkptimes.com/?m=1',
    ];
    const randomIndex = Math.floor(Math.random() * urls.length);
    return urls[randomIndex];
  }

  try {
    // Extract id from path (remove leading/trailing slashes)
    const id = path.replace(/^\/+|\/+$/g, ""); 
    if (id) {
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

      const page = 2; // always default
      const keyName = `https://f.sharelinks.in/${id}`; // ✅ prepend domain

      const headers = new Headers();
      headers.append("Set-Cookie", setCookie("user_id", keyName, { path: "/", maxAge: 300, secure: true, sameSite: "None" }));
      headers.append("Set-Cookie", setCookie("page_is", page, { path: "/", maxAge: 300, secure: true, sameSite: "None" }));
      headers.append("Set-Cookie", setCookie("upage_is", 0, { path: "/", maxAge: 300, secure: true, sameSite: "None" }));
      headers.set("Location", getRandomUrl());

      return new Response(null, {
        status: 302,
        headers,
      });
    }

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
