import { Stack } from 'expo-router';

import { typography, useThemeColors } from '../../../src/theme/tokens';

export default function RecipesStackLayout() {
  const colors = useThemeColors();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontFamily: typography.heading,
          fontSize: 20,
        },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'CleanRecipe',
        }}
      />
      <Stack.Screen
        name="add"
        options={{
          title: 'Dodaj Przepis',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Szczegóły',
        }}
      />
    </Stack>
  );
}
