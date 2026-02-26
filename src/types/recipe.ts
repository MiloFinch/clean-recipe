export interface Recipe {
  id: string;
  title: string;
  url: string;
  imageUrl?: string;
  ingredients: string[];
  steps: string[];
  category?: string;
  tags: string[];
  cookTime?: string;
  servings?: string;
  createdAt: string;
}

export interface RecipeMetadata {
  categories: string[];
  tags: string[];
}

export interface ExtractedRecipe {
  title: string;
  url: string;
  imageUrl?: string;
  ingredients: string[];
  steps: string[];
  category?: string;
  tags: string[];
  cookTime?: string;
  servings?: string;
}
