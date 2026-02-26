import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';

import { useRecipes } from '../../../src/context/RecipesContext';
import { extractRecipeFromUrl } from '../../../src/services/recipeExtractor';
import { radii, spacing, typography, useThemeColors } from '../../../src/theme/tokens';
import type { ExtractedRecipe } from '../../../src/types/recipe';

function parseTags(raw: string): string[] {
  return raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function isValidUrl(value: string): boolean {
  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export default function AddRecipeScreen() {
  const colors = useThemeColors();
  const { addRecipe, categories, tags } = useRecipes();

  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [preview, setPreview] = useState<ExtractedRecipe | null>(null);

  const handleFetchRecipe = async () => {
    if (!isValidUrl(url)) {
      Alert.alert('Niepoprawny adres', 'Wprowadź poprawny link zaczynający się od http:// lub https://.');
      return;
    }

    setIsFetching(true);
    try {
      const extracted = await extractRecipeFromUrl(url.trim());
      setPreview(extracted);
      setCategory(extracted.category ?? '');
      setTagInput(extracted.tags.join(', '));
    } catch {
      Alert.alert('Błąd', 'Nie udało się pobrać przepisu. Spróbuj ponownie.');
    } finally {
      setIsFetching(false);
    }
  };

  const handleSave = async () => {
    if (!preview) {
      return;
    }

    setIsSaving(true);
    try {
      const saved = await addRecipe({
        ...preview,
        category: category.trim() || undefined,
        tags: parseTags(tagInput),
      });
      router.replace(`/(tabs)/recipes/${saved.id}`);
    } catch {
      Alert.alert('Błąd', 'Nie udało się zapisać przepisu.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.label, { color: colors.accent }]}>Link do przepisu</Text>
      <TextInput
        placeholder="https://..."
        placeholderTextColor={colors.subtleText}
        value={url}
        onChangeText={setUrl}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
        style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
      />

      <Pressable
        style={[styles.button, { backgroundColor: colors.primary }, isFetching && styles.disabled]}
        onPress={handleFetchRecipe}
        disabled={isFetching}
      >
        {isFetching ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Pobierz przepis</Text>
        )}
      </Pressable>

      {preview ? (
        <View style={[styles.previewCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.previewTitle, { color: colors.text }]}>{preview.title}</Text>
          <Text style={[styles.metaText, { color: colors.subtleText }]}>
            {preview.cookTime ? `Czas: ${preview.cookTime}` : 'Brak czasu przygotowania'}
          </Text>

          <Text style={[styles.label, { color: colors.accent }]}>Kategoria</Text>
          <TextInput
            placeholder="Np. Obiad"
            placeholderTextColor={colors.subtleText}
            value={category}
            onChangeText={setCategory}
            style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
          />

          <Text style={[styles.label, { color: colors.accent }]}>Tagi (oddziel przecinkiem)</Text>
          <TextInput
            placeholder="makaron, szybkie"
            placeholderTextColor={colors.subtleText}
            value={tagInput}
            onChangeText={setTagInput}
            style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
          />

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Składniki</Text>
          {preview.ingredients.map((ingredient) => (
            <Text key={ingredient} style={[styles.listItem, { color: colors.text }]}>• {ingredient}</Text>
          ))}

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Kroki</Text>
          {preview.steps.map((step, index) => (
            <Text key={`${index}-${step}`} style={[styles.listItem, { color: colors.text }]}>
              {index + 1}. {step}
            </Text>
          ))}

          <Pressable
            style={[styles.saveButton, { backgroundColor: colors.secondary }, isSaving && styles.disabled]}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Zapisz</Text>}
          </Pressable>
        </View>
      ) : null}

      {(categories.length > 0 || tags.length > 0) && !preview ? (
        <View style={[styles.tipCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.tipTitle, { color: colors.text }]}>Podpowiedzi</Text>
          {categories.length > 0 ? (
            <Text style={[styles.tipText, { color: colors.subtleText }]}>Kategorie: {categories.join(', ')}</Text>
          ) : null}
          {tags.length > 0 ? <Text style={[styles.tipText, { color: colors.subtleText }]}>Tagi: {tags.join(', ')}</Text> : null}
        </View>
      ) : null}
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
  label: {
    fontFamily: typography.body,
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: radii.button,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: 16,
    fontFamily: typography.body,
  },
  button: {
    borderRadius: radii.button,
    paddingVertical: spacing.sm + 4,
    alignItems: 'center',
  },
  saveButton: {
    marginTop: spacing.md,
    borderRadius: radii.button,
    paddingVertical: spacing.sm + 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    fontFamily: typography.body,
  },
  previewCard: {
    borderRadius: radii.card,
    borderWidth: 1,
    padding: spacing.md,
    gap: spacing.sm,
  },
  previewTitle: {
    fontFamily: typography.heading,
    fontSize: 26,
    marginBottom: spacing.xs,
  },
  metaText: {
    fontFamily: typography.body,
    fontSize: 14,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    marginTop: spacing.sm,
    fontFamily: typography.heading,
    fontSize: 20,
  },
  listItem: {
    fontFamily: typography.body,
    fontSize: 15,
    lineHeight: 22,
  },
  disabled: {
    opacity: 0.75,
  },
  tipCard: {
    borderRadius: radii.card,
    borderWidth: 1,
    padding: spacing.md,
    gap: spacing.sm,
  },
  tipTitle: {
    fontFamily: typography.heading,
    fontSize: 20,
  },
  tipText: {
    fontFamily: typography.body,
    fontSize: 14,
  },
});
