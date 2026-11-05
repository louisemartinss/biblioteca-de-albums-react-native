const CACHE = 'biblioteca-v1';

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const pagina = await fetch('./');
    if (!pagina.ok) throw new Error('Não foi possível salvar a biblioteca');
    const html = await pagina.clone().text();
    const scripts = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(match => match[1]);
    await cache.addAll(['./manifest.json', './icon-192.png', './icon-512.png', ...scripts]);
    await cache.put('./', pagina);
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  const pedido = event.request;
  if (pedido.method !== 'GET' || new URL(pedido.url).origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const resposta = await fetch(pedido);
      if (resposta.ok) await cache.put(pedido, resposta.clone());
      return resposta;
    } catch {
      return await cache.match(pedido) || (pedido.mode === 'navigate' && await cache.match('./')) || Response.error();
    }
  })());
});
