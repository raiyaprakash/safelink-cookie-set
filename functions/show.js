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
  const page_is = getCookie(request, "page_is") || "Not set";
  const upage_is = getCookie(request, "upage_is") || "Not set";

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
            body { font-family: Arial, sans-serif; margin: 40px; }
            table { border-collapse: collapse; width: 50%; }
            th, td { border: 1px solid #ccc; padding: 8px 12px; }
            th { background: #f5f5f5; }
          </style>
        </head>
        <body>
          <h2>Cookie Values</h2>
          <table>
            <tr><th>Cookie Name</th><th>Value</th></tr>
            <tr><td>user_id</td><td>${user_id}</td></tr>
            <tr><td>page_is</td><td>${page_is}</td></tr>
            <tr><td>upage_is</td><td>${upage_is}</td></tr>
          </table>
        </body>
      </html>
    `;
  }

  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
}
