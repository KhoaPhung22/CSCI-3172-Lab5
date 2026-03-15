# CSCI 3172 Lab 5 — Recipe Recommender App

## Overview

**Adventure Option 2: Recipe Recommender App**

A personalized recipe discovery web application where users enter available ingredients and select dietary restrictions (vegetarian, vegan, gluten-free, dairy-free) to receive curated recipe suggestions. The app is powered by the **Spoonacular API**, served through a **Node.js/Express backend deployed as Netlify Serverless Functions**, and a rich **HTML5/CSS/JavaScript** front-end.

The project skeleton already exists with:
- [netlify/functions/api.js](file:///c:/coding/CSCI%203172/lab5/CSCI-3172-Lab5/netlify/functions/api.js) — Express + `serverless-http` setup with a partial `/recipes` route
- [package.json](file:///c:/coding/CSCI%203172/lab5/CSCI-3172-Lab5/package.json) — dependencies: `express`, `serverless-http`, `dotenv`, `node-fetch`; devDependencies: `jest`, `jsdom`, `supertest`
- [test.js](file:///c:/coding/CSCI%203172/lab5/CSCI-3172-Lab5/test.js) — empty, to be replaced/structured

---

## User Review Required

> [!IMPORTANT]
> **Spoonacular API Key**: A free account at [spoonacular.com](https://spoonacular.com/food-api) is required. The `.env` file must contain `SPOONACULAR_API_KEY=<your_key>`. The free tier gives **150 points/day** — each search costs ~1 point. This must also be added to **Netlify Environment Variables** in the Netlify dashboard before deployment.

> [!WARNING]
> **[package.json](file:///c:/coding/CSCI%203172/lab5/CSCI-3172-Lab5/package.json) `"type": "module"`**: The project is currently configured as ES Module (`"type": "module"`). Jest requires special configuration to work with ESM. The plan accounts for this (using `--experimental-vm-modules` and `NODE_OPTIONS` flag). If this causes persistent issues, we may switch to CommonJS (`require`/`module.exports`) — please flag if you have a preference.

> [!NOTE]
> **Netlify Serverless vs. Classic Node.js Server**: There is no persistent Node.js process on Netlify — all backend logic runs as stateless functions. The `app.listen()` call in [api.js](file:///c:/coding/CSCI%203172/lab5/CSCI-3172-Lab5/netlify/functions/api.js) is only for local development and is harmless on Netlify (it never gets called). This is by design.

---

## Proposed Changes

### 1. Project Structure

The final file/folder layout will be:

```
CSCI-3172-Lab5/
├── public/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── main.js
├── netlify/
│   └── functions/
│       └── api.js
├── tests/
│   ├── server.test.js
│   └── client.test.js
├── netlify.toml
├── package.json
├── .env                  (local only, gitignored)
├── .gitignore
└── README.md
```

---

### 2. Configuration Files

#### [MODIFY] [netlify.toml](file:///c:/coding/CSCI%203172/lab5/CSCI-3172-Lab5/netlify.toml) *(new file)*

A `netlify.toml` must exist at the project root to tell Netlify where the static site and functions live, and to configure the API redirect so `fetch('/api/...')` from the browser routes to `/.netlify/functions/api/...`.

```toml
[build]
  publish = "public"
  functions = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to   = "/.netlify/functions/api/:splat"
  status = 200
```

**Why**: Without this, calls to `/api/recipes` from the browser would 404. The redirect transparently forwards them to the serverless function.

#### [MODIFY] [package.json](file:///c:/coding/CSCI%203172/lab5/CSCI-3172-Lab5/package.json)

Add Jest configuration for ESM support:

```json
"scripts": {
  "test":  "node --experimental-vm-modules node_modules/.bin/jest --testPathPattern=tests/",
  "start": "node netlify/functions/api.js"
},
"jest": {
  "testEnvironment": "node",
  "transform": {}
}
```

Also add a separate `"testEnvironment": "jsdom"` override for `client.test.js` using Jest's `@jest-environment` docblock.

#### [NEW] [.env](file:///c:/coding/CSCI%203172/lab5/CSCI-3172-Lab5/.env) *(local only)*

```
SPOONACULAR_API_KEY=your_key_here
PORT=3000
```

---

### 3. Back-End — [netlify/functions/api.js](file:///c:/coding/CSCI%203172/lab5/CSCI-3172-Lab5/netlify/functions/api.js)

#### [MODIFY] [api.js](file:///c:/coding/CSCI%203172/lab5/CSCI-3172-Lab5/netlify/functions/api.js)

Rewrite and clean up the existing file. The final routes will be:

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/hello` | Health check |
| `GET` | `/api/recipes` | Search recipes by ingredients + diet |
| `GET` | `/api/recipe/:id` | Fetch full single recipe details |
| `GET` | `/api/random` | Fetch one random recipe ("Surprise Me") |

**Key implementation details:**

- **`GET /api/recipes`**: Reads `ingredients` (comma-separated string) and `diet` (e.g., `"vegan"`) from query params. Validates that at least one is provided (returns `400` if both are missing). Calls Spoonacular `complexSearch` with `addRecipeInformation=true`, `number=6`. Maps the response to a simplified object `{ id, title, image, readyIn, healthScore, dietaryLabels }`.

- **`GET /api/recipe/:id`**: Calls Spoonacular `GET /recipes/{id}/information`. Returns full details including `extendedIngredients`, `analyzedInstructions`, `summary` (HTML stripped to text), `sourceUrl`.

- **`GET /api/random`**: Calls Spoonacular `GET /recipes/random?number=1`. Used by the "Surprise Me" button on the front-end.

- **Error handling**: All routes wrapped in `try/catch`. Upstream API failures return `{ error: "..." }` with a `502` status. Missing required query params return `400`.

- **`app.listen()`**: Retained for local development only, guarded with `if (process.env.NODE_ENV !== 'test')` to avoid port conflicts in Jest tests.

---

### 4. Front-End

#### [NEW] [public/index.html](file:///c:/coding/CSCI%203172/lab5/CSCI-3172-Lab5/public/index.html)

Semantic HTML5 structure with ARIA attributes:

```
<header>    — App name + tagline
<main>
  <section> — Search panel (ingredient input + diet filters + buttons)
  <section> — Results grid (recipe cards)
  <dialog>  — Recipe detail modal
<footer>    — Attribution
```

Key elements:
- `<html lang="en">` — WCAG requirement
- `<meta name="description">` — SEO
- `<label>` for every `<input>` and `<select>` — WCAG
- `role="status" aria-live="polite"` on the results region for screen readers
- All interactive elements have unique `id` attributes (for browser testing)
- Google Fonts (`Inter`) loaded via `<link>`

**Ingredient input UX**: A text input where pressing Enter or clicking "Add" appends a styled pill tag. Each pill has an ✕ button to remove it. The ingredient list is stored in a JS array and serialized as a comma-joined string for the API call.

**Diet filters**: Styled checkbox group (Vegetarian, Vegan, Gluten-Free, Dairy-Free). Only one diet value is sent to Spoonacular.

**Buttons**:
- **Find Recipes** — triggers the main search
- **Surprise Me** — calls `/api/random` and displays one card
- **Clear** — resets all inputs and results

#### [NEW] [public/css/style.css](file:///c:/coding/CSCI%203172/lab5/CSCI-3172-Lab5/public/css/style.css)

Premium design system — **dark mode by default** with a warm food-inspired palette:

| Token | Value |
|-------|-------|
| `--bg-primary` | `#0f0f14` (near-black) |
| `--bg-card` | `#1a1a24` |
| `--accent` | `#f97316` (orange — "appetite") |
| `--accent-hover` | `#ea6c0a` |
| `--text-primary` | `#f1f0f5` |
| `--text-muted` | `#8b8aa0` |
| `--success` | `#22c55e` |
| `--danger` | `#ef4444` |

Animations & micro-interactions:
- Search panel slides in on load (`@keyframes slideDown`)
- Recipe cards fade + translate in with a staggered delay (`animation-delay: calc(var(--i) * 80ms)`)
- Ingredient pills have a `scale(1.05)` hover
- Buttons have `transform: translateY(-2px)` on hover + box-shadow lift
- Loading: pulsing skeleton cards while data is fetching
- Recipe card hover: image zoom (`transform: scale(1.08)`) inside `overflow: hidden`

Accessibility:
- `:focus-visible` outlines (2px solid `var(--accent)`)
- Sufficient contrast (orange on near-black passes 4.5:1)
- `prefers-reduced-motion` media query disables animations for users who prefer it

Layout: CSS Grid for the recipe cards (`auto-fill, minmax(280px, 1fr)`), Flexbox for nav and search panel.

#### [NEW] [public/js/main.js](file:///c:/coding/CSCI%203172/lab5/CSCI-3172-Lab5/public/js/main.js)

Client-side JavaScript — no frameworks, vanilla ES6+. Exported functions (for testability):

| Function | Description |
|----------|-------------|
| `addIngredient(tag, arr)` | Adds a string to the ingredient array; returns new array |
| `removeIngredient(tag, arr)` | Removes a string from the ingredient array; returns new array |
| `renderIngredientPills(arr, container)` | Re-renders pill tags in the DOM |
| `renderRecipeCards(recipes, container)` | Renders recipe card HTML into grid |
| `showError(message, container)` | Injects a styled error alert into a container |
| `clearError(container)` | Removes error alert |
| `stripHtml(html)` | Strips HTML tags from a string (for recipe summary) |
| `fetchRecipes(ingredients, diet)` | `async` — calls `/api/recipes`, returns parsed JSON |
| `fetchRandom()` | `async` — calls `/api/random`, returns parsed JSON |
| `fetchRecipeDetail(id)` | `async` — calls `/api/recipe/:id`, returns parsed JSON |
| `openModal(recipe)` | Populates and opens the `<dialog>` modal |
| `closeModal()` | Closes the modal |

Event listeners are attached in a single `init()` function that runs on `DOMContentLoaded`. The fetch functions use `async/await` with proper `try/catch`. All user-facing errors are shown in a visually styled error banner (never just `console.error` alone).

---

### 5. Testing

#### [NEW] [tests/server.test.js](file:///c:/coding/CSCI%203172/lab5/CSCI-3172-Lab5/tests/server.test.js)

**Framework**: Jest + Supertest  
**What is isolated**: `global.fetch` is mocked using `jest.spyOn(global, 'fetch')` — this means no real HTTP calls are made to Spoonacular. Tests verify that the server correctly constructs API calls and handles responses.

| Test | Description |
|------|-------------|
| `GET /api/hello` returns 200 + JSON | Health check |
| `GET /api/recipes` with `ingredients=tomato&diet=vegan` | Mocked fetch returns sample data → verify response shape |
| `GET /api/recipes` with no params | Expect `400` status |
| `GET /api/recipes` when fetch throws | Expect `500`/`502` status |
| `GET /api/recipe/123` | Mocked fetch returns recipe detail → verify fields |
| `GET /api/random` | Mocked fetch returns random recipe → verify title field |

**Run command**:
```bash
npm test
```

#### [NEW] [tests/client.test.js](file:///c:/coding/CSCI%203172/lab5/CSCI-3172-Lab5/tests/client.test.js)

**Framework**: Jest + jsdom (via `@jest-environment jsdom` docblock)  
**What is isolated**: DOM is provided by jsdom. `fetch` is mocked with `jest.fn()`. Imports only the pure utility functions from `main.js` (using ESM named exports).

| Test | Description |
|------|-------------|
| `addIngredient` adds item to array | Pure function test |
| `addIngredient` ignores duplicates | Pure function test |
| `addIngredient` ignores empty strings | Pure function test |
| `removeIngredient` removes correct item | Pure function test |
| `renderRecipeCards` inserts correct number of cards | DOM test |
| `renderRecipeCards` shows "no results" for empty array | DOM test |
| `showError` creates alert element | DOM test |
| `clearError` removes alert | DOM test |
| `stripHtml` removes tags from string | Pure function test |

**Run command**:
```bash
npm test
```

---

### 6. Accessibility Checklist (WCAG 2.1 Level AA)

- `<html lang="en">` ✓
- All `<img>` have descriptive `alt` (recipe image alt = recipe title)
- All `<input>` have `<label for="...">` ✓
- `role="status"` + `aria-live="polite"` on results region
- `<dialog>` uses `aria-labelledby` for modal title
- Colour contrast ≥ 4.5:1 for normal text
- Keyboard focus is trapped inside modal while open (`Tab`/`Shift+Tab` cycle)
- `prefers-reduced-motion` respected

---

### 7. README.md

#### [NEW] [README.md](file:///c:/coding/CSCI%203172/lab5/CSCI-3172-Lab5/README.md)

Will include:
1. **App Description** — What the app does, who it's for
2. **Live URL** — Netlify deployment URL (filled in after deployment)
3. **Technologies Used** — HTML5, CSS3, Vanilla JS, Node.js, Express, Serverless-HTTP, Netlify Functions, Spoonacular API, Jest, Supertest, jsdom
4. **Setup Instructions** — How to install dependencies, configure `.env`, and run locally
5. **Testing Summary** — Description of what was tested, how components were isolated, and results
6. **Accessibility Notes** — Summary of WCAG guidelines applied
7. **Known Issues / Limitations** — Spoonacular free-tier 150 point/day limit; API can return empty results for very niche queries
8. **Attributions** — Any code snippets referenced

---

## Verification Plan

### Automated Tests

Run all tests with:
```bash
cd "c:\coding\CSCI 3172\lab5\CSCI-3172-Lab5"
npm test
```

Expected: All tests pass (green). Test suite covers server routes and client utility functions.

### Local Development Verification

1. Create `.env` with your `SPOONACULAR_API_KEY`
2. Install Netlify CLI globally: `npm install -g netlify-cli`
3. Run locally with Netlify Dev (emulates functions):
   ```bash
   netlify dev
   ```
4. Open `http://localhost:8888` in the browser
5. Manually test:
   - Type `"tomato"` as ingredient, press Enter → pill appears
   - Click ✕ on pill → pill removed
   - Select "Vegan", click "Find Recipes" → 6 recipe cards appear
   - Click a recipe card → modal opens with details
   - Click "Surprise Me" → 1 random recipe card appears
   - Submit with no ingredients or diet → error banner appears
   - Click "Clear" → form and results reset

### Deployment Verification

1. Push to GitHub
2. Connect repo to Netlify, set environment variable `SPOONACULAR_API_KEY` in Netlify dashboard
3. Netlify builds and deploys automatically
4. Confirm the live URL is accessible, all 3 API routes respond correctly
5. Test in Chrome, Firefox, and Edge (cross-browser check)
