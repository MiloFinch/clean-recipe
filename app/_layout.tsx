import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { RecipesProvider } from '../src/context/RecipesContext';
import { useThemeColors } from '../src/theme/tokens';

function RootNavigator() {
  const colors = useThemeColors();

  return (
    <>
      <StatusBar style={colors.isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <RecipesProvider>
      <RootNavigator />
    </RecipesProvider>
  );
}
