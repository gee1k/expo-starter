import { authClient } from '@/lib/auth';
import { Image } from 'expo-image';
import { router, Slot, useNavigationContainerRef } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthLayout() {
  const { data: session } = authClient.useSession();
  const isAuthenticated = useMemo(() => session?.user?.emailVerified, [session]);

  const { isReady } = useNavigationContainerRef();
  const isNavigationReady = useMemo(() => isReady(), [isReady]);

  useEffect(() => {
    if (isAuthenticated && isNavigationReady) {
      router.replace('/');
    }
  }, [isAuthenticated, isNavigationReady]);

  const { height, progress } = useReanimatedKeyboardAnimation();
  const logoAnimatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: height.value }],
    height: `${(1 - progress.value) * 20}%`,
  }));

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        contentContainerClassName="flex-1 items-center justify-center p-4 py-8 sm:py-4">
        <Animated.View style={logoAnimatedStyles} className="aspect-square overflow-hidden">
          <Image
            source={require('@/assets/images/icon.png')}
            alt="logo"
            style={{ width: '100%', height: '100%' }}
          />
        </Animated.View>
        <View className="w-full flex-1">
          <Slot />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
