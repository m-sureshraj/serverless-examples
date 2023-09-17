import { useSearchParams } from 'react-router-dom';

import { useUser } from '../userContext.tsx';

export function Home() {
  const { user } = useUser();
  const [searchParams] = useSearchParams();
  const isLoginFailed = searchParams.get('error') === 'auth_failed';

  return (
    <>
      <h2>Welcome to the App</h2>

      {isLoginFailed && <p>An error occurred while logging you in. Try again!</p>}

      <pre>{JSON.stringify(user, null, 2)}</pre>
    </>
  );
}
