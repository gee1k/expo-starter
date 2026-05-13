import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Image, Platform, View } from 'react-native';
import { useUniwind } from 'uniwind';

export type SocialConnectionStrategyType = 'apple' | 'google' | 'github';
export type SocialConnectionStrategy = {
  type: SocialConnectionStrategyType;
  source: { uri: string };
  useTint: boolean;
};

const SOCIAL_CONNECTION_STRATEGIES: SocialConnectionStrategy[] = [
  {
    type: 'apple',
    source: { uri: 'https://img.clerk.com/static/apple.png?width=160' },
    useTint: true,
  },
  {
    type: 'google',
    source: { uri: 'https://img.clerk.com/static/google.png?width=160' },
    useTint: false,
  },
  {
    type: 'github',
    source: { uri: 'https://img.clerk.com/static/github.png?width=160' },
    useTint: true,
  },
];

export type SocialConnectionsProps = {
  strategies?: SocialConnectionStrategyType[];
  onAuthenticate?: (strategy: SocialConnectionStrategyType) => void;
};

export function SocialConnections({
  strategies = SOCIAL_CONNECTION_STRATEGIES.map((s) => s.type),
  onAuthenticate,
}: SocialConnectionsProps) {
  const { theme } = useUniwind();

  const strategiesToRender = SOCIAL_CONNECTION_STRATEGIES.filter((s) =>
    strategies.includes(s.type)
  );

  return (
    <View className="gap-2 sm:flex-row sm:gap-3">
      {strategiesToRender.map((strategy) => {
        return (
          <Button
            key={strategy.type}
            variant="outline"
            size="sm"
            className="sm:flex-1"
            onPress={() => {
              onAuthenticate?.(strategy.type);
            }}>
            <Image
              className={cn('size-4', strategy.useTint && Platform.select({ web: 'dark:invert' }))}
              tintColor={Platform.select({
                native: strategy.useTint ? (theme === 'dark' ? 'white' : 'black') : undefined,
              })}
              source={strategy.source}
            />
          </Button>
        );
      })}
    </View>
  );
}
