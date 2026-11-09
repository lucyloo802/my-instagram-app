import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Recipe generation response schema
const recipeResponseSchema = {
  type: Type.OBJECT,
  properties: {
    recipes: {
      type: Type.ARRAY,
      description: "List of 1 to 2 distinct, quick recipes created using the specified ingredients.",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          tagline: { type: Type.STRING },
          prepTimeMinutes: { type: Type.INTEGER },
          cookTimeMinutes: { type: Type.INTEGER },
          difficulty: { type: Type.STRING },
          servings: { type: Type.INTEGER },
          caloriesEstimate: { type: Type.INTEGER },
          macroBreakdown: {
            type: Type.OBJECT,
            properties: {
              protein: { type: Type.STRING },
              carbs: { type: Type.STRING },
              fat: { type: Type.STRING },
            },
            required: ["protein", "carbs", "fat"],
          },
          flavorProfile: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          ingredientsUsed: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                amount: { type: Type.STRING },
                isUserIngredient: { type: Type.BOOLEAN },
                notes: { type: Type.STRING },
              },
              required: ["name", "amount", "isUserIngredient"],
            },
          },
          optionalAdditionsIfAvailable: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                why: { type: Type.STRING },
              },
              required: ["name", "why"],
            },
          },
          equipmentNeeded: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          steps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                stepNumber: { type: Type.INTEGER },
                instruction: { type: Type.STRING },
                timerSeconds: { type: Type.INTEGER },
                tip: { type: Type.STRING },
              },
              required: ["stepNumber", "instruction"],
            },
          },
          chefSecret: { type: Type.STRING },
          cleanUpRating: { type: Type.STRING },
        },
        required: [
          "id",
          "title",
          "tagline",
          "prepTimeMinutes",
          "cookTimeMinutes",
          "difficulty",
          "servings",
          "ingredientsUsed",
          "steps",
          "chefSecret",
        ],
      },
    },
  },
  required: ["recipes"],
};

// Endpoint: Generate quick recipes from ingredients
app.post('/api/recipe/generate', async (req: Request, res: Response) => {
  try {
    const {
      ingredients = [],
      strictMode = true,
      mealType = 'any',
      maxCookTime = 20,
      servings = 2,
      equipment = ['skillet', 'pot'],
      dietary = 'none',
      style = 'quick-comfort',
    } = req.body;

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ error: 'Please provide at least one ingredient.' });
    }

    const cleanedIngredients = ingredients.map((i: string) => String(i).trim()).filter(Boolean);
    if (cleanedIngredients.length === 0) {
      return res.status(400).json({ error: 'Please enter valid ingredients.' });
    }

    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please check Settings > Secrets.',
      });
    }

    const prompt = `
You are an expert chef who excels at creative pantry cooking and zero food waste.
A home cook has only the following ingredients available in their kitchen:
${cleanedIngredients.map((ing) => `- ${ing}`).join('\n')}

COOKING RULES & CONSTRAINTS:
1. Strictness: ${
      strictMode
        ? "STRICT MODE: Use ONLY the ingredients provided above plus common zero-cost essentials: tap water, salt, and black pepper. DO NOT require butter, oil, soy sauce, garlic, or spices unless the user explicitly provided them above. If oil is not in the list, recommend water-sautéing, steaming, dry-toasting, or boiling."
        : "FLEXIBLE MODE: The user has the ingredients above, and can also use standard kitchen staples if needed (cooking oil, butter, salt, black pepper, water). Highlight any staple used as non-user ingredient."
    }
2. Meal Type: ${mealType}
3. Maximum Total Cooking Time: ${maxCookTime} minutes (must be quick, accessible, and fast!)
4. Servings: ${servings}
5. Equipment Available: ${equipment.join(', ') || 'Standard cookware'}
6. Dietary Preference: ${dietary}
7. Culinary Tone/Style: ${style}

Generate 2 distinct delicious recipe ideas that can genuinely be made right now with these ingredients:
- Recipe 1: The fastest, most straightforward and reliable dish.
- Recipe 2: A clever or slightly more creative twist (e.g. crispy texture, glaze, or one-pot magic).

Make each instruction step crisp, actionable, and include practical timer recommendations in seconds (e.g., 90 for 1.5 mins) whenever heat, simmering, boiling, or frying is involved. Provide estimated calories, macros, and a chef pro-tip explaining why this culinary technique works.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are a friendly, hyper-practical Michelin-grade pantry chef. You prioritize realism, delicious flavor balance, precise cooking techniques, and strict adherence to available ingredients.',
        responseMimeType: 'application/json',
        responseSchema: recipeResponseSchema,
      },
    });

    const jsonText = (response.text ?? '{}').trim();
    const data = JSON.parse(jsonText);
    return res.json(data);
  } catch (err: unknown) {
    console.error('Error in /api/recipe/generate:', err);
    const errorMessage = err instanceof Error ? err.message : 'Failed to whip up recipe';
    return res.status(500).json({ error: errorMessage });
  }
});

// Endpoint: Instant Smart Substitution
app.post('/api/recipe/substitute', async (req: Request, res: Response) => {
  try {
    const { ingredient, currentIngredients = [] } = req.body;
    if (!ingredient) {
      return res.status(400).json({ error: 'Ingredient to substitute is required.' });
    }

    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const prompt = `
