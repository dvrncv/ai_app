import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Header from '@/components/Header';
import { IconSymbol } from '@/components/ui/IconSymbol';
import 'react-native-reanimated';
import LoginPage from './LoginPage';


import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Lora-Bold': require('../assets/fonts/Lora-Bold.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <Stack initialRouteName="LoginPage" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginPage" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
