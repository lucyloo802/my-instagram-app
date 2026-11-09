export interface MacroBreakdown {
  protein: string;
  carbs: string;
  fat: string;
}

export interface IngredientUsed {
  name: string;
  amount: string;
  isUserIngredient: boolean;
  notes?: string;
}

export interface OptionalAddition {
  name: string;
  why: string;
}

export interface RecipeStep {
  stepNumber: number;
  instruction: string;
  timerSeconds?: number;
  tip?: string;
}

export interface Recipe {
  id: string;
  title: string;
  tagline: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  difficulty: string;
  servings: number;
  caloriesEstimate?: number;
  macroBreakdown?: MacroBreakdown;
  flavorProfile?: string[];
  ingredientsUsed: IngredientUsed[];
  optionalAdditionsIfAvailable?: OptionalAddition[];
  equipmentNeeded: string[];
  steps: RecipeStep[];
  chefSecret: string;
  cleanUpRating?: string;
  createdAt?: string;
}

export interface SubstituteOption {
  name: string;
  ratio: string;
  explanation: string;
  isFromCurrentIngredients: boolean;
}

export interface SubstitutionResult {
  substitutes: SubstituteOption[];
  proTip: string;
}

export interface StarterKit {
  id: string;
  name: string;
  description: string;
  badge: string;
  ingredients: string[];
}

export const STARTER_KITS: StarterKit[] = [
  {
    id: 'pasta-garlic',
    name: 'Classic Garlic & Olive Oil Pasta',
    description: 'A comforting Italian classic in 12 minutes.',
    badge: '12 mins',
    ingredients: ['spaghetti', 'garlic', 'olive oil', 'parmesan', 'red pepper flakes'],
  },
  {
    id: 'fridge-fried-rice',
    name: 'Late-Night Fried Rice',
    description: 'Turn cold rice and leftover eggs into pure comfort.',
    badge: '10 mins',
    ingredients: ['cooked rice', 'eggs', 'soy sauce', 'scallions', 'sesame oil', 'garlic'],
  },
  {
    id: 'rustic-bean-skillet',
    name: 'Warm Rustic White Bean Skillet',
    description: 'Hearty protein-packed meal from pantry cans.',
    badge: '15 mins',
    ingredients: ['canned cannellini beans', 'garlic', 'olive oil', 'crusty bread', 'rosemary', 'tomatoes'],
  },
  {
    id: 'breakfast-scramble',
    name: 'Cheesy Skillet Egg Toast',
    description: 'Creamy soft scrambled eggs over golden toasted bread.',
    badge: '8 mins',
    ingredients: ['eggs', 'cheddar cheese', 'bread', 'butter', 'black pepper'],
  },
];

export const POPULAR_INGREDIENTS = [
  { name: 'Eggs', category: 'Dairy & Eggs' },
  { name: 'Pasta', category: 'Pantry Grains' },
  { name: 'Garlic', category: 'Produce' },
  { name: 'Onion', category: 'Produce' },
  { name: 'Olive Oil', category: 'Oils & Staples' },
  { name: 'Tomatoes', category: 'Produce' },
  { name: 'Canned Beans', category: 'Pantry Grains' },
  { name: 'Rice', category: 'Pantry Grains' },
  { name: 'Cheddar Cheese', category: 'Dairy & Eggs' },
  { name: 'Bread', category: 'Pantry Grains' },
  { name: 'Butter', category: 'Dairy & Eggs' },
  { name: 'Soy Sauce', category: 'Condiments' },
  { name: 'Spinach', category: 'Produce' },
  { name: 'Chicken Breast', category: 'Proteins' },
  { name: 'Potatoes', category: 'Produce' },
  { name: 'Tuna (canned)', category: 'Proteins' },
  { name: 'Lemon', category: 'Produce' },
  { name: 'Parmesan', category: 'Dairy & Eggs' },
  { name: 'Chili Flakes', category: 'Condiments' },
  { name: 'Mushrooms', category: 'Produce' },
];
