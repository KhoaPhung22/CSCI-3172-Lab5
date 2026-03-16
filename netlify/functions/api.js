/**
 * api.js — Recipe Recommender App Backend
 * CSCI 3172 Lab 5
 *
 * Runs as a Netlify Serverless Function (via serverless-http + Express).
 * The /api/* redirect in netlify.toml routes browser requests here.
 *
 * Routes:
 *   GET /api/hello           — Health check
 *   GET /api/recipes         — Search recipes by ingredients + diet
 *   GET /api/recipe/:id      — Fetch full recipe detail
 *   GET /api/random          — Fetch a single random recipe
 */

import express from "express";
import serverless from "serverless-http";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const router = express.Router();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());

// ─── Helper: forward Spoonacular errors cleanly ───────────────────────────────
function spoonacularError(res, error, context = "") {
  console.error(`[api] Spoonacular error${context ? " (" + context + ")" : ""}:`, error.message);
  if (error.message?.includes("API key")) {
    return res.status(401).json({ error: "Invalid or missing API key." });
  }
  return res.status(502).json({ error: "Failed to reach the recipe API. Please try again later." });
}

// ─── GET /api/hello ──────────────────────────────────────────────────────────
// Health check — used by integration tests and Netlify deploy checks.
router.get("/hello", (_req, res) => {
  res.json({ message: "Hello from the Recipe Recommender backend!" });
});

// ─── GET /api/recipes ────────────────────────────────────────────────────────
// Query params:
//   ingredients  — comma-separated string, e.g. "tomato,cheese"
//   diet         — single diet label, e.g. "vegan", "vegetarian", "gluten free"
//
// At least one must be provided; returns 400 otherwise.
router.get("/recipes", async (req, res) => {
  const { ingredients, diet } = req.query;

  // No longer returning 400 if both are missing; instead, it returns general recipes.


  const API_KEY = process.env.SPOONACULAR_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: "Server configuration error: API key missing." });
  }

  try {
    const params = new URLSearchParams({
      apiKey: API_KEY,
      number: 21,
      addRecipeInformation: true,
      fillIngredients: false
    });
    if (ingredients) params.set("includeIngredients", ingredients);
    if (diet) params.set("diet", diet);

    const response = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?${params}`
    );

    if (!response.ok) {
      throw new Error(`Spoonacular returned ${response.status}`);
    }

    const data = await response.json();

    const recipes = (data.results || []).map((r) => ({
      id: r.id,
      title: r.title,
      image: r.image || null,
      readyIn: r.readyInMinutes ?? null,
      healthScore: r.healthScore ?? null,
      servings: r.servings ?? null,
      dietaryLabels: {
        vegan: r.vegan ?? false,
        vegetarian: r.vegetarian ?? false,
        glutenFree: r.glutenFree ?? false,
        dairyFree: r.dairyFree ?? false
      }
    }));

    res.json({ results: recipes, total: data.totalResults || recipes.length });
  } catch (error) {
    return spoonacularError(res, error, "complexSearch");
  }
});

// ─── GET /api/recipe/:id ─────────────────────────────────────────────────────
// Returns full detail: ingredients, step-by-step instructions, summary, source.
router.get("/recipe/:id", async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: "Invalid recipe ID." });
  }

  const API_KEY = process.env.SPOONACULAR_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: "Server configuration error: API key missing." });
  }

  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}&includeNutrition=false`
    );

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ error: "Recipe not found." });
      }
      throw new Error(`Spoonacular returned ${response.status}`);
    }

    const r = await response.json();

    // Strip HTML from summary
    const plainSummary = (r.summary || "").replace(/<[^>]+>/g, "");

    // Flatten step-by-step instructions
    const steps = (r.analyzedInstructions?.[0]?.steps || []).map((s) => ({
      number: s.number,
      step: s.step
    }));

    res.json({
      id: r.id,
      title: r.title,
      image: r.image || null,
      readyIn: r.readyInMinutes ?? null,
      servings: r.servings ?? null,
      healthScore: r.healthScore ?? null,
      summary: plainSummary,
      sourceUrl: r.sourceUrl || null,
      dietaryLabels: {
        vegan: r.vegan ?? false,
        vegetarian: r.vegetarian ?? false,
        glutenFree: r.glutenFree ?? false,
        dairyFree: r.dairyFree ?? false
      },
      ingredients: (r.extendedIngredients || []).map((ing) => ({
        name: ing.originalName,
        amount: ing.amount,
        unit: ing.unit
      })),
      instructions: steps
    });
  } catch (error) {
    return spoonacularError(res, error, `recipe/${id}`);
  }
});

// ─── GET /api/random ─────────────────────────────────────────────────────────
// Returns a single random recipe — powers the "Surprise Me" button.
router.get("/random", async (req, res) => {
  const API_KEY = process.env.SPOONACULAR_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: "Server configuration error: API key missing." });
  }

  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/random?apiKey=${API_KEY}&number=1`
    );

    if (!response.ok) {
      throw new Error(`Spoonacular returned ${response.status}`);
    }

    const data = await response.json();
    const r = data.recipes?.[0];

    if (!r) {
      return res.status(502).json({ error: "No random recipe returned by API." });
    }

    res.json({
      id: r.id,
      title: r.title,
      image: r.image || null,
      readyIn: r.readyInMinutes ?? null,
      healthScore: r.healthScore ?? null,
      servings: r.servings ?? null,
      dietaryLabels: {
        vegan: r.vegan ?? false,
        vegetarian: r.vegetarian ?? false,
        glutenFree: r.glutenFree ?? false,
        dairyFree: r.dairyFree ?? false
      }
    });
  } catch (error) {
    return spoonacularError(res, error, "random");
  }
});

// ─── Mount router ─────────────────────────────────────────────────────────────
// Netlify redirects /api/* → /.netlify/functions/api/:splat
// The router prefix must match the function's mount path.
app.use("/.netlify/functions/api", router);

// Also mount without prefix so local `netlify dev` and direct calls work
app.use("/api", router);

// ─── Serverless export (Netlify) ──────────────────────────────────────────────
export const handler = serverless(app);

// Named export so tests can import the express app directly (without serverless-http)
export { app };

// ─── Local development server (not used on Netlify) ──────────────────────────
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`[dev] Server running at http://localhost:${PORT}`);
  });
}