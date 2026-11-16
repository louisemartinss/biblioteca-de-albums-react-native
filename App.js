import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appbar, PaperProvider } from 'react-native-paper';
import { FavoritesProvider } from './FavoritesContext';
import { CollectionScreen, AlbumScreen, FavoritesScreen } from './AlbumsScreens';
import SearchScreen from './SearchScreen';
import { theme } from './theme';

const Stack = createNativeStackNavigator();
const navigationTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, primary: theme.colors.primary, background: theme.colors.background,
    card: theme.colors.surface, text: theme.colors.onSurface, border: theme.colors.outlineVariant },
};
const linking = {
  prefixes: ['bibliotecalouise://'],
  config: { screens: { Colecao: '', Album: 'album/:albumId', Busca: 'buscar', Favoritos: 'favoritos' } },
};

function Header({ navigation, route, options, back }) {
  return (
    <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
      {back && <Appbar.BackAction accessibilityLabel="Voltar" onPress={navigation.goBack} />}
      {!back && route.name !== 'Colecao' && <Appbar.Action icon="home-outline" accessibilityLabel="Voltar à coleção" onPress={() => navigation.navigate('Colecao')} />}
      <Appbar.Content title={options.title ?? route.name} titleStyle={{ fontWeight: '700' }} />
      {route.name !== 'Busca' && <Appbar.Action icon="magnify" accessibilityLabel="Abrir busca" onPress={() => navigation.navigate('Busca')} />}
      {route.name !== 'Favoritos' && <Appbar.Action icon="heart-outline" accessibilityLabel="Abrir favoritos" onPress={() => navigation.navigate('Favoritos')} />}
    </Appbar.Header>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <FavoritesProvider>
          <NavigationContainer linking={linking} theme={navigationTheme}>
            <Stack.Navigator screenOptions={{ header: props => <Header {...props} />, contentStyle: { backgroundColor: theme.colors.background } }}>
              <Stack.Screen name="Colecao" component={CollectionScreen} options={{ title: 'Coleção da Louise' }} />
              <Stack.Screen name="Album" component={AlbumScreen} options={{ title: 'Detalhes do álbum' }} />
              <Stack.Screen name="Busca" component={SearchScreen} options={{ title: 'Buscar músicas' }} />
              <Stack.Screen name="Favoritos" component={FavoritesScreen} options={{ title: 'Meus favoritos' }} />
            </Stack.Navigator>
          </NavigationContainer>
        </FavoritesProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
