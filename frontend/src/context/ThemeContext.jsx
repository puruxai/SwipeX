import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Lock strictly to light mode as instructed by the new design direction
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark');
    localStorage.setItem('swipex_theme', 'light');
  }, []);

  const toggleTheme = () => {
    // No-op to prevent theme toggling
  };

  return (
    <ThemeContext.Provider value={{ theme: 'light', toggleTheme, setTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
