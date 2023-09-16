import { Route, Routes } from 'react-router-dom';
import { AppShell, Container } from '@mantine/core';

import { Home, NotFound, Profile } from './pages';
import { ProtectedRoute, Header } from './components/';
import { Auth } from './components/Auth.tsx';
import { useUser } from './userContext.tsx';

function App() {
  const { loading, user } = useUser();

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <AppShell padding="md" header={<Header />}>
      <Container>
        <Routes>
          {/* todo: is this the correct way to switch elements in React Router */}
          <Route path="/" element={user ? <Home /> : <Auth />} />

          <Route
            path="profile"
            element={
              <ProtectedRoute user={user}>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
    </AppShell>
  );
}

export default App;
