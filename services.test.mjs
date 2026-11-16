import test from 'node:test';
import assert from 'node:assert/strict';
import { createFavoritesStore, FAVORITES_KEY } from './favoritesStore.mjs';
import { searchSongs } from './itunes.mjs';

test('favoritos são recuperados por uma nova instância depois de salvar e remover', async () => {
  const values = new Map();
  const storage = { getItem: async key => values.get(key) ?? null,
    setItem: async (key, value) => values.set(key, value) };
  const first = createFavoritesStore(storage);
  assert.deepEqual(await first.load(), []);
  await first.save(['four', 'layover', 'four']);
  const reopened = createFavoritesStore(storage);
  assert.deepEqual(await reopened.load(), ['four', 'layover']);
  await reopened.save(['layover']);
  assert.deepEqual(await createFavoritesStore(storage).load(), ['layover']);
  assert.equal(values.get(FAVORITES_KEY), '["layover"]');
});

test('falha de leitura ou dados inválidos não apagam dados salvos', async () => {
  for (const raw of ['{invalido', '{"id":"four"}', '[null]']) {
    let wrote = false;
    const store = createFavoritesStore({ getItem: async () => raw, setItem: async () => { wrote = true; } });
    await assert.rejects(store.load());
    assert.equal(wrote, false);
  }
  const store = createFavoritesStore({ getItem: async () => { throw new Error('bloqueado'); } });
  await assert.rejects(store.load(), /bloqueado/);
});

test('erro de gravação é comunicado ao chamador', async () => {
  const store = createFavoritesStore({ setItem: async () => { throw new Error('sem espaço'); } });
  await assert.rejects(store.save(['four']), /sem espaço/);
});

test('busca codifica o termo, usa GET e encaminha o sinal de cancelamento', async () => {
  const controller = new AbortController();
  const song = { trackId: 1, trackName: 'Drag Me Down', artistName: 'One Direction' };
  let calls = 0;
  const result = await searchSongs('  pop & MPB  ', { signal: controller.signal,
    fetcher: async (url, options) => {
      calls++;
      assert.equal(new URL(url).searchParams.get('term'), 'pop & MPB');
      assert.equal(new URL(url).searchParams.get('entity'), 'song');
      assert.equal(options.method, 'GET');
      assert.equal(options.signal, controller.signal);
      return { ok: true, json: async () => ({ results: [song, { trackName: 'sem id' }] }) };
    } });
  assert.equal(calls, 1);
  assert.deepEqual(result, [song]);
});

test('busca vazia não faz requisição e resposta vazia é válida', async () => {
  assert.deepEqual(await searchSongs('  ', { fetcher: () => { throw new Error('não chamar'); } }), []);
  assert.deepEqual(await searchSongs('nada', { fetcher: async () => ({ ok: true, json: async () => ({ results: [] }) }) }), []);
});

test('falhas HTTP, resposta inválida e cancelamento são propagados', async () => {
  await assert.rejects(searchSongs('teste', { fetcher: async () => ({ ok: false }) }));
  await assert.rejects(searchSongs('teste', { fetcher: async () => ({ ok: true, json: async () => ({}) }) }));
  await assert.rejects(searchSongs('teste', { fetcher: async () => { throw new DOMException('cancelado', 'AbortError'); } }), { name: 'AbortError' });
});
