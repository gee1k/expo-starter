import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { authClient } from '@/lib/auth';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, View } from 'react-native';
import { toast } from 'sonner-native';

export default function VerifyEmailScreen() {
  const { t } = useTranslation();
  const { data: isAuthenticated } = authClient.useSession();
  const { token } = useLocalSearchParams<{ token?: string }>();

  const toSignIn = useCallback(() => {
    router.replace('/(auth)/sign-in');
  }, []);

  const verifyEmail = useCallback(
    async (tokenV: string) => {
      try {
        const { error, data } = await authClient.verifyEmail({
          query: {
            token: tokenV,
          },
        });

        if (error || !data?.status) {
          toast.error(t('auth.verifyEmail.failed'), {
            description: t('auth.verifyEmail.failedDescription'),
          });
          toSignIn();
          return;
        }
        toast.success(t('auth.verifyEmail.success'), {
          description: t('auth.verifyEmail.successDescription'),
        });
      } catch {
        toast.error(t('auth.verifyEmail.failed'), {
          description: t('auth.verifyEmail.failedDescription'),
        });
        toSignIn();
      } finally {
        // 清理 token
        router.setParams({ token: undefined });
      }
    },
    [toSignIn, t]
  );

  useEffect(() => {
    if (isAuthenticated) {
      return;
    }

    if (!token) {
      toSignIn();
      return;
    }

    verifyEmail(token);
  }, [isAuthenticated, token, verifyEmail, toSignIn]);

  return (
    <View className="gap-6">
      <Card className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">
            {t('auth.verifyEmail.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="flex flex-1 items-center justify-center gap-2">
            <ActivityIndicator size="large" />
            <Text>{t('auth.verifyEmail.loading')}</Text>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
