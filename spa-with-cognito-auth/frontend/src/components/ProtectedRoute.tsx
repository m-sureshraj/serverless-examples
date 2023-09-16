import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

import { User } from '../types.ts';

interface Props {
  user: User | null;
  children: ReactNode;
}

export function ProtectedRoute({ user, children }: Props) {
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
