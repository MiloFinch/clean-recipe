# CleanRecipe (Expo MVP)

Minimalistyczna aplikacja React Native / Expo do zapisywania przepisów z linków.

## Funkcje MVP

- Wklejanie URL przepisu i mockowane pobieranie treści przepisu
- Zapis lokalny (offline) w `AsyncStorage`
- Lista zapisanych przepisów
- Szczegóły przepisu (składniki z checkboxami, kroki, tagi)
- Zarządzanie kategoriami i tagami
- Nawigacja `expo-router` (zakładki + stack w sekcji przepisów)

## Stack

- Expo SDK 55 (zgodny z wymaganiem 52+)
- TypeScript
- `expo-router`
- `@react-native-async-storage/async-storage`
- StyleSheet (bez NativeWind)

## Uruchomienie

1. Zainstaluj zależności:

```bash
npm install
```

2. Uruchom projekt:

```bash
npx expo start
```

3. Otwórz aplikację w Expo Go lub emulatorze.

## Struktura

- `app/(tabs)/recipes/index.tsx` - HomeScreen (lista + FAB)
- `app/(tabs)/recipes/add.tsx` - AddRecipeScreen
- `app/(tabs)/recipes/[id].tsx` - RecipeDetailScreen
- `app/(tabs)/categories/index.tsx` - CategoriesScreen
- `src/context/RecipesContext.tsx` - stan aplikacji + operacje CRUD
- `src/services/recipeExtractor.ts` - mock ekstrakcji przepisu
- `src/storage/recipeStorage.ts` - warstwa `AsyncStorage`

## Uwaga

Ekstrakcja przepisu jest obecnie mockowana.
W pliku `src/services/recipeExtractor.ts` znajduje się komentarz TODO do podmiany na prawdziwe API/scraper.
