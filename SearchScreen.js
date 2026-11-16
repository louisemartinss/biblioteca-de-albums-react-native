import { useEffect, useState } from 'react';
import { FlatList, Image, Linking, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, Button, Card, Searchbar, Text } from 'react-native-paper';
import { searchSongs } from './itunes.mjs';

export default function SearchScreen({ route }) {
  const initialTerm = route.params?.initialTerm ?? '';
  const [text, setText] = useState(initialTerm);
  const [request, setRequest] = useState(initialTerm ? { term: initialTerm } : null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(Boolean(initialTerm));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!initialTerm) return;
    setText(initialTerm);
    setRequest({ term: initialTerm });
  }, [initialTerm]);

  useEffect(() => {
    if (!request) return;
    const controller = new AbortController();
    let active = true;
    let timedOut = false;
    const timer = setTimeout(() => { timedOut = true; controller.abort(); }, 15000);
    setLoading(true);
    setError('');
    setSongs([]);
    searchSongs(request.term, { signal: controller.signal })
      .then(results => { if (active) setSongs(results); })
      .catch(() => {
        if (active) setError(timedOut ? 'A busca demorou demais. Tente novamente.' : 'Não consegui buscar as músicas. Confira sua conexão e tente novamente.');
      })
      .finally(() => { clearTimeout(timer); if (active) setLoading(false); });
    return () => { active = false; clearTimeout(timer); controller.abort(); };
  }, [request]);

  function search() {
    const term = text.trim();
    if (term && !loading) setRequest({ term });
  }

  async function openSong(song) {
    if (!song.trackViewUrl?.startsWith('https://')) return;
    try { await Linking.openURL(song.trackViewUrl); }
    catch { setError('Não consegui abrir o link da música.'); }
  }

  return <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.page}>
    <FlatList data={songs} keyExtractor={song => String(song.trackId)} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}
      ListHeaderComponent={<>
        <Text variant="headlineMedium" accessibilityRole="header" style={styles.title}>Qual música você procura?</Text>
        <Text variant="bodyLarge">Busque pelo título ou pelo artista na API do iTunes.</Text>
        <Searchbar accessibilityLabel="Nome da música ou artista" placeholder="Música ou artista" value={text} onChangeText={setText}
          onSubmitEditing={search} returnKeyType="search" onIconPress={search} style={styles.search} />
        <Button mode="contained" onPress={search} disabled={loading || !text.trim()} loading={loading}>Pesquisar</Button>
        {request && <Text variant="titleMedium" style={styles.results}>Resultados para “{request.term}”</Text>}
        {!!error && <View accessibilityLiveRegion="polite" style={styles.error}>
          <Text>{error}</Text><Button onPress={() => setRequest({ term: request.term })} disabled={loading}>Tentar novamente</Button>
        </View>}
      </>}
      ListEmptyComponent={loading ? <ActivityIndicator accessibilityLabel="Buscando músicas" style={styles.results} />
        : <Text style={styles.results} accessibilityLiveRegion="polite">{error ? '' : request ? 'Nenhuma música encontrada. Experimente outro termo.' : 'Digite uma música ou artista para começar.'}</Text>}
      renderItem={({ item }) => <Card mode="outlined" style={styles.card}>
        <Card.Content style={styles.song}>
          {item.artworkUrl100 && <Image source={{ uri: item.artworkUrl100 }} accessibilityLabel={`Capa de ${item.collectionName ?? item.trackName}`} style={styles.artwork} />}
          <View style={styles.songText}><Text variant="titleMedium">{item.trackName}</Text><Text variant="bodyMedium">{item.artistName}</Text>
            {!!item.collectionName && <Text variant="bodySmall">{item.collectionName}</Text>}</View>
        </Card.Content>
        {item.trackViewUrl?.startsWith('https://') && <Card.Actions><Button icon="open-in-new" accessibilityLabel={`Abrir ${item.trackName} no Apple Music`} onPress={() => openSong(item)}>Abrir música</Button></Card.Actions>}
      </Card>}
    />
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  content: { width: '100%', maxWidth: 860, alignSelf: 'center', padding: 20, paddingBottom: 40 },
  title: { marginTop: 10, marginBottom: 12, fontWeight: '700' },
  search: { marginTop: 24, marginBottom: 12 },
  results: { marginTop: 24, marginBottom: 16 },
  error: { marginVertical: 12 },
  card: { marginBottom: 12 },
  song: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingTop: 16 },
  artwork: { width: 64, height: 64, borderRadius: 8 },
  songText: { flex: 1, gap: 4 },
});
