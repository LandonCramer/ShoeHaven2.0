import React, { useState, useEffect } from "react";
import UserProvider  from '../Helpers/AuthProvider'
import Router from '../Helpers/Router'
import NavBar from '../components/Navbar';
import './DarkMode.css'
function App() {
  
    const [isDark, setIsDark] = useState(() => {
        const darkModePreference = localStorage.getItem('darkMode') === 'enabled';
        return darkModePreference;
    });
    

    // Apply dark mode class to HTML element based on initial state
    useEffect(() => {
        document.querySelector('html').classList.toggle('dark-mode', isDark);
    }, [isDark]);

    const toggleDarkMode = () => {
        const newDarkModeValue = !isDark;
        setIsDark(newDarkModeValue);
        localStorage.setItem('darkMode', newDarkModeValue ? 'enabled' : 'disabled');
    };

  return (
     <UserProvider>
       <NavBar toggleDarkMode={toggleDarkMode} />
       <div className={`app-container ${isDark ? 'dark-mode' : ''}`}>
                <Router />
            </div>
     </UserProvider>
    
  );
}

export default App;