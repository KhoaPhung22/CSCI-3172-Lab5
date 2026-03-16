
import { jest } from "@jest/globals";

// Mock fetch BEFORE importing api.js 
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Set NODE_ENV=test so api.js skips app.listen()
process.env.NODE_ENV = "test";
process.env.SPOONACULAR_API_KEY = "test-api-key";

// Import the raw Express app (not the serverless handler)
const { app } = await import("../netlify/functions/api.js");

// Supertest wraps the Express app without starting a real server
const { default: supertest } = await import("supertest");
const request = supertest(app);

// Helpers 
function mockSuccess(body) {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    status: 200,
    json: async () => body,
  });
}

function mockFailure(status = 500) {
  mockFetch.mockResolvedValueOnce({
    ok: false,
    status,
    json: async () => ({}),
  });
}

beforeEach(() => {
  mockFetch.mockReset();
  process.env.SPOONACULAR_API_KEY = "test-api-key";
});

//GET /api/hello 
describe("GET /api/hello", () => {
  it("returns 200 with a message string", async () => {
    const res = await request.get("/api/hello");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
  });
});

//GET /api/recipes
describe("GET /api/recipes", () => {
  it("returns 200 when neither ingredients nor diet are provided (general search)", async () => {
    mockSuccess({ results: [], totalResults: 0 });
    const res = await request.get("/api/recipes");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("results");
  });

  it("returns 500 when SPOONACULAR_API_KEY env var is missing", async () => {
    delete process.env.SPOONACULAR_API_KEY;
    const res = await request.get("/api/recipes?ingredients=tomato");
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error");
  });

  it("returns a mapped recipe array for valid query params", async () => {
    mockSuccess({
      results: [
        {
          id: 1,
          title: "Tomato Pasta",
          image: "https://example.com/pasta.jpg",
          readyInMinutes: 30,
          healthScore: 72,
          servings: 4,
          vegan: false,
          vegetarian: true,
          glutenFree: false,
          dairyFree: true,
        },
      ],
      totalResults: 1,
    });

    const res = await request.get("/api/recipes?ingredients=tomato&diet=vegetarian");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("results");
    expect(Array.isArray(res.body.results)).toBe(true);
    expect(res.body.results).toHaveLength(1);

    const recipe = res.body.results[0];
    expect(recipe).toMatchObject({
      id: 1,
      title: "Tomato Pasta",
      readyIn: 30,
      healthScore: 72,
    });
    expect(recipe.dietaryLabels).toMatchObject({ vegetarian: true, dairyFree: true });
  });

  it("returns an empty results array when Spoonacular returns none", async () => {
    mockSuccess({ results: [], totalResults: 0 });
    const res = await request.get("/api/recipes?diet=vegan");
    expect(res.status).toBe(200);
    expect(res.body.results).toHaveLength(0);
  });

  it("returns 502 when Spoonacular responds with an error status", async () => {
    mockFailure(500);
    const res = await request.get("/api/recipes?ingredients=chicken");
    expect(res.status).toBe(502);
    expect(res.body).toHaveProperty("error");
  });

  it("returns 502 when fetch throws a network error", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));
    const res = await request.get("/api/recipes?ingredients=egg");
    expect(res.status).toBe(502);
  });
});

// GET /api/recipe/:id 
describe("GET /api/recipe/:id", () => {
  it("returns 400 for a non-numeric ID", async () => {
    const res = await request.get("/api/recipe/abc");
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("returns a structured recipe detail object for a valid ID", async () => {
    mockSuccess({
      id: 123,
      title: "Classic Omelette",
      image: "https://example.com/omelette.jpg",
      readyInMinutes: 10,
      servings: 1,
      healthScore: 55,
      summary: "<p>A <b>classic</b> omelette.</p>",
      sourceUrl: "https://example.com",
      vegan: false,
      vegetarian: true,
      glutenFree: true,
      dairyFree: false,
      extendedIngredients: [
        { originalName: "eggs", amount: 2, unit: "large" },
        { originalName: "butter", amount: 1, unit: "tbsp" },
      ],
      analyzedInstructions: [
        {
          steps: [
            { number: 1, step: "Crack the eggs." },
            { number: 2, step: "Cook on medium heat." },
          ],
        },
      ],
    });

    const res = await request.get("/api/recipe/123");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("title", "Classic Omelette");
    // HTML stripped from summary
    expect(res.body).toHaveProperty("summary", "A classic omelette.");
    expect(Array.isArray(res.body.ingredients)).toBe(true);
    expect(res.body.ingredients).toHaveLength(2);
    expect(Array.isArray(res.body.instructions)).toBe(true);
    expect(res.body.instructions[0]).toMatchObject({ number: 1, step: "Crack the eggs." });
  });

  it("returns 502 on Spoonacular upstream error", async () => {
    mockFailure(500);
    const res = await request.get("/api/recipe/123");
    expect(res.status).toBe(502);
  });
});

// GET /api/random 
describe("GET /api/random", () => {
  it("returns a single recipe object with title and id", async () => {
    mockSuccess({
      recipes: [
        {
          id: 42,
          title: "Surprise Stew",
          image: "https://example.com/stew.jpg",
          readyInMinutes: 45,
          healthScore: 60,
          servings: 3,
          vegan: false,
          vegetarian: false,
          glutenFree: true,
          dairyFree: true,
        },
      ],
    });

    const res = await request.get("/api/random");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("title", "Surprise Stew");
    expect(res.body).toHaveProperty("id", 42);
  });

  it("returns 502 when Spoonacular fails", async () => {
    mockFailure(503);
    const res = await request.get("/api/random");
    expect(res.status).toBe(502);
  });
});
