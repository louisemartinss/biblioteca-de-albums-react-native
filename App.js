import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { albums } from './albums';

export default function App() {
  const [texto, setTexto] = useState('');
  const [busca, setBusca] = useState(null);
  const [musicas, setMusicas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [albumAberto, setAlbumAberto] = useState(null);

  function pesquisar() {
    const termo = texto.trim();
    if (!termo || carregando) return;
    setErro('');
    setMusicas([]);
    setCarregando(true);
    // Cada envio inicia uma busca, inclusive ao repetir o mesmo texto.
    setBusca({ termo });
  }

  useEffect(() => {
    if (!busca) return;
    const controller = new AbortController();

    async function buscarMusicas() {
      const termo = encodeURIComponent(busca.termo);
      const url = 'https://itunes.apple.com/search?entity=song&limit=12&country=BR&term=' + termo;

      try {
        const resposta = await fetch(url, { method: 'GET', signal: controller.signal });
        if (!resposta.ok) throw new Error('Falha no GET');
        const dados = await resposta.json();
        setMusicas(dados.results);
      } catch {
        if (!controller.signal.aborted) setErro('Não consegui buscar as músicas. Tente novamente.');
      } finally {
        if (!controller.signal.aborted) setCarregando(false);
      }
    }

    buscarMusicas();
    return () => controller.abort();
  }, [busca]);

  return (
    <ScrollView style={styles.pagina} contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
      <Text style={styles.marca}>✦  COLEÇÃO DA LOUISE</Text>
      <Text accessibilityRole="header" style={styles.titulo}>Biblioteca</Text>
      <Text style={styles.texto}>Uma coleção de álbuns que marcaram diferentes épocas da minha vida.</Text>

      <View style={styles.busca}>
        <TextInput
          accessibilityLabel="Nome da música ou artista"
          placeholder="Buscar músicas ou artistas"
          placeholderTextColor="#735b55"
          value={texto}
          onChangeText={setTexto}
          onSubmitEditing={pesquisar}
          returnKeyType="search"
          style={styles.input}
        />
        <Pressable accessibilityRole="button" accessibilityLabel="Pesquisar músicas" disabled={carregando || !texto.trim()} onPress={pesquisar} style={styles.botaoBusca}>
          <Text style={styles.lupa}>🔍</Text>
        </Pressable>
      </View>

      {busca && (
        <View style={styles.resultados}>
          <Text accessibilityRole="header" style={styles.subtitulo}>Resultados para “{busca.termo}”</Text>
          {carregando && <ActivityIndicator accessibilityLabel="Buscando músicas" color="#4c0f07" />}
          {!!erro && <Text accessibilityLiveRegion="polite" style={styles.texto}>{erro}</Text>}
          {!carregando && !erro && musicas.length === 0 && <Text style={styles.texto}>Nenhuma música encontrada.</Text>}
          {musicas.map(musica => (
            <View key={musica.trackId} style={styles.musica}>
              <Text style={styles.nome}>{musica.trackName}</Text>
              <Text style={styles.texto}>{musica.artistName}</Text>
            </View>
          ))}
        </View>
      )}

      <Text accessibilityRole="header" style={styles.subtitulo}>Álbuns favoritos</Text>
      <View style={styles.grade}>
        {albums.map(album => (
          <View key={album.titulo} style={styles.cartao}>
            <Image accessibilityLabel={'Capa de ' + album.titulo} source={album.capa} style={styles.capa} />
            <Text style={styles.nome}>{album.titulo}</Text>
            <Text style={styles.texto}>{album.artista}</Text>
            <Pressable accessibilityRole="button" accessibilityLabel={'Detalhes de ' + album.titulo} accessibilityState={{ expanded: albumAberto === album.titulo }} onPress={() => setAlbumAberto(albumAberto === album.titulo ? null : album.titulo)}>
              <Text style={styles.detalhes}>{albumAberto === album.titulo ? 'Fechar detalhes' : 'Ver detalhes'}</Text>
            </Pressable>
            {albumAberto === album.titulo && (
              <View>
                <Text style={styles.texto}>{album.ano} · {album.genero}</Text>
                <Text style={styles.detalhes}>{'★'.repeat(album.estrelas)}</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pagina: { flex: 1, backgroundColor: '#fff4e6' },
  conteudo: { width: '100%', maxWidth: 820, alignSelf: 'center', paddingHorizontal: 20, paddingTop: 52, paddingBottom: 36 },
  marca: { color: '#78291c', fontSize: 12, fontWeight: '700', letterSpacing: 2 },
  titulo: { color: '#4c0f07', fontSize: 48, fontWeight: '800', marginVertical: 8 },
  subtitulo: { color: '#4c0f07', fontSize: 22, fontWeight: '700', marginBottom: 12 },
  texto: { color: '#573b33', fontSize: 15, lineHeight: 22 },
  busca: { flexDirection: 'row', marginTop: 22, marginBottom: 28, borderWidth: 1, borderColor: '#d0a18e', borderRadius: 12, overflow: 'hidden', backgroundColor: '#fffaf4' },
  input: { flex: 1, minWidth: 0, color: '#4c0f07', fontSize: 16, padding: 12 },
  botaoBusca: { backgroundColor: '#4c0f07', paddingHorizontal: 16, justifyContent: 'center' },
  lupa: { fontSize: 20, color: '#fff4e6' },
  resultados: { marginBottom: 26 },
  musica: { paddingVertical: 9, borderBottomWidth: 1, borderColor: '#e9d0bf' },
  nome: { color: '#4c0f07', fontSize: 16, fontWeight: '700', marginTop: 6 },
  grade: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  cartao: { flexGrow: 1, flexBasis: 145, maxWidth: 250, backgroundColor: '#fffaf4', borderRadius: 12, padding: 10 },
  capa: { width: '100%', aspectRatio: 1, borderRadius: 8 },
  detalhes: { color: '#78291c', fontWeight: '700', paddingVertical: 8 },
});
