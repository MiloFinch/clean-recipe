import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Recipe, RecipeMetadata } from '../types/recipe';

const RECIPES_KEY = 'cleanrecipe:recipes';
const METADATA_KEY = 'cleanrecipe:metadata';

const EMPTY_METADATA: RecipeMetadata = {
  categories: [],
  tags: [],
};

export async function loadRecipes(): Promise<Recipe[]> {
  try {
    const raw = await AsyncStorage.getItem(RECIPES_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as Recipe[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveRecipes(recipes: Recipe[]): Promise<void> {
  await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
}

export async function loadMetadata(): Promise<RecipeMetadata> {
  try {
    const raw = await AsyncStorage.getItem(METADATA_KEY);
    if (!raw) {
      return EMPTY_METADATA;
    }
    const parsed = JSON.parse(raw) as Partial<RecipeMetadata>;

    return {
      categories: Array.isArray(parsed.categories) ? parsed.categories : [],
      tags: Array.isArray(parsed.tags) ? parsed.tags : [],
    };
  } catch {
    return EMPTY_METADATA;
  }
}

export async function saveMetadata(metadata: RecipeMetadata): Promise<void> {
  await AsyncStorage.setItem(METADATA_KEY, JSON.stringify(metadata));
}
