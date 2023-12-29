import React from 'react';
import UserProvider  from '../Helpers/AuthProvider'
import Router from '../Helpers/Router'
import NavBar from '../components/Navbar';
function App() {
  return (
    
     <UserProvider>
       <NavBar />
        <Router /> 
     </UserProvider>
    
  );
}

export default App;