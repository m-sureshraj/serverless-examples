import { Route, Routes } from 'react-router-dom';
import { AppShell, Container } from '@mantine/core';

import { Home, NotFound, Profile } from './pages';
import { ProtectedRoute, Header, Auth, PageLoader } from './components';
import { useUser } from './userContext.tsx';

function App() {
  const { loading, user } = useUser();

  if (loading) {
    return <PageLoader />;
  }

  return (
    <AppShell padding="md" header={<Header />}>
      <Container>
        <Routes>
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
