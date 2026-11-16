# Biblioteca de Álbuns

Aplicativo de Louise Martins para a **Atividade Individual 05 — React Native + Rotas**. Continuação da biblioteca de álbuns com Expo, consulta à API do iTunes, navegação entre telas, React Native Paper e favoritos persistentes com AsyncStorage.

## Requisitos da atividade

| Requisito | Implementação |
| --- | --- |
| React Native + Expo | Projeto Expo SDK 56, com entrada em `index.js` |
| Consumir e exibir uma API | Busca de músicas pelo iTunes, mostrando título, artista, álbum e capa |
| Navegação entre telas | React Navigation com Native Stack e parâmetros de rota |
| React Native Paper | Tema, Appbar, Card, Button, Searchbar, Chip, Snackbar e indicadores |
| AsyncStorage | Favoritos gravados localmente e recuperados ao reabrir o aplicativo |

## Telas e rotas

- **Coleção** (`/`): os seis álbuns da biblioteca e ações para buscar, abrir detalhes e favoritar.
- **Detalhes** (`/album/:albumId`): capa, artista, ano, gênero e avaliação pessoal. Recebe somente o identificador do álbum como parâmetro.
- **Busca** (`/buscar`): consulta músicas e artistas pela internet. A busca também pode ser iniciada a partir dos detalhes de um álbum.
- **Favoritos** (`/favoritos`): lista apenas os álbuns salvos no aparelho e permite removê-los.

O cabeçalho permite voltar, buscar e acessar favoritos. Ao abrir uma rota diretamente no navegador, há uma ação para retornar à coleção. Na web, o histórico do navegador acompanha a navegação.

## Executar

Requer Node.js 22 ou superior e npm.

```bash
npm ci
npm start
```

Escaneie o QR code com o Expo Go compatível com o SDK 56. O computador e o celular devem estar na mesma rede. Também é possível usar um emulador Android ou um simulador iOS configurado.

Para executar no navegador:

```bash
npm run web
```

Para exportar a versão web:

```bash
npm run build:web
```

Sirva a pasta `dist` em um servidor com fallback de rotas para `index.html`. A busca precisa de internet. A coleção usa capas locais. Os arquivos da PWA anterior continuam em `public/`; o cache offline depende de uma visita online anterior e não substitui o AsyncStorage.

## API

A busca mantém a [iTunes Search API](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/Searching.html):

```text
GET https://itunes.apple.com/search?entity=song&limit=12&country=BR&term=TERMO
```

O termo é codificado na URL. A aplicação mostra carregamento, lista vazia, erro e opção de tentar novamente. Requisições são canceladas ao sair da tela ou iniciar outra busca e têm limite de 15 segundos. Os resultados vêm da API; a lista de seis álbuns é a coleção pessoal fixa. As estrelas representam uma avaliação pessoal.

## Armazenamento local

`FavoritesContext.js` compartilha os favoritos entre as telas. O AsyncStorage grava um array JSON de IDs na chave `@biblioteca-louise/favoritos:v1`. As alterações são aplicadas à interface depois da gravação. Uma falha de leitura não sobrescreve os dados e permite tentar carregá-los novamente. Os favoritos não são sincronizados entre aparelhos ou navegadores.

## Organização

- `App.js`: providers, tema de navegação, cabeçalho e quatro rotas.
- `AlbumsScreens.js`: coleção, detalhes e favoritos.
- `SearchScreen.js`: formulário e resultados da busca.
- `FavoritesContext.js`: carregamento e atualização dos favoritos com AsyncStorage.
- `favoritesStore.mjs`: serialização e validação do armazenamento.
- `itunes.mjs`: consulta HTTP à API.
- `theme.js`: tema do React Native Paper, preservando a paleta da biblioteca.
- `albums.js` e `assets/`: dados e capas da coleção anterior.
- `services.test.mjs`: testes da API e do armazenamento com dependências simuladas.

## Conferir a atividade

1. Abra a coleção e entre nos detalhes de FOUR.
2. Salve o álbum nos favoritos e abra a tela de favoritos pelo coração do cabeçalho.
3. Recarregue a página ou feche e reabra o app. O álbum deve continuar salvo.
4. Remova o favorito e reabra o app. A lista deve continuar vazia.
5. Nos detalhes, use **Buscar músicas deste álbum**, ou pesquise **Drag Me Down** na busca.
6. Confira título, artista e álbum dos resultados e use **Voltar** para retornar.

Testes automatizados dos serviços:

```bash
npm test
```

Verificação de compatibilidade das dependências com o Expo:

```bash
npx expo install --check
```

## Entrega

Repositório público: [louisemartinss/biblioteca-de-albums-react-native](https://github.com/louisemartinss/biblioteca-de-albums-react-native).
