import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { loadMetadata, loadRecipes, saveMetadata, saveRecipes } from '../storage/recipeStorage';
import type { ExtractedRecipe, Recipe, RecipeMetadata } from '../types/recipe';

interface RecipesContextValue {
  recipes: Recipe[];
  categories: string[];
  tags: string[];
  isLoading: boolean;
  addRecipe: (recipe: ExtractedRecipe & { category?: string; tags?: string[] }) => Promise<Recipe>;
  addCategory: (name: string) => Promise<void>;
  removeCategory: (name: string) => Promise<void>;
  addTag: (name: string) => Promise<void>;
  removeTag: (name: string) => Promise<void>;
  getRecipeById: (id: string) => Recipe | undefined;
}

const RecipesContext = createContext<RecipesContextValue | undefined>(undefined);

function normalizeLabel(value: string): string {
  return value.trim();
}

function unique(values: string[]): string[] {
  return [...new Set(values.map((item) => normalizeLabel(item)).filter(Boolean))];
}

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function RecipesProvider({ children }: { children: React.ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [metadata, setMetadata] = useState<RecipeMetadata>({ categories: [], tags: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const [storedRecipes, storedMetadata] = await Promise.all([loadRecipes(), loadMetadata()]);
      setRecipes(storedRecipes);
      setMetadata(storedMetadata);
      setIsLoading(false);
    };

    void bootstrap();
  }, []);

  const persistRecipes = useCallback(async (nextRecipes: Recipe[]) => {
    setRecipes(nextRecipes);
    await saveRecipes(nextRecipes);
  }, []);

  const persistMetadata = useCallback(async (nextMetadata: RecipeMetadata) => {
    setMetadata(nextMetadata);
    await saveMetadata(nextMetadata);
  }, []);

  const addRecipe = useCallback(
    async (source: ExtractedRecipe & { category?: string; tags?: string[] }) => {
      const cleanCategory = source.category ? normalizeLabel(source.category) : undefined;
      const cleanTags = unique(source.tags ?? []);

      const recipe: Recipe = {
        id: createId(),
        title: source.title,
        url: source.url,
        imageUrl: source.imageUrl,
        ingredients: source.ingredients,
        steps: source.steps,
        category: cleanCategory,
        tags: cleanTags,
        cookTime: source.cookTime,
        servings: source.servings,
        createdAt: new Date().toISOString(),
      };

      const nextRecipes = [recipe, ...recipes];
      await persistRecipes(nextRecipes);

      const nextMetadata: RecipeMetadata = {
        categories: unique([...metadata.categories, ...(cleanCategory ? [cleanCategory] : [])]),
        tags: unique([...metadata.tags, ...cleanTags]),
      };
      await persistMetadata(nextMetadata);

      return recipe;
    },
    [metadata.categories, metadata.tags, persistMetadata, persistRecipes, recipes],
  );

  const addCategory = useCallback(
    async (name: string) => {
      const cleanName = normalizeLabel(name);
      if (!cleanName) {
        return;
      }

      await persistMetadata({
        ...metadata,
        categories: unique([...metadata.categories, cleanName]),
      });
    },
    [metadata, persistMetadata],
  );

  const removeCategory = useCallback(
    async (name: string) => {
      const cleanName = normalizeLabel(name);

      const nextMetadata: RecipeMetadata = {
        ...metadata,
        categories: metadata.categories.filter((item) => item !== cleanName),
      };

      const nextRecipes = recipes.map((recipe) =>
        recipe.category === cleanName ? { ...recipe, category: undefined } : recipe,
      );

      await Promise.all([persistMetadata(nextMetadata), persistRecipes(nextRecipes)]);
    },
    [metadata, persistMetadata, persistRecipes, recipes],
  );

  const addTag = useCallback(
    async (name: string) => {
      const cleanName = normalizeLabel(name);
      if (!cleanName) {
        return;
      }

      await persistMetadata({
        ...metadata,
        tags: unique([...metadata.tags, cleanName]),
      });
    },
    [metadata, persistMetadata],
  );

  const removeTag = useCallback(
    async (name: string) => {
      const cleanName = normalizeLabel(name);

      const nextMetadata: RecipeMetadata = {
        ...metadata,
        tags: metadata.tags.filter((item) => item !== cleanName),
      };

      const nextRecipes = recipes.map((recipe) => ({
        ...recipe,
        tags: recipe.tags.filter((item) => item !== cleanName),
      }));

      await Promise.all([persistMetadata(nextMetadata), persistRecipes(nextRecipes)]);
    },
    [metadata, persistMetadata, persistRecipes, recipes],
  );

  const categories = useMemo(() => {
    const fromRecipes = recipes
      .map((recipe) => recipe.category)
      .filter((category): category is string => Boolean(category));
    return unique([...metadata.categories, ...fromRecipes]);
  }, [metadata.categories, recipes]);

  const tags = useMemo(() => {
    const fromRecipes = recipes.flatMap((recipe) => recipe.tags);
    return unique([...metadata.tags, ...fromRecipes]);
  }, [metadata.tags, recipes]);

  const getRecipeById = useCallback(
    (id: string) => recipes.find((recipe) => recipe.id === id),
    [recipes],
  );

  const value = useMemo<RecipesContextValue>(
    () => ({
      recipes,
      categories,
      tags,
      isLoading,
      addRecipe,
      addCategory,
      removeCategory,
      addTag,
      removeTag,
      getRecipeById,
    }),
    [addCategory, addRecipe, addTag, categories, getRecipeById, isLoading, recipes, removeCategory, removeTag, tags],
  );

  return <RecipesContext.Provider value={value}>{children}</RecipesContext.Provider>;
}

export function useRecipes() {
  const context = useContext(RecipesContext);
  if (!context) {
    throw new Error('useRecipes must be used within RecipesProvider');
  }

  return context;
}
