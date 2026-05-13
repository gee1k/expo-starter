import {
  focusManager,
  onlineManager,
  QueryClientProvider as Provider,
  QueryClient,
} from '@tanstack/react-query';
import * as Network from 'expo-network';
import { useEffect } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';

export const queryClient = new QueryClient();

export function QueryClientProvider({ children }: { children?: React.ReactNode }) {
  function onAppStateChange(status: AppStateStatus) {
    if (Platform.OS !== 'web') {
      focusManager.setFocused(status === 'active');
    }
  }

  useEffect(() => {
    onlineManager.setEventListener((setOnline) => {
      const eventSubscription = Network.addNetworkStateListener((state) => {
        setOnline(!!state.isConnected);
      });
      return eventSubscription.remove;
    });

    const subscription = AppState.addEventListener('change', onAppStateChange);
    return () => subscription.remove();
  }, []);

  return <Provider client={queryClient}>{children}</Provider>;
}
