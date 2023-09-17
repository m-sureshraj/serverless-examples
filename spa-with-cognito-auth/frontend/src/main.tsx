import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';

import { UserProvider } from './userContext.tsx';

import App from './App.tsx';

const rootElement = document.getElementById('root') as HTMLElement;

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <UserProvider>
          <App />
        </UserProvider>
      </MantineProvider>
    </BrowserRouter>
  </React.StrictMode>
);
