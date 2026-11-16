import { MD3LightTheme } from 'react-native-paper';

export const theme = {
  ...MD3LightTheme,
  roundness: 3,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#78291c', onPrimary: '#ffffff', primaryContainer: '#f4d1bd', onPrimaryContainer: '#4c0f07',
    secondary: '#735b55', secondaryContainer: '#f1ded0', onSecondaryContainer: '#4c0f07',
    background: '#fff4e6', surface: '#fffaf4', surfaceVariant: '#f1e0d1',
    onSurface: '#4c0f07', onSurfaceVariant: '#573b33', outline: '#9b7868', outlineVariant: '#dfc5b4',
    elevation: { ...MD3LightTheme.colors.elevation, level1: '#fffaf4', level2: '#f8e9dc' },
  },
};
