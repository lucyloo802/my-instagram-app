import { Recipe } from '../types/recipe';

export const DEFAULT_RECIPES: Recipe[] = [
  {
    id: 'starter-garlic-egg-pasta',
    title: '12-Min Golden Garlic Spaghetti & Crispy Fried Eggs',
    tagline: 'Silky pasta tossed in sizzling garlic-infused olive oil, folded with sharp melted cheese and crowned with a crispy-edged, runny-yolk egg.',
    prepTimeMinutes: 3,
    cookTimeMinutes: 9,
    difficulty: 'Easy',
    servings: 2,
    caloriesEstimate: 510,
    macroBreakdown: {
      protein: '22g',
      carbs: '68g',
      fat: '18g',
    },
    flavorProfile: ['Garlicky', 'Savory', 'Silky', 'Comforting'],
    ingredientsUsed: [
      { name: 'spaghetti', amount: '200g (about 1/2 box)', isUserIngredient: true, notes: 'boiled al dente' },
      { name: 'garlic', amount: '4 cloves', isUserIngredient: true, notes: 'thinly sliced' },
      { name: 'olive oil', amount: '3 tbsp', isUserIngredient: true, notes: 'divided' },
      { name: 'eggs', amount: '2 large eggs', isUserIngredient: true, notes: 'sunny-side or over-medium' },
      { name: 'cheddar cheese', amount: '1/3 cup grated', isUserIngredient: true, notes: 'for creamy richness' },
      { name: 'black pepper', amount: '1/2 tsp freshly cracked', isUserIngredient: false },
      { name: 'salt & pasta water', amount: 'to taste', isUserIngredient: false },
    ],
    optionalAdditionsIfAvailable: [
      { name: 'red pepper flakes', why: 'Adds gentle fiery warmth to the garlic oil' },
      { name: 'chopped fresh parsley', why: 'Cuts through the rich egg yolk with herbal brightness' },
    ],
    equipmentNeeded: ['Pot for boiling', 'Wide skillet', 'Tongs'],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Bring a pot of heavily salted water to a rolling boil. Drop the spaghetti and cook until al dente, reserving 1/2 cup of starchy pasta water before draining.',
        timerSeconds: 480,
        tip: 'Salting the pasta water generously is the secret to deep flavor throughout the noodles.',
      },
      {
        stepNumber: 2,
        instruction: 'In a wide skillet over medium-low heat, warm 2 tablespoons of olive oil. Add the thinly sliced garlic and gently swirl until pale golden and fragrant. Do not let it brown too deeply.',
        timerSeconds: 90,
        tip: 'Low heat gently extracts garlic sugars into the oil without bitter burnt edges.',
      },
      {
        stepNumber: 3,
        instruction: 'Transfer drained hot pasta into the skillet with the garlic oil. Pour in 3 tablespoons of reserved starchy cooking water and toss vigorously over medium heat until a glossy, clinging emulsion forms. Fold in grated cheddar.',
        tip: 'The starch in the pasta water binds the olive oil into a silky sauce that clings.',
      },
      {
        stepNumber: 4,
        instruction: 'In a small separate pan (or scooting pasta to one side), heat 1 tablespoon of olive oil over medium-high. Crack in the eggs and fry until the edges are lacy, crispy, and brown while the yolk stays jammy.',
        timerSeconds: 120,
        tip: 'High heat oil creates that irresistible crunchy bottom skirt on the egg.',
      },
      {
        stepNumber: 5,
        instruction: 'Twirl the glossy garlic cheddar pasta into warm bowls. Top each portion with a crispy fried egg, finish with freshly cracked black pepper, and break the yolk over the noodles.',
        tip: 'Letting the warm yolk coat the garlic pasta creates a spontaneous carbonara-like silkiness!',
      },
    ],
    chefSecret: 'Emulsifying the hot starchy pasta water with garlic-infused olive oil creates a natural, velvety restaurant sauce with zero cream needed.',
    cleanUpRating: '2 Pans (Quick rinse)',
  },
  {
    id: 'starter-crispy-egg-frittata-pasta',
    title: 'Crispy Skillet Pasta Frittata',
    tagline: 'Golden pan-crisped pasta cake bound with whisked eggs and molten cheddar pockets.',
    prepTimeMinutes: 4,
    cookTimeMinutes: 8,
    difficulty: 'Easy',
    servings: 2,
    caloriesEstimate: 485,
    macroBreakdown: {
      protein: '24g',
      carbs: '60g',
      fat: '17g',
    },
    flavorProfile: ['Crispy', 'Cheesy', 'Savory'],
    ingredientsUsed: [
      { name: 'spaghetti', amount: '150g', isUserIngredient: true },
      { name: 'eggs', amount: '3 eggs, beaten', isUserIngredient: true },
      { name: 'garlic', amount: '2 cloves, minced', isUserIngredient: true },
      { name: 'cheddar cheese', amount: '1/2 cup grated', isUserIngredient: true },
      { name: 'olive oil', amount: '2 tbsp', isUserIngredient: true },
    ],
    equipmentNeeded: ['Non-stick skillet', 'Plate for flipping'],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Boil pasta until tender. In a bowl, whisk eggs with minced garlic, grated cheddar, and a pinch of salt and black pepper.',
        timerSeconds: 420,
      },
      {
        stepNumber: 2,
        instruction: 'Toss drained warm pasta into the egg mixture so the noodles get evenly coated.',
      },
      {
        stepNumber: 3,
        instruction: 'Heat olive oil in a non-stick skillet over medium. Pour in the pasta mixture, pressing into an even round cake. Cook undisturbed until the underside is deep golden and crisp.',
        timerSeconds: 180,
      },
      {
        stepNumber: 4,
        instruction: 'Slide onto a flat plate, invert back into the skillet, and crisp the reverse side for 2 minutes. Slice like a pizza and serve hot.',
        timerSeconds: 120,
      },
    ],
    chefSecret: 'A traditional Neapolitan trick for turning pantry pasta into a crunchy, satisfying frittata.',
    cleanUpRating: '1 Pan',
  },
];
