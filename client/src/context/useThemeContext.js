import { useContext } from 'react';
import { ThemeContext } from './ThemeContext.jsx';

export const useThemeContext = () => useContext(ThemeContext);
