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
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { toast } from 'sonner-native';
import { z } from 'zod';

const schema = z.object({
  newPassword: z
    .string({
      error: requiredMessage(i18n.t('auth.common.newPassword')),
    })
    .min(6, {
      error: i18n.t('password.minLength', {
        ns: 'validation',
        min: 6,
      }),
    }),
});
type ResetPasswordForm = z.infer<typeof schema>;

export default function ResetPasswordScreen() {
  const { t } = useTranslation();

  const router = useRouter();
  const { token } = useLocalSearchParams();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    defaultValues: {
      newPassword: '',
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: schema,
    },
    onSubmit: async ({ value }) => {
      try {
        if (!token || typeof token !== 'string') {
          throw new Error(t('auth.resetPassword.invalidToken'));
        }

        setIsLoading(true);
        const { data, error } = await authClient.resetPassword({
          newPassword: value.newPassword,
          token: token,
        });

        if (error) {
          throw new Error(error.message);
        }

        toast.success(t('auth.resetPassword.success'));

        router.replace('/(auth)/sign-in');
      } catch (error: any) {
        toast.error(error.message || t('auth.resetPassword.failed'));
      } finally {
        setIsLoading(false);
      }
    },
    onSubmitInvalid: () => {
      const { errors } = form.getAllErrors().form;
      const errorMessages = flattenErrors(errors);
      const errorMessage =
        errorMessages.length > 0 ? errorMessages[0] : t('auth.resetPassword.failed');

      toast.error(errorMessage);
    },
  });

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
            {t('auth.resetPassword.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <View className="flex-row items-center">
                <Label htmlFor="password">{t('auth.common.newPassword')}</Label>
              </View>
              <Input
                id="password"
                secureTextEntry
                returnKeyType="next"
                submitBehavior="submit"
                onSubmitEditing={onSubmit}
              />
            </View>

            <form.Field name="newPassword">
              {(field) => (
                <>
                  <View className="gap-1.5">
                    <View className="flex-row items-center">
                      <Label htmlFor={field.name}>{t('auth.common.newPassword')}</Label>
                    </View>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      placeholder={t('auth.common.newPasswordPlaceholder')}
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
              <Text>{t('auth.resetPassword.submit')}</Text>
              {isLoading && <ActivityIndicator animating={isLoading} />}
            </Button>
          </View>

          <View className="text-center">
            <Pressable onPress={handleToSignIn}>
              <Text className="text-center text-sm leading-none underline underline-offset-4">
                {t('auth.signUp.backToSignIn')}
              </Text>
            </Pressable>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
