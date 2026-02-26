import { useMemo, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useRecipes } from '../../../src/context/RecipesContext';
import { radii, spacing, typography, useThemeColors } from '../../../src/theme/tokens';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useThemeColors();
  const { getRecipeById } = useRecipes();
  const recipe = useMemo(() => (id ? getRecipeById(id) : undefined), [getRecipeById, id]);

  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});

  const toggleIngredient = (ingredient: string) => {
    setCheckedIngredients((previous) => ({
      ...previous,
      [ingredient]: !previous[ingredient],
    }));
  };

  if (!recipe) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.notFound, { color: colors.text }]}>Przepis nie istnieje.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <View style={[styles.headerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>{recipe.title}</Text>
        {recipe.imageUrl ? <Image source={{ uri: recipe.imageUrl }} style={styles.image} /> : null}

        <View style={styles.metaRow}>
          {recipe.category ? (
            <View style={[styles.chip, { backgroundColor: `${colors.primary}22` }]}>
              <Text style={[styles.chipText, { color: colors.primary }]}>{recipe.category}</Text>
            </View>
          ) : null}
          {recipe.cookTime ? <Text style={[styles.metaText, { color: colors.subtleText }]}>{recipe.cookTime}</Text> : null}
          {recipe.servings ? <Text style={[styles.metaText, { color: colors.subtleText }]}>{recipe.servings} porcji</Text> : null}
        </View>
      </View>

      <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Składniki</Text>
        {recipe.ingredients.map((ingredient) => {
          const checked = checkedIngredients[ingredient] ?? false;

          return (
            <Pressable key={ingredient} onPress={() => toggleIngredient(ingredient)} style={styles.ingredientRow}>
              <View
                style={[
                  styles.checkbox,
                  {
                    borderColor: checked ? colors.primary : colors.border,
                    backgroundColor: checked ? colors.primary : 'transparent',
                  },
                ]}
              >
                {checked ? <Text style={styles.checkmark}>✓</Text> : null}
              </View>
              <Text
                style={[
                  styles.ingredientText,
                  {
                    color: checked ? colors.subtleText : colors.text,
                    textDecorationLine: checked ? 'line-through' : 'none',
                  },
                ]}
              >
                {ingredient}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Przygotowanie</Text>
        {recipe.steps.map((step, index) => (
          <Text key={`${index}-${step}`} style={[styles.stepText, { color: colors.text }]}>
            {index + 1}. {step}
          </Text>
        ))}
      </View>

      <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Tagi</Text>
        <View style={styles.tagsWrap}>
          {recipe.tags.length > 0 ? (
            recipe.tags.map((tag) => (
              <View key={tag} style={[styles.tagPill, { backgroundColor: `${colors.secondary}22` }]}>
                <Text style={[styles.tagText, { color: colors.secondary }]}>#{tag}</Text>
              </View>
            ))
          ) : (
            <Text style={[styles.metaText, { color: colors.subtleText }]}>Brak tagów</Text>
          )}
        </View>
      </View>

      <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Źródło</Text>
        <Text style={[styles.sourceText, { color: colors.subtleText }]}>{recipe.url}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFound: {
    fontFamily: typography.heading,
    fontSize: 22,
  },
  headerCard: {
    borderRadius: radii.card,
    borderWidth: 1,
    padding: spacing.md,
    gap: spacing.sm,
  },
  title: {
    fontFamily: typography.heading,
    fontSize: 30,
    lineHeight: 36,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: radii.card,
    marginTop: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    alignItems: 'center',
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  chipText: {
    fontFamily: typography.body,
    fontWeight: '600',
    fontSize: 13,
  },
  metaText: {
    fontFamily: typography.body,
    fontSize: 14,
  },
  sectionCard: {
    borderRadius: radii.card,
    borderWidth: 1,
    padding: spacing.md,
    gap: spacing.sm,
  },
  sectionTitle: {
    fontFamily: typography.heading,
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  ingredientText: {
    flex: 1,
    fontFamily: typography.body,
    fontSize: 16,
    lineHeight: 22,
  },
  stepText: {
    fontFamily: typography.body,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: spacing.xs,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tagPill: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 999,
  },
  tagText: {
    fontFamily: typography.body,
    fontSize: 13,
    fontWeight: '600',
  },
  sourceText: {
    fontFamily: typography.body,
    fontSize: 14,
  },
});
