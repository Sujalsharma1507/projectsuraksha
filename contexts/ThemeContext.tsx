import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

type ThemeMode = 'light' | 'dark';

interface ThemeColors {
  background: string;
  surface: string;
  card: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  danger: string;
  dangerLight: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  text: string;
  textSecondary: string;
  textLight: string;
  border: string;
  shadow: string;
}

const lightTheme: ThemeColors = {
  background: '#FFFFFF',
  surface: '#F8F9FA',
  card: '#FFFFFF',
  primary: '#FF4757',
  primaryLight: '#FFE5E8',
  primaryDark: '#E63946',
  secondary: '#5F27CD',
  danger: '#EE5A6F',
  dangerLight: '#FFEBEE',
  success: '#26DE81',
  successLight: '#E8F5E9',
  warning: '#FED330',
  warningLight: '#FFF8E1',
  text: '#2D3436',
  textSecondary: '#636E72',
  textLight: '#B2BEC3',
  border: '#DFE6E9',
  shadow: '#00000015',
};

const darkTheme: ThemeColors = {
  background: '#0D1117',
  surface: '#161B22',
  card: '#1C2128',
  primary: '#FF4757',
  primaryLight: '#2D1619',
  primaryDark: '#FF6B7A',
  secondary: '#7F39FB',
  danger: '#EE5A6F',
  dangerLight: '#2D1619',
  success: '#26DE81',
  successLight: '#0D2818',
  warning: '#FED330',
  warningLight: '#2D2712',
  text: '#E6EDF3',
  textSecondary: '#8B949E',
  textLight: '#6E7681',
  border: '#30363D',
  shadow: '#00000040',
};

interface ThemeContextType {
  theme: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemTheme = useColorScheme();
  const { user } = useAuth();
  const [theme, setThemeState] = useState<ThemeMode>('light');

  useEffect(() => {
    loadTheme();
  }, [user]);

  const loadTheme = async () => {
    if (user) {
      const { data } = await supabase
        .from('user_settings')
        .select('theme')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data?.theme) {
        setThemeState(data.theme as ThemeMode);
      } else {
        setThemeState((systemTheme as ThemeMode) || 'light');
      }
    } else {
      setThemeState((systemTheme as ThemeMode) || 'light');
    }
  };

  const setTheme = async (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    if (user) {
      await supabase
        .from('user_settings')
        .update({ theme: newTheme, updated_at: new Date().toISOString() })
        .eq('user_id', user.id);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const colors = theme === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
