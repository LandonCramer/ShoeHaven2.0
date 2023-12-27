import React from 'react';
import { AuthProvider } from './Helpers/AuthProvider'
import Router from './Helpers/Router'

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;