A cook needs a quick substitute for "${ingredient}".
Here is what they currently have in their kitchen: ${currentIngredients.join(', ') || 'Not specified'}.

Provide 2-3 instant practical substitutes:
1. Best match using what they might already have or a simple pantry swap.
2. Culinary technique alternative (e.g. if no eggs for binding, use mashed starch or water emulsion).
3. Ratio & how it alters flavor/texture.

Return response as JSON with format:
{
  "substitutes": [
    {
      "name": "string",
      "ratio": "e.g. 1 tbsp olive oil for 1 tbsp butter",
      "explanation": "Why this works and what texture/flavor changes to expect",
      "isFromCurrentIngredients": boolean
    }
  ],
  "proTip": "string"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            substitutes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  ratio: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  isFromCurrentIngredients: { type: Type.BOOLEAN },
                },
                required: ['name', 'ratio', 'explanation', 'isFromCurrentIngredients'],
              },
            },
            proTip: { type: Type.STRING },
          },
          required: ['substitutes', 'proTip'],
        },
      },
    });

    const data = JSON.parse(response.text ?? '{}');
    return res.json(data);
  } catch (err: unknown) {
    console.error('Error in /api/recipe/substitute:', err);
    return res.status(500).json({ error: 'Could not fetch substitutes' });
  }
});

// Endpoint: Refine Recipe (make spicier, kid-friendly, faster, etc.)
app.post('/api/recipe/refine', async (req: Request, res: Response) => {
  try {
    const { recipe, refinementInstruction, ingredients = [] } = req.body;
    if (!recipe || !refinementInstruction) {
      return res.status(400).json({ error: 'Recipe and refinement instruction are required.' });
    }

    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const prompt = `
Here is an existing recipe:
Title: ${recipe.title}
Ingredients: ${JSON.stringify(recipe.ingredientsUsed)}
Steps: ${JSON.stringify(recipe.steps)}

User's requested tweak: "${refinementInstruction}"
User's available ingredients pool: ${ingredients.join(', ')}

Update this recipe cleanly according to the requested tweak while keeping it quick and realistic with their ingredients.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: recipeResponseSchema,
      },
    });

    const data = JSON.parse(response.text ?? '{}');
    return res.json(data);
  } catch (err: unknown) {
    console.error('Error in /api/recipe/refine:', err);
    return res.status(500).json({ error: 'Could not refine recipe' });
  }
});

// Setup Vite dev server or serve production build
async function setupApp() {
  const isProd = process.env.NODE_ENV === 'production';
  if (isProd) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PantryWhip server running on http://0.0.0.0:${PORT}`);
  });
}

setupApp();
