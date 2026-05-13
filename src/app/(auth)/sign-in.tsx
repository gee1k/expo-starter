import { SocialConnections, SocialConnectionStrategyType } from '@/components/social-connections';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { authClient } from '@/lib/auth';
import i18n, { requiredMessage } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { flattenErrors, isIOS } from '@/utils';
import { revalidateLogic, useForm } from '@tanstack/react-form';
import * as AppleAuthentication from 'expo-apple-authentication';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Pressable, TextInput, View } from 'react-native';
import { toast } from 'sonner-native';
import z from 'zod';

const schema = z.object({
  email: z.email({
    error: i18n.t('email', {
      ns: 'validation',
    }),
  }),
  password: z
    .string({
      error: requiredMessage(i18n.t('auth.common.password')),
    })
    .min(6, {
      error: i18n.t('password.minLength', {
        ns: 'validation',
        min: 6,
      }),
    }),
  rememberMe: z.boolean(),
});

export default function SignInScreen() {
  const { t } = useTranslation();

  const passwordInputRef = useRef<TextInput>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: schema,
    },
    onSubmit: async ({ value }) => {
      try {
        setIsLoading(true);
        const { error } = await authClient.signIn.email(value);
        if (error) {
          if (error.status === 403 && error.code === 'EMAIL_NOT_VERIFIED') {
            promptUserToVerifyEmail();
            return;
          }
          throw new Error(error.message);
        }

        router.replace('/(app)/(tabs)');
      } catch (error: any) {
        toast.error(error.message || t('auth.signIn.failed'));
      } finally {
        setIsLoading(false);
      }
    },
    onSubmitInvalid: () => {
      const { errors } = form.getAllErrors().form;
      const errorMessages = flattenErrors(errors);
      const errorMessage = errorMessages.length > 0 ? errorMessages[0] : t('auth.signIn.failed');

      toast.error(errorMessage);
    },
  });

  function promptUserToVerifyEmail() {
    Alert.alert(t('auth.signIn.verifyEmail'), t('auth.signIn.verifyEmailDescription'), [
      {
        text: t('common.ok'),
        onPress: () => {},
      },
      {
        text: t('auth.signIn.resendEmail'),
        style: 'default',
        onPress: resendVerificationEmail,
      },
    ]);
  }

  async function resendVerificationEmail() {
    const { error } = await authClient.sendVerificationEmail({
      email: form.getFieldValue('email'),
      callbackURL: '/(app)/(tabs)',
    });

    if (error) {
      toast.error(error.message || error.statusText);
    } else {
      toast.success(t('auth.signIn.resendEmailSuccess'), {
        description: t('auth.signIn.verifyEmailDescription'),
      });
    }
  }

  async function handleSocialSignIn(provider: SocialConnectionStrategyType) {
    try {
      // iOS 设备上使用 expo-apple-authentication 进行 Apple 登录，体验更好
      if (isIOS && provider === 'apple') {
        return handleSignInWithApple();
      }

      const { error } = await authClient.signIn.social({
        provider: provider,
        callbackURL: '/verify-email',
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error: any) {
      toast.error(error.message || t('auth.signIn.failed'));
    }
  }

  async function handleSignInWithApple() {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      if (!credential.identityToken) {
        throw new Error('Apple sign-in failed');
      }
      const { error } = await authClient.signIn.social({
        provider: 'apple',
        callbackURL: '/verify-email',
        idToken: {
          token: credential.identityToken,
        },
      });
      if (error) {
        throw new Error(error.message);
      }
    } catch (error: any) {
      if (error.code === 'ERR_REQUEST_CANCELED') {
        toast.warning(t('auth.signIn.userCanceled'));
      } else {
        toast.error(error.message || t('auth.signIn.failed'));
      }
    }
  }

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  function onSubmit() {
    form.handleSubmit();
  }

  function handleToSignUp() {
    router.push('/(auth)/sign-up');
  }

  function handleToForgetPassword() {
    router.push('/(auth)/forget-password');
  }

  return (
    <View className="gap-6">
      <Card className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">
            {t('auth.signIn.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <form.Field name="email">
              {(field) => (
                <>
                  <View className="gap-1.5">
                    <Label htmlFor={field.name}>{t('auth.common.email')}</Label>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      placeholder={t('auth.common.emailPlaceholder')}
                      keyboardType="email-address"
                      autoComplete="email"
                      autoCapitalize="none"
                      returnKeyType="next"
                      submitBehavior="submit"
                      onSubmitEditing={onEmailSubmitEditing}
                      className={cn(
                        !field.state.meta.isValid &&
                          'border-destructive focus-visible:ring-destructive/50'
                      )}
                    />
                  </View>
                </>
              )}
            </form.Field>

            <form.Field name="password">
              {(field) => (
                <>
                  <View className="gap-1.5">
                    <View className="flex-row items-center">
                      <Label htmlFor={field.name}> {t('auth.common.password')}</Label>
                      <Button
                        variant="link"
                        size="sm"
                        className="web:h-fit ml-auto h-4 px-1 py-0 sm:h-4"
                        onPress={handleToForgetPassword}>
                        <Text className="leading-4 font-normal">
                          {t('auth.signIn.forgotPassword')}
                        </Text>
                      </Button>
                    </View>
                    <Input
                      ref={passwordInputRef}
                      id={field.name}
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      placeholder={t('auth.common.passwordPlaceholder')}
                      secureTextEntry
                      returnKeyType="send"
                      onSubmitEditing={onSubmit}
                      className={cn(
                        !field.state.meta.isValid &&
                          'border-destructive focus-visible:ring-destructive/50'
                      )}
                    />
                  </View>
                </>
              )}
            </form.Field>

            <Button className="w-full" onPress={onSubmit}>
              <Text>{t('common.continue')}</Text>
              {isLoading && <ActivityIndicator animating={isLoading} />}
            </Button>
          </View>
          <Text className="text-center text-sm">
            {t('auth.signIn.noAccount')}{' '}
            <Pressable onPress={handleToSignUp}>
              <Text className="text-sm leading-none underline underline-offset-4">
                {t('auth.signIn.signUp')}
              </Text>
            </Pressable>
          </Text>
          <View className="flex-row items-center">
            <Separator className="flex-1" />
            <Text className="text-muted-foreground px-4 text-sm">{t('common.or')}</Text>
            <Separator className="flex-1" />
          </View>
          <SocialConnections strategies={['apple', 'google']} onAuthenticate={handleSocialSignIn} />
        </CardContent>
      </Card>
    </View>
  );
}
