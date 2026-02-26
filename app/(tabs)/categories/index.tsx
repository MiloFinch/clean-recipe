import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { useRecipes } from '../../../src/context/RecipesContext';
import { radii, spacing, typography, useThemeColors } from '../../../src/theme/tokens';

function countBy<T extends string | undefined>(values: T[]): Record<string, number> {
  return values.reduce<Record<string, number>>((accumulator, value) => {
    if (!value) {
      return accumulator;
    }

    accumulator[value] = (accumulator[value] ?? 0) + 1;
    return accumulator;
  }, {});
}

export default function CategoriesScreen() {
  const colors = useThemeColors();
  const { recipes, categories, tags, addCategory, removeCategory, addTag, removeTag } = useRecipes();

  const [newCategory, setNewCategory] = useState('');
  const [newTag, setNewTag] = useState('');

  const categoryUsage = useMemo(() => countBy(recipes.map((recipe) => recipe.category)), [recipes]);
  const tagUsage = useMemo(() => {
    return recipes.flatMap((recipe) => recipe.tags).reduce<Record<string, number>>((accumulator, tag) => {
      accumulator[tag] = (accumulator[tag] ?? 0) + 1;
      return accumulator;
    }, {});
  }, [recipes]);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      return;
    }
    await addCategory(newCategory);
    setNewCategory('');
  };

  const handleAddTag = async () => {
    if (!newTag.trim()) {
      return;
    }
    await addTag(newTag);
    setNewTag('');
  };

  const confirmDeleteCategory = (name: string) => {
    Alert.alert('Usuń kategorię', `Usunąć kategorię "${name}" z zapisanych przepisów?`, [
      { text: 'Anuluj', style: 'cancel' },
      {
        text: 'Usuń',
        style: 'destructive',
        onPress: () => {
          void removeCategory(name);
        },
      },
    ]);
  };

  const confirmDeleteTag = (name: string) => {
    Alert.alert('Usuń tag', `Usunąć tag "${name}" z zapisanych przepisów?`, [
      { text: 'Anuluj', style: 'cancel' },
      {
        text: 'Usuń',
        style: 'destructive',
        onPress: () => {
          void removeTag(name);
        },
      },
    ]);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Kategorie</Text>
        <View style={styles.row}>
          <TextInput
            placeholder="Dodaj kategorię"
            placeholderTextColor={colors.subtleText}
            value={newCategory}
            onChangeText={setNewCategory}
            style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
          />
          <Pressable style={[styles.addButton, { backgroundColor: colors.primary }]} onPress={handleAddCategory}>
            <Text style={styles.addButtonText}>Dodaj</Text>
          </Pressable>
        </View>

        <View style={styles.listWrap}>
          {categories.length > 0 ? (
            categories.map((category) => (
              <View key={category} style={[styles.listItem, { borderColor: colors.border }]}>
                <View>
                  <Text style={[styles.itemTitle, { color: colors.text }]}>{category}</Text>
                  <Text style={[styles.itemMeta, { color: colors.subtleText }]}>
                    {categoryUsage[category] ?? 0} przepisów
                  </Text>
                </View>
                <Pressable onPress={() => confirmDeleteCategory(category)}>
                  <Text style={[styles.removeText, { color: colors.secondary }]}>Usuń</Text>
                </Pressable>
              </View>
            ))
          ) : (
            <Text style={[styles.itemMeta, { color: colors.subtleText }]}>Brak kategorii</Text>
          )}
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Tagi</Text>
        <View style={styles.row}>
          <TextInput
            placeholder="Dodaj tag"
            placeholderTextColor={colors.subtleText}
            value={newTag}
            onChangeText={setNewTag}
            style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
          />
          <Pressable style={[styles.addButton, { backgroundColor: colors.secondary }]} onPress={handleAddTag}>
            <Text style={styles.addButtonText}>Dodaj</Text>
          </Pressable>
        </View>

        <View style={styles.listWrap}>
          {tags.length > 0 ? (
            tags.map((tag) => (
              <View key={tag} style={[styles.listItem, { borderColor: colors.border }]}>
                <View>
                  <Text style={[styles.itemTitle, { color: colors.text }]}>{tag}</Text>
                  <Text style={[styles.itemMeta, { color: colors.subtleText }]}>{tagUsage[tag] ?? 0} przepisów</Text>
                </View>
                <Pressable onPress={() => confirmDeleteTag(tag)}>
                  <Text style={[styles.removeText, { color: colors.secondary }]}>Usuń</Text>
                </Pressable>
              </View>
            ))
          ) : (
            <Text style={[styles.itemMeta, { color: colors.subtleText }]}>Brak tagów</Text>
          )}
        </View>
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
  card: {
    borderWidth: 1,
    borderRadius: radii.card,
    padding: spacing.md,
    gap: spacing.sm,
  },
  sectionTitle: {
    fontFamily: typography.heading,
    fontSize: 26,
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radii.button,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: typography.body,
    fontSize: 15,
  },
  addButton: {
    borderRadius: radii.button,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontFamily: typography.body,
    fontWeight: '700',
  },
  listWrap: {
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radii.button,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  itemTitle: {
    fontFamily: typography.body,
    fontSize: 16,
    fontWeight: '600',
  },
  itemMeta: {
    fontFamily: typography.body,
    fontSize: 13,
  },
  removeText: {
    fontFamily: typography.body,
    fontSize: 14,
    fontWeight: '700',
  },
});
