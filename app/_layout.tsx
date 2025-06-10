import { useFonts } from 'expo-font';
import { Stack, Tabs } from 'expo-router';
import 'react-native-reanimated';
import {persistor, store} from "@/redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Lora-Bold': require('../assets/fonts/Lora-Bold.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Stack initialRouteName="LoginPage" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="LoginPage" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </PersistGate>
    </Provider>
  );
}
