import { useMemo } from 'react';
import { authClient } from './auth-client';

export function useAuthUser() {
  const { data: session } = authClient.useSession();
  const user = useMemo(() => session?.user, [session?.user]);
  return { user, session };
}
