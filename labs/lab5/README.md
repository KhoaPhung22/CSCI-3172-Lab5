# Recipe Recommender App

**CSCI 3172 — Lab 5 | Winter 2026**

A personalized recipe discovery web app. Enter ingredients you have on hand, select a dietary preference, and get curated recipe suggestions powered by the Spoonacular API.

---

## 🌐 Live URL

> **https://lab5csci3172kaiphung.netlify.app/**  
> *(Replace with your actual Netlify URL after deployment)*

---

## 📖 Application Description

RecipeRecommender lets users:
- Type in ingredients they already have (added as pill tags)
- Filter by dietary preference: Vegetarian, Vegan, Gluten-Free, Dairy-Free
- Discover up to 6 matching recipes with images, health scores, and cook time
- View full recipe details (ingredients, step-by-step instructions, summary) in a modal
- Get a random "Surprise Me" recipe with one click

The app uses a **Node.js/Express back-end deployed as a Netlify Serverless Function** to proxy requests to Spoonacular, keeping the API key secure. The front-end is plain HTML5/CSS/JavaScript with no UI frameworks.

---

## 🛠️ Technologies Used

| Layer | Technology |
|-------|-----------|
| Front-End | HTML5, CSS3 (Vanilla), JavaScript ES6+ (Modules) |
| Back-End | Node.js, Express.js |
| Serverless | Netlify Functions via `serverless-http` |
| API | [Spoonacular Food API](https://spoonacular.com/food-api) |
| HTTP | Fetch API (client), `node-fetch` (server) |
| Environment | `dotenv` |
| Testing | Jest, Supertest (server), jsdom (client) |
| Fonts | Google Fonts (Inter) |

---

## 🚀 Local Setup

### Prerequisites
- Node.js ≥ 18
- A free [Spoonacular API key](https://spoonacular.com/food-api)
- Netlify CLI (optional, for local function emulation)

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Create your .env file
cp .env.example .env
# Then open .env and set: SPOONACULAR_API_KEY=your_key_here

# 3. Install Netlify CLI globally (first time only)
npm install -g netlify-cli

# 4. Run locally with function emulation
netlify dev
# Open http://localhost:8888 in your browser
```

---

## 🧪 Testing

Run all tests with:
```bash
npm test
```

### What Was Tested

#### Server-Side Tests (`tests/server.test.js`) — Jest + Supertest

The server routes were tested in **isolation** from Spoonacular by mocking `global.fetch` with `jest.fn()`. This means no real API calls are made — the mock controls what Spoonacular "responds" with, allowing us to test all branches without using API quota.

| Component | Test Cases | Result |
|-----------|-----------|--------|
| `GET /api/hello` | Returns 200 + message JSON | ✅ Pass |
| `GET /api/recipes` | Missing params → 400 | ✅ Pass |
| `GET /api/recipes` | Missing API key → 500 | ✅ Pass |
| `GET /api/recipes` | Valid params + mocked response | ✅ Pass |
| `GET /api/recipes` | Empty results array | ✅ Pass |
| `GET /api/recipes` | Spoonacular 500 → 502 | ✅ Pass |
| `GET /api/recipes` | Network error → 502 | ✅ Pass |
| `GET /api/recipe/:id` | Non-numeric ID → 400 | ✅ Pass |
| `GET /api/recipe/:id` | Valid ID + mocked response | ✅ Pass |
| `GET /api/random` | Returns recipe with title | ✅ Pass |
| `GET /api/random` | Spoonacular 503 → 502 | ✅ Pass |

#### Client-Side Tests (`tests/client.test.js`) — Jest + jsdom

Pure utility functions exported from `main.js` were tested using the **jsdom** environment (simulates a browser DOM). `fetch` was never called — only pure logic and DOM manipulation were tested.

| Component | Test Cases | Result |
|-----------|-----------|--------|
| `addIngredient` | Add, dedup, trim, lowercase, empty | ✅ Pass |
| `removeIngredient` | Remove, case-insensitive, not found | ✅ Pass |
| `stripHtml` | Tags removed, null handled, whitespace collapsed | ✅ Pass |
| `showBanner / clearBanner` | Error/info classes, null safety | ✅ Pass |
| `renderIngredientPills` | Correct count, remove button, empty | ✅ Pass |
| `renderRecipeCards` | Count, titles, empty state, null image, diet tags | ✅ Pass |
| `renderSkeletons` | Count, default value, null safety | ✅ Pass |

---

## ♿ Accessibility (WCAG 2.1)

The following WCAG 2.1 Level AA guidelines were implemented:

- `<html lang="en">` — Language identification (3.1.1)
- All `<img>` elements have descriptive `alt` attributes (1.1.1)
- All form inputs have associated `<label>` elements (1.3.1)
- `<fieldset>` and `<legend>` for the diet radio group (1.3.1)
- `role="status"` + `aria-live="polite"` on the results region (4.1.3)
- `<dialog aria-modal="true" aria-labelledby="modal-title">` (4.1.2)
- Focus trapped inside modal while open via keyboard (2.1.2)
- `:focus-visible` rings on all interactive elements (2.4.7)
- Colour contrast ≥ 4.5:1 for all body text (1.4.3)
- `prefers-reduced-motion` media query disables animations (2.3.3)

---

## ⚠️ Known Issues & Limitations

1. **Spoonacular free tier** — Limited to 150 API points/day. Each search uses ~1 point. Exceeding the limit returns a 402 error displayed to the user as a banner.
2. **Empty results** — Very niche ingredient combinations (e.g., very unusual spices) may return 0 results from Spoonacular. The UI notifies the user to try different ingredients.
3. **Summary HTML** — Recipe summaries from Spoonacular contain HTML; the `stripHtml()` utility strips tags but may leave minor spacing artifacts in rare cases.
4. **No caching** — Each search hits Spoonacular live. A production version could cache results in a key-value store (e.g., Redis/Netlify Blobs) to reduce quota usage.
5. **Netlify cold starts** — First serverless function invocation after inactivity may be slightly slower (~1-2s). Subsequent calls are fast.

---

## 📚 Attributions

- [Spoonacular Food API](https://spoonacular.com/food-api) — Recipe data and images (Terms of Service: https://spoonacular.com/food-api/terms)
- [Google Fonts — Inter](https://fonts.google.com/specimen/Inter) — Typography (SIL Open Font License)
- [Express.js](https://expressjs.com/) — MIT License
- [serverless-http](https://github.com/dougmoscrop/serverless-http) — MIT License
- [Jest](https://jestjs.io/) / [Supertest](https://github.com/ladjs/supertest) / [jsdom](https://github.com/jsdom/jsdom) — Testing tools (MIT License)

Design patterns for the dark-mode CSS design system (CSS custom properties, shimmer animation) were inspired by common modern web design practices and adapted for this project. No third-party CSS libraries were used.
