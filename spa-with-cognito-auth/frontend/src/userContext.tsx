import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { User } from './types.ts';
import { getUser, logout as _logout } from './service.ts';

interface InitialUserContext {
  user: User | null;
  error: string | null;
  loading: boolean;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
}

const UserContext = createContext<InitialUserContext | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export function UserProvider({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getUser()
      .then(user => {
        setUser(user);
      })
      .catch(error => {
        console.log('An error occurred while fetching the user', error);
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function logout() {
    try {
      setLoading(true);
      await _logout();
      setUser(null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const memoizedValue = useMemo(
    () => ({
      user,
      loading,
      error,
      logout,
      setUser,
    }),
    [user, loading, error]
  );

  return <UserContext.Provider value={memoizedValue}>{children}</UserContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error('useUser hook must be used within a UserProvider');
  }

  return context;
}
