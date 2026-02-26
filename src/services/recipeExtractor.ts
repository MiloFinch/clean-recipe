import type { ExtractedRecipe } from '../types/recipe';

export async function extractRecipeFromUrl(url: string): Promise<ExtractedRecipe> {
  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), 3000);
  try {
    await fetch(url, { method: 'GET', signal: abortController.signal });
  } catch {
    // MVP extractor ignores network failures and still returns mock data.
  } finally {
    clearTimeout(timeout);
  }

  await new Promise((resolve) => setTimeout(resolve, 1200));

  // TODO: Replace with real extraction API (e.g. spoonacular or custom scraper)
  return {
    title: 'Pasta Carbonara',
    url,
    imageUrl:
      'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      '400 g spaghetti',
      '150 g guanciale lub pancetta',
      '3 żółtka',
      '1 całe jajko',
      '80 g pecorino romano',
      'świeżo mielony pieprz',
      'sól',
    ],
    steps: [
      'Ugotuj spaghetti al dente w osolonej wodzie.',
      'Podsmaż pokrojone guanciale do chrupkości.',
      'Wymieszaj żółtka, jajko, ser i pieprz w misce.',
      'Połącz makaron z guanciale poza ogniem.',
      'Dodaj masę jajeczną i wymieszaj energicznie, dodając odrobinę wody z makaronu.',
      'Podawaj od razu z dodatkowym pecorino i pieprzem.',
    ],
    category: 'Obiad',
    tags: ['włoskie', 'makaron', '30 min'],
    cookTime: '30 min',
    servings: '2-3',
  };
}
