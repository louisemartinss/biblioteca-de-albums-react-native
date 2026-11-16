export async function searchSongs(term, { signal, fetcher = fetch } = {}) {
  const query = term.trim();
  if (!query) return [];
  const url = `https://itunes.apple.com/search?entity=song&limit=12&country=BR&term=${encodeURIComponent(query)}`;
  const response = await fetcher(url, { method: 'GET', signal });
  if (!response.ok) throw new Error('Não foi possível consultar a API de músicas.');
  const data = await response.json();
  if (!Array.isArray(data.results)) throw new Error('A API retornou uma resposta inválida.');
  return data.results.filter(song => Number.isFinite(song.trackId) && typeof song.trackName === 'string');
}
