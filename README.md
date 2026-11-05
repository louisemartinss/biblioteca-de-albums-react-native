# Biblioteca de Álbuns

Versão em React Native com Expo da coleção de Louise Martins. A tela tem os seis álbuns favoritos, detalhes que abrem ao toque e uma lupa para buscar músicas.

## Rodar

Com Node.js 22 ou mais recente, abra o terminal na pasta do projeto:

```bash
npm install
npm run web
```

Para abrir no celular com Expo Go, rode `npm start` e escaneie o QR code com uma versão compatível com o SDK 56.

## Por onde estudar

- `App.js` tem a tela e os estilos. O `useState` guarda o texto, a busca enviada e os resultados. A lupa atualiza a busca, o `useEffect` percebe a mudança e executa o GET. A resposta atualiza a lista.
- `albums.js` tem os dados fixos dos álbuns. O cartão FOUR usa a ficha da [Apple Music](https://music.apple.com/us/album/four/914559415).
- `assets/` tem as capas reaproveitadas do projeto original.
- `public/` tem o manifesto, ícones e service worker da versão PWA. `index.js` é a entrada padrão do Expo.

A busca usa o [GET de músicas da iTunes Search API](https://performance-partners.apple.com/search-api). Experimente digitar **Drag Me Down** e tocar na lupa. O app lista título e artista de cada música retornada. A API pode retornar versões diferentes da mesma música.

## Versão PWA

Rode `npm run build:web` e sirva a pasta `dist` em localhost ou HTTPS. Em um navegador compatível, use a opção de instalar o app no menu. Abra e recarregue a página uma vez online para salvar as capas no cache. Depois, a biblioteca pode ser reaberta offline. A busca de novas músicas precisa de internet.

