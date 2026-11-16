import { createContext, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Snackbar } from 'react-native-paper';
import { createFavoritesStore } from './favoritesStore.mjs';

const FavoritesContext = createContext(null);
const store = createFavoritesStore(AsyncStorage);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const current = useRef([]);
  const busy = useRef(false);
  const mounted = useRef(true);

  async function loadFavorites() {
    if (busy.current) return;
    busy.current = true;
    setLoading(true);
    try {
      const saved = await store.load();
      if (mounted.current) {
        current.current = saved;
        setFavorites(saved);
        setReady(true);
      }
    } catch {
      if (mounted.current) {
        setReady(false);
        setMessage('Não consegui carregar os favoritos. Tente novamente.');
      }
    } finally {
      busy.current = false;
      if (mounted.current) setLoading(false);
    }
  }

  useEffect(() => {
    mounted.current = true;
    loadFavorites();
    return () => { mounted.current = false; };
  }, []);

  async function toggleFavorite(id) {
    if (!ready || busy.current) return;
    busy.current = true;
    setSaving(true);
    const next = current.current.includes(id)
      ? current.current.filter(item => item !== id) : [...current.current, id];
    try {
      await store.save(next);
      current.current = next;
      if (mounted.current) {
        setFavorites(next);
        setMessage(next.includes(id) ? 'Álbum salvo nos favoritos.' : 'Álbum removido dos favoritos.');
      }
    } catch {
      if (mounted.current) setMessage('Não foi possível salvar a alteração. Seus favoritos foram mantidos.');
    } finally {
      busy.current = false;
      if (mounted.current) setSaving(false);
    }
  }

  return (
    <FavoritesContext.Provider value={{ favorites, ready, loading, saving, toggleFavorite, reload: loadFavorites }}>
      {children}
      <Snackbar visible={Boolean(message)} duration={3500} onDismiss={() => setMessage('')} action={{ label: 'Fechar', onPress: () => setMessage('') }}>
        {message}
      </Snackbar>
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
