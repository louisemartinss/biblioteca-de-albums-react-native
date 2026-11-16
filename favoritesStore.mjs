export const FAVORITES_KEY = '@biblioteca-louise/favoritos:v1';

export function normalizeFavorites(value) {
  if (!Array.isArray(value) || value.some(id => typeof id !== 'string')) {
    throw new Error('Formato inválido dos favoritos.');
  }
  return [...new Set(value)];
}

export function createFavoritesStore(storage) {
  return {
    async load() {
      const raw = await storage.getItem(FAVORITES_KEY);
      return raw === null ? [] : normalizeFavorites(JSON.parse(raw));
    },
    async save(ids) {
      await storage.setItem(FAVORITES_KEY, JSON.stringify(normalizeFavorites(ids)));
    },
  };
}
