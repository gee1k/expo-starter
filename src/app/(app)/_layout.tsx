import { Redirect, Stack } from 'expo-router';

import { Text } from '@/components/ui/text';
import { authClient } from '@/lib/auth';
import { Loader } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

/**
 * 用于放置所有需要在确保登录以后进行的逻辑
 */
function AuthenticatedLogic() {
  return null;
}

export default function AppLayout() {
  const { t } = useTranslation();
  const { data: session, isPending } = authClient.useSession();
  const sessionUserVerified = session?.user?.emailVerified ?? false;

  if (isPending) {
    return (
      <View className="bg-background-0 flex-1 items-center justify-center">
        <Loader size="small" />
        <Text className="mt-2">{t('common.loading')}</Text>
      </View>
    );
  }

  if (!sessionUserVerified) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <>
      <AuthenticatedLogic />
      <Stack
        screenOptions={{
          headerBackButtonDisplayMode: 'minimal',
          headerTransparent: true,
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
