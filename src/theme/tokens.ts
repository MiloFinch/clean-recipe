import { useColorScheme } from 'react-native';

export const palette = {
  background: '#FFFBF5',
  primary: '#16A34A',
  secondary: '#EA580C',
  accent: '#78350F',
  darkBackground: '#1A1A1A',
  darkCard: '#2D2D2D',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radii = {
  card: 16,
  button: 12,
} as const;

export const typography = {
  heading: 'serif',
  body: 'sans-serif',
} as const;

export function useThemeColors() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return {
    isDark,
    background: isDark ? palette.darkBackground : palette.background,
    card: isDark ? palette.darkCard : '#FFFFFF',
    text: isDark ? '#F8F5EF' : '#1F2937',
    subtleText: isDark ? '#C8C8C8' : '#6B7280',
    border: isDark ? '#3F3F46' : '#E5E7EB',
    primary: palette.primary,
    secondary: palette.secondary,
    accent: palette.accent,
  };
}
