export default {
  async fetch(request) {
    const url = new URL(request.url);

    // reemplazá esto con tu bucket base
    const supabaseBase =
      "https://lnrgqxxdlfgrsmtojurd.supabase.co/storage/v1/object/public";

    const targetUrl = supabaseBase + url.pathname;

    const response = await fetch(targetUrl, request);

    // Cloudflare cache
    const newResponse = new Response(response.body, response);

    newResponse.headers.set("Cache-Control", "public, max-age=31536000, immutable");

    return newResponse;
  },
};