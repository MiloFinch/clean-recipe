import { Tabs } from 'expo-router';

import { useThemeColors } from '../../src/theme/tokens';

export default function TabsLayout() {
  const colors = useThemeColors();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subtleText,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="recipes"
        options={{
          title: '🏠 Przepisy',
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: '📁 Kategorie',
        }}
      />
    </Tabs>
  );
}
