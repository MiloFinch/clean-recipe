import { router } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { useRecipes } from '../../../src/context/RecipesContext';
import { radii, spacing, typography, useThemeColors } from '../../../src/theme/tokens';
import type { Recipe } from '../../../src/types/recipe';

function RecipeCard({ item }: { item: Recipe }) {
  const colors = useThemeColors();

  return (
    <Pressable
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => router.push(`/(tabs)/recipes/${item.id}`)}
    >
      <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
      <View style={styles.metaRow}>
        {item.category ? (
          <View style={[styles.chip, { backgroundColor: `${colors.primary}22` }]}>
            <Text style={[styles.chipText, { color: colors.primary }]}>{item.category}</Text>
          </View>
        ) : null}
        {item.cookTime ? <Text style={[styles.metaText, { color: colors.subtleText }]}>{item.cookTime}</Text> : null}
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const { recipes, isLoading } = useRecipes();
  const colors = useThemeColors();

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, recipes.length === 0 && styles.center]}
        renderItem={({ item }) => <RecipeCard item={item} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Brak zapisanych przepisów</Text>
            <Text style={[styles.emptyText, { color: colors.subtleText }]}>Wklej link do przepisu</Text>
          </View>
        }
      />

      <Pressable
        style={[styles.fab, { backgroundColor: colors.secondary }]}
        onPress={() => router.push('/(tabs)/recipes/add')}
      >
        <Text style={styles.fabLabel}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: spacing.md,
    gap: spacing.sm,
    paddingBottom: spacing.xl * 2,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    borderRadius: radii.card,
    borderWidth: 1,
    padding: spacing.md,
    gap: spacing.sm,
  },
  title: {
    fontFamily: typography.heading,
    fontSize: 22,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  chipText: {
    fontFamily: typography.body,
    fontSize: 12,
    fontWeight: '600',
  },
  metaText: {
    fontFamily: typography.body,
    fontSize: 13,
  },
  emptyState: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  emptyTitle: {
    fontFamily: typography.heading,
    fontSize: 24,
  },
  emptyText: {
    fontFamily: typography.body,
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  fabLabel: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '600',
  },
});
