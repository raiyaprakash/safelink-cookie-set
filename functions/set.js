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
  if (options.domain) cookie += `; Domain=${options.domain}`;
  if (options.httpOnly) cookie += `; HttpOnly`;
  if (options.sameSite) cookie += `; SameSite=${options.sameSite}`;
  if (options.secure) cookie += `; Secure`;
  return cookie;
}

  function getRandomUrl() {
    const urls = [
'https://www.pkptimes.com/2025/08/sbi-home-loan.html?m=1',
'https://www.pkptimes.com/2025/08/sbi-multi-purpose-gold-loan.html?m=1',
'https://www.pkptimes.com/2025/08/pm-mudra-loan-yojana.html?m=1',
/*'https://www.pkptimes.com/',*/
    ];
    const randomIndex = Math.floor(Math.random() * urls.length);
    return urls[randomIndex];
  }

  try {
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
      const domain = ".pkptimes.com";

      const headers = new Headers();
      headers.append("Set-Cookie", setCookie("user_id", keyName, { path: "/", maxAge: 300, secure: true, sameSite: "None", domain }));
      headers.append("Set-Cookie", setCookie("page_is", page, { path: "/", maxAge: 300, secure: true, sameSite: "None", domain }));
      headers.append("Set-Cookie", setCookie("upage_is", 0, { path: "/", maxAge: 300, secure: true, sameSite: "None", domain }));
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
