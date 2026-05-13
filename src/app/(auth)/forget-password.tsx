import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { authClient } from '@/lib/auth';
import i18n from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { debugLog, flattenErrors } from '@/utils';
import { revalidateLogic, useForm } from '@tanstack/react-form';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { toast } from 'sonner-native';
import { z } from 'zod';

const schema = z.object({
  email: z.email({
    error: i18n.t('email', {
      ns: 'validation',
    }),
  }),
});
type ForgetPasswordForm = z.infer<typeof schema>;

export default function ForgetPasswordScreen() {
  const { t } = useTranslation();

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    defaultValues: {
      email: '',
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: schema,
    },
    onSubmit: async ({ value }) => {
      try {
        setIsLoading(true);

        const { data, error } = await authClient.requestPasswordReset({
          email: value.email,
          redirectTo: '/reset-password',
        });

        debugLog('ForgetPassword data:', data, error);

        if (error) {
          throw new Error(error.message);
        }

        toast.success(t('auth.forgetPassword.success'));
      } catch (error: any) {
        toast.error(error.message || t('auth.forgetPassword.failed'));
      } finally {
        setIsLoading(false);
      }
    },
    onSubmitInvalid: () => {
      const { errors } = form.getAllErrors().form;
      const errorMessages = flattenErrors(errors);
      const errorMessage =
        errorMessages.length > 0 ? errorMessages[0] : t('auth.forgetPassword.failed');

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
            {t('auth.forgetPassword.title')}
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
              <Text>{t('auth.forgetPassword.submit')}</Text>
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
