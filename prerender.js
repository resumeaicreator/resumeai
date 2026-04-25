export default async function handler(request, context) {
  const userAgent = request.headers.get("user-agent") || "";

  // Bot user agents to prerender for
  const botAgents = [
    "googlebot","bingbot","yandex","baiduspider","facebookexternalhit",
    "twitterbot","linkedinbot","slurp","duckduckbot","applebot",
    "semrushbot","ahrefsbot","mj12bot","dotbot","rogerbot",
    "seokicks","prerender","seo powersuite","seospiderbot",
  ];

  const isBot = botAgents.some(bot => userAgent.toLowerCase().includes(bot));

  // Only intercept HTML page requests from bots, not assets
  const url = new URL(request.url);
  const isAsset = /\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|map|json|xml|txt)$/.test(url.pathname);

  if (!isBot || isAsset) {
    return context.next();
  }

  // Forward to Prerender.io
  const prerenderUrl = `https://service.prerender.io/${request.url}`;
  const response = await fetch(prerenderUrl, {
    headers: {
      "X-Prerender-Token": "lqX9rvSGNGiLka98P9s2",
      "User-Agent": userAgent,
    },
  });

  return new Response(response.body, {
    status: response.status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Prerendered": "true",
    },
  });
}

export const config = { path: "/*" };
