import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { authClient } from '@/lib/auth';
import i18n, { requiredMessage } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { flattenErrors } from '@/utils';
import { revalidateLogic, useForm } from '@tanstack/react-form';
import { router } from 'expo-router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, TextInput, View } from 'react-native';
import { toast } from 'sonner-native';
import z from 'zod';

const schema = z.object({
  name: z
    .string({
      error: requiredMessage(i18n.t('auth.common.name')),
    })
    .min(1, {
      error: i18n.t('required', {
        ns: 'validation',
        field: i18n.t('auth.common.name'),
      }),
    }),
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
});

export default function SignUpScreen() {
  const { t } = useTranslation();

  const emailInputRef = React.useRef<TextInput>(null);
  const passwordInputRef = React.useRef<TextInput>(null);

  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: schema,
    },
    onSubmit: async ({ value }) => {
      try {
        setIsLoading(true);

        const { data, error } = await authClient.signUp.email({
          name: value.name,
          email: value.email,
          password: value.password,
          clientId: 170,
          callbackURL: '/verify-email',
        });

        if (error) {
          throw new Error(error.message);
        }

        toast.success(t('auth.signUp.success'), {
          description: t('auth.signUp.successDescription'),
        });

        if (data?.user.emailVerified) {
          router.replace('/(app)/(tabs)');
        } else {
          router.push({
            pathname: '/(auth)/sign-in',
            params: {
              email: value.email,
              password: value.password,
            },
          });
        }
      } catch (error: any) {
        toast.error(error.message || t('auth.signUp.failed'));
      } finally {
        setIsLoading(false);
      }
    },
    onSubmitInvalid: () => {
      const { errors } = form.getAllErrors().form;
      const errorMessages = flattenErrors(errors);
      const errorMessage = errorMessages.length > 0 ? errorMessages[0] : t('auth.signUp.failed');

      toast.error(errorMessage);
    },
  });

  function onNameSubmitEditing() {
    emailInputRef.current?.focus();
  }

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  function onSubmit() {
    form.handleSubmit();
  }

  const handleToSignIn = () => {
    router.push('/(auth)/sign-in');
  };

  return (
    <View className="gap-6">
      <Card className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">
            {t('auth.signUp.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <form.Field name="name">
              {(field) => (
                <>
                  <View className="gap-1.5">
                    <Label htmlFor={field.name}>{t('auth.common.name')}</Label>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      placeholder={t('auth.common.namePlaceholder')}
                      keyboardType="default"
                      autoComplete="name"
                      autoCapitalize="words"
                      returnKeyType="next"
                      submitBehavior="submit"
                      onSubmitEditing={onNameSubmitEditing}
                      className={cn(
                        !field.state.meta.isValid &&
                          'border-destructive focus-visible:ring-destructive/50'
                      )}
                    />
                  </View>
                </>
              )}
            </form.Field>

            <form.Field name="email">
              {(field) => (
                <>
                  <View className="gap-1.5">
                    <Label htmlFor={field.name}>{t('auth.common.email')}</Label>
                    <Input
                      ref={emailInputRef}
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
            {t('auth.signUp.alreadyHaveAccount')}{' '}
            <Pressable onPress={handleToSignIn}>
              <Text className="text-sm leading-none underline underline-offset-4">
                {t('auth.signUp.backToSignIn')}
              </Text>
            </Pressable>
          </Text>
        </CardContent>
      </Card>
    </View>
  );
}
