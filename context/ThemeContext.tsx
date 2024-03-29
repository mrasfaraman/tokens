import React, {createContext, useState, useEffect, ReactNode} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Theme} from './Themes';
import themes from './Themes';
import {Appearance} from 'react-native';

type ThemeContextType = {
  theme: Theme;
  switchTheme: (themeName: string) => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: themes.theme1,
  switchTheme: () => {},
});

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider = ({children}: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(themes.theme1);

  useEffect(() => {
    // Load theme from storage on mount
    AsyncStorage.getItem('theme').then(storedTheme => {
      if (storedTheme && themes[storedTheme]) {
        setTheme(themes[storedTheme]);
      }
      if (storedTheme == null) {
        const colorScheme = Appearance.getColorScheme();
        if (colorScheme === 'dark') {
          // Use dark color scheme
          setTheme(themes['theme1']);
        } else setTheme(themes['theme2']);
      }
    });
  }, []);

  const switchTheme = (themeName: string) => {
    setTheme(themes[themeName]);
    AsyncStorage.setItem('theme', themeName);
  };

  return (
    <ThemeContext.Provider value={{theme, switchTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};
