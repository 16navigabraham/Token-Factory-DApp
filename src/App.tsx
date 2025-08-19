import React from 'react';
import TokenFactory from './components/TokenFactory';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#5f4a4aff',
            color: '#fff',
          },
          success: {
            style: {
              background: '#195981ffff',
            },
          },
          error: {
            style: {
              background: '#653131ff',
            },
          },
        }}
      />
      <TokenFactory />
    </>
  );
}

export default App;