import { QueryClientProvider } from '@/contexts';
import '@/global.css';

import '@/lib/i18n';
import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Slot } from 'expo-router';

import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toaster } from 'sonner-native';
import { useUniwind } from 'uniwind';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const { theme } = useUniwind();

  return (
    <QueryClientProvider>
      <KeyboardProvider>
        <GestureHandlerRootView>
          <SafeAreaProvider>
            <ThemeProvider value={NAV_THEME[theme ?? 'light']}>
              <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
              <Slot />
              <PortalHost />
              <Toaster
                position="top-center"
                theme={theme}
                invert={true}
                visibleToasts={1}
                duration={3000}
              />
            </ThemeProvider>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </KeyboardProvider>
    </QueryClientProvider>
  );
}
