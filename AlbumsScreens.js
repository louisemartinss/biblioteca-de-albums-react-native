import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, Button, Card, Chip, Divider, IconButton, Text } from 'react-native-paper';
import { albums } from './albums';
import { useFavorites } from './FavoritesContext';

function Page({ children }) {
  return <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.page}>
    <ScrollView contentContainerStyle={styles.content}>{children}</ScrollView>
  </SafeAreaView>;
}

function StorageStatus() {
  const { loading, ready, reload } = useFavorites();
  if (loading) return <ActivityIndicator accessibilityLabel="Carregando favoritos salvos" style={styles.status} />;
  if (!ready) return <View style={styles.status}>
    <Text>Os favoritos salvos não puderam ser carregados.</Text>
    <Button onPress={reload}>Tentar carregar novamente</Button>
  </View>;
  return null;
}

function AlbumCard({ album, navigation }) {
  const { favorites, ready, saving, toggleFavorite } = useFavorites();
  const selected = favorites.includes(album.id);
  return <Card mode="outlined" style={styles.card}>
    <View style={styles.cover}><Image source={album.capa} accessibilityLabel={`Capa de ${album.titulo}`} style={styles.imageFill} /></View>
    <Card.Content style={styles.cardContent}>
      <Text variant="titleMedium">{album.titulo}</Text>
      <Text variant="bodyMedium">{album.artista}</Text>
    </Card.Content>
    <Card.Actions style={styles.cardActions}>
      <IconButton icon={selected ? 'heart' : 'heart-outline'} selected={selected}
        accessibilityLabel={`${selected ? 'Remover' : 'Salvar'} ${album.titulo} ${selected ? 'dos' : 'nos'} favoritos`}
        accessibilityState={{ selected }} disabled={!ready || saving} onPress={() => toggleFavorite(album.id)} />
      <Button onPress={() => navigation.navigate('Album', { albumId: album.id })}
        accessibilityLabel={`Ver detalhes de ${album.titulo}`}>Detalhes</Button>
    </Card.Actions>
  </Card>;
}

export function CollectionScreen({ navigation }) {
  return <Page>
    <Text variant="labelLarge" style={styles.brand}>COLEÇÃO DA LOUISE</Text>
    <Text variant="displaySmall" accessibilityRole="header" style={styles.title}>Biblioteca</Text>
    <Text variant="bodyLarge">Uma coleção de álbuns que marcaram diferentes épocas da minha vida.</Text>
    <View style={styles.buttons}>
      <Button mode="contained" icon="magnify" onPress={() => navigation.navigate('Busca')}>Buscar músicas</Button>
      <Button mode="outlined" icon="heart-outline" onPress={() => navigation.navigate('Favoritos')}>Meus favoritos</Button>
    </View>
    <StorageStatus />
    <Text variant="headlineSmall" accessibilityRole="header" style={styles.section}>Minha coleção</Text>
    <View style={styles.grid}>{albums.map(album => <AlbumCard key={album.id} album={album} navigation={navigation} />)}</View>
  </Page>;
}

export function FavoritesScreen({ navigation }) {
  const { favorites, ready, loading } = useFavorites();
  const savedAlbums = albums.filter(album => favorites.includes(album.id));
  return <Page>
    <Text variant="headlineMedium" accessibilityRole="header" style={styles.title}>Para ouvir de novo</Text>
    <Text variant="bodyLarge">Seus álbuns favoritos ficam salvos neste aparelho.</Text>
    <StorageStatus />
    {ready && !loading && (savedAlbums.length ? <>
      <Text style={styles.section}>{savedAlbums.length} {savedAlbums.length === 1 ? 'álbum salvo' : 'álbuns salvos'}</Text>
      <View style={styles.grid}>{savedAlbums.map(album => <AlbumCard key={album.id} album={album} navigation={navigation} />)}</View>
    </> : <Card mode="outlined" style={styles.empty}>
      <Card.Content><Text variant="titleMedium">Sua lista está começando</Text>
        <Text style={styles.paragraph}>Toque no coração de um álbum da coleção para encontrá-lo aqui.</Text></Card.Content>
      <Card.Actions><Button onPress={() => navigation.navigate('Colecao')}>Explorar coleção</Button></Card.Actions>
    </Card>)}
  </Page>;
}

export function AlbumScreen({ route, navigation }) {
  const album = albums.find(item => item.id === route.params?.albumId);
  const { favorites, ready, saving, toggleFavorite } = useFavorites();
  if (!album) return <Page><Text variant="headlineSmall">Álbum não encontrado</Text>
    <Button onPress={() => navigation.navigate('Colecao')}>Voltar à coleção</Button></Page>;
  const selected = favorites.includes(album.id);
  return <Page>
    <View style={styles.detailCover}><Image source={album.capa} accessibilityLabel={`Capa de ${album.titulo}`} style={styles.imageFill} /></View>
    <Text variant="headlineLarge" accessibilityRole="header" style={styles.title}>{album.titulo}</Text>
    <Text variant="titleLarge">{album.artista}</Text>
    <View style={styles.chips}><Chip icon="calendar-outline">{album.ano}</Chip><Chip icon="music-note-outline">{album.genero}</Chip></View>
    <Text variant="titleMedium" accessibilityLabel={`Avaliação pessoal: ${album.estrelas} de 5 estrelas`} style={styles.rating}>{'★'.repeat(album.estrelas)}{'☆'.repeat(5 - album.estrelas)}</Text>
    <Divider style={styles.divider} />
    <Text variant="bodyLarge">Este álbum faz parte da coleção pessoal da Louise. A avaliação é pessoal.</Text>
    <StorageStatus />
    <View style={styles.detailButtons}>
      <Button mode="contained" icon={selected ? 'heart' : 'heart-outline'} disabled={!ready || saving} loading={saving}
        onPress={() => toggleFavorite(album.id)}>{selected ? 'Remover dos favoritos' : 'Salvar nos favoritos'}</Button>
      <Button mode="outlined" icon="magnify" onPress={() => navigation.navigate('Busca', { initialTerm: `${album.artista} ${album.titulo}` })}>Buscar músicas deste álbum</Button>
    </View>
  </Page>;
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  content: { width: '100%', maxWidth: 860, alignSelf: 'center', padding: 20, paddingBottom: 40 },
  brand: { letterSpacing: 2, marginTop: 8, color: '#78291c' },
  title: { fontWeight: '700', marginTop: 10, marginBottom: 12 },
  section: { marginTop: 24, marginBottom: 14 },
  buttons: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 24 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  card: { flexBasis: 220, flexGrow: 1, maxWidth: 390, overflow: 'hidden' },
  cover: { width: '100%', aspectRatio: 1 },
  imageFill: { width: '100%', height: '100%' },
  cardContent: { paddingTop: 14, gap: 6 },
  cardActions: { flexWrap: 'wrap' },
  status: { marginVertical: 16 },
  empty: { marginTop: 24 },
  paragraph: { marginTop: 10 },
  detailCover: { width: '100%', maxWidth: 400, aspectRatio: 1, borderRadius: 16, alignSelf: 'center', marginBottom: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 20 },
  rating: { color: '#78291c', marginTop: 20, fontSize: 25 },
  divider: { marginVertical: 20 },
  detailButtons: { gap: 12, marginTop: 24 },
});
