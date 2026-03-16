
/**
 * Add an ingredient string to the array (case-insensitive dedup, trims whitespace).
 * @param {string} tag
 * @param {string[]} arr
 * @returns {string[]} new array
 */
export function addIngredient(tag, arr) {
  const trimmed = (tag || "").trim().toLowerCase();
  if (!trimmed) return arr;
  //Check if ingredient already exists
  const alreadyExists = arr.some(i => i.toLowerCase() === trimmed);
  return alreadyExists ? arr : [...arr, trimmed];
}

/**
 * Remove an ingredient string from the array (case-insensitive).
 * @param {string} tag
 * @param {string[]} arr
 * @returns {string[]} new array
 */
// Using filter to remove ingredient
export function removeIngredient(tag, arr) {
  return arr.filter(i => i.toLowerCase() !== tag.toLowerCase());
}

/**
 * Strip HTML tags from a string — used for recipe summaries.
 * @param {string} html
 * @returns {string}
 */
// Using regex to strip html tags to sanitize the text
export function stripHtml(html) {
  return (html || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

/**
 * Show an error/info banner under the search panel.
 * @param {string} message
 * @param {HTMLElement} container — the status banner element
 * @param {"error"|"info"} type
 */
export function showBanner(message, container, type = "error") {
  if (!container) return;
  container.textContent = message;
  container.className = `status-banner ${type}`;
}

/**
 * Hide / clear the status banner.
 * @param {HTMLElement} container
 */
export function clearBanner(container) {
  if (!container) return;
  container.className = "status-banner hidden";
  container.textContent = "";
}

/**
 * Render ingredient pills into the given container.
 * @param {string[]} ingredients
 * @param {HTMLElement} container
 */
export function renderIngredientPills(ingredients, container) {
  if (!container) return;
  container.innerHTML = "";
  ingredients.forEach(ing => {
    const li = document.createElement("li");
    li.className = "pill";
    li.setAttribute("role", "listitem");
    li.setAttribute("aria-label", `Ingredient: ${ing}`);
    li.innerHTML = `
      <span>${ing}</span>
      <button class="pill-remove" type="button" aria-label="Remove ${ing}" data-tag="${ing}">✕</button>
    `;
    container.appendChild(li);
  });
}

/**
 * Build the health score chip based on numeric value.
 * @param {number|null} score
 */
function healthChipHtml(score) {
  if (score === null || score === undefined) return "";
  const cls = score >= 70 ? "health-high" : score >= 40 ? "health-mid" : "";
  const icon = score >= 70 ? "💚" : score >= 40 ? "🟡" : "❤️";
  return `<span class="meta-chip ${cls}">${icon} ${score} health</span>`;
}

/**
 * Render recipe cards into the results grid.
 * @param {Object[]} recipes
 * @param {HTMLElement} container
 */
export function renderRecipeCards(recipes, container) {
  if (!container) return;
  container.innerHTML = "";

  if (!recipes || recipes.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🍽️</div>
        <p>No recipes found. Try different ingredients or remove a dietary filter.</p>
      </div>`;
    return;
  }

  recipes.forEach((recipe, idx) => {
    const card = document.createElement("article");
    card.className = "recipe-card";
    card.setAttribute("style", `--i:${idx}`);
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `View recipe: ${recipe.title}`);
    card.dataset.id = recipe.id;

    // Diet tags
    let dietTags = Object.entries(recipe.dietaryLabels || {})
      .filter(([, v]) => v)
      .map(([k]) => {
        const labels = { vegan: "Vegan", vegetarian: "Vegetarian", glutenFree: "Gluten-Free", dairyFree: "Dairy-Free" };
        return `<span class="diet-tag">${labels[k] || k}</span>`;
      })
      .join("");

    // If no dietary labels are present, show a "General" tag
    if (!dietTags) {
      dietTags = `<span class="diet-tag" style="background: var(--bg-input); border-color: var(--border); color: var(--text-muted);">Standard</span>`;
    }

    const imageHtml = recipe.image
      ? `<img src="${recipe.image}" alt="${recipe.title}" loading="lazy" />`
      : `<div class="card-image-fallback" aria-hidden="true">🍽️</div>`;

    card.innerHTML = `
      <div class="card-image-wrapper">${imageHtml}</div>
      <div class="card-body">
        <h2 class="card-title">${recipe.title}</h2>
        <div class="card-meta">
          ${recipe.readyIn ? `<span class="meta-chip">⏱️ ${recipe.readyIn} min</span>` : ""}
          ${healthChipHtml(recipe.healthScore)}
          ${recipe.servings ? `<span class="meta-chip">🍽️ ${recipe.servings} servings</span>` : ""}
        </div>
        ${dietTags ? `<div class="card-diet-tags">${dietTags}</div>` : ""}
        <p class="card-cta">View recipe →</p>
      </div>`;

    container.appendChild(card);
  });
}

/**
 * Render skeleton placeholder cards during loading.
 * @param {HTMLElement} container
 * @param {number} count
 */
export function renderSkeletons(container, count = 6) {
  if (!container) return;
  container.innerHTML = Array.from({ length: count }, () => `
    <div class="skeleton-card" aria-hidden="true">
      <div class="skeleton-image"></div>
      <div class="skeleton-body">
        <div class="skeleton-line"></div>
        <div class="skeleton-line short"></div>
        <div class="skeleton-line shorter"></div>
      </div>
    </div>`).join("");
}

//API Fetch Functions 
/**
 * Fetch recipes from the backend.
 * @param {string} ingredients comma-separated
 * @param {string} diet
 * @returns {Promise<{results: Object[], total: number}>}
 */
export async function fetchRecipes(ingredients, diet) {
  const params = new URLSearchParams();
  if (ingredients) params.set("ingredients", ingredients);
  if (diet) params.set("diet", diet);

  const res = await fetch(`/api/recipes?${params}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Request failed with status ${res.status}`);
  }
  return res.json();
}

/**
 * Fetch a single random recipe.
 * @returns {Promise<Object>}
 */
export async function fetchRandom() {
  const res = await fetch("/api/random");
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Request failed with status ${res.status}`);
  }
  return res.json();
}

/**
 * Fetch full recipe details by ID.
 * @param {number|string} id
 * @returns {Promise<Object>}
 */
export async function fetchRecipeDetail(id) {
  const res = await fetch(`/api/recipe/${id}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Request failed with status ${res.status}`);
  }
  return res.json();
}

// Modal 

/**
 * Populate and open the recipe detail modal.
 * @param {Object} recipe
 * @param {HTMLDialogElement} modal
 * @param {HTMLElement} modalContent
 */
export function openModal(recipe, modal, modalContent) {
  if (!modal || !modalContent) return;

  let dietTags = Object.entries(recipe.dietaryLabels || {})
    .filter(([, v]) => v)
    .map(([k]) => {
      const labels = { vegan: "Vegan", vegetarian: "Vegetarian", glutenFree: "Gluten-Free", dairyFree: "Dairy-Free" };
      return `<span class="diet-tag">${labels[k] || k}</span>`;
    }).join("");

  if (!dietTags) {
    dietTags = `<span class="diet-tag" style="background: var(--bg-input); border-color: var(--border); color: var(--text-muted);">Standard</span>`;
  }

  const ingredientsHtml = (recipe.ingredients || []).length
    ? `<p class="modal-section-title">Ingredients</p>
       <ul class="ingredient-list">
         ${recipe.ingredients.map(i => `<li>${i.amount ?? ""} ${i.unit ?? ""} ${i.name}</li>`).join("")}
       </ul>`
    : "";

  const instructionsHtml = (recipe.instructions || []).length
    ? `<p class="modal-section-title">Instructions</p>
       <ol class="instruction-list">
         ${recipe.instructions.map(s => `
           <li class="instruction-step">
             <span class="step-num" aria-hidden="true">${s.number}</span>
             <span>${s.step}</span>
           </li>`).join("")}
       </ol>`
    : "";

  const summaryHtml = recipe.summary
    ? `<p class="modal-section-title">About</p>
       <p class="modal-summary">${recipe.summary.slice(0, 380)}${recipe.summary.length > 380 ? "…" : ""}</p>`
    : "";

  const imageHtml = recipe.image
    ? `<img class="modal-hero-image" src="${recipe.image}" alt="${recipe.title}" />`
    : "";

  const sourceLinkHtml = recipe.sourceUrl
    ? `<a class="modal-source-link" href="${recipe.sourceUrl}" target="_blank" rel="noopener noreferrer">
         📖 View full recipe
       </a>`
    : "";

  modalContent.innerHTML = `
    ${imageHtml}
    <h2 class="modal-title" id="modal-title">${recipe.title}</h2>
    <div class="modal-meta-row">
      ${recipe.readyIn ? `<span class="meta-chip">⏱️ ${recipe.readyIn} min</span>` : ""}
      ${healthChipHtml(recipe.healthScore)}
      ${recipe.servings ? `<span class="meta-chip">🍽️ ${recipe.servings} servings</span>` : ""}
      ${dietTags}
    </div>
    ${summaryHtml}
    ${ingredientsHtml}
    ${instructionsHtml}
    ${sourceLinkHtml}
  `;

  modal.showModal();
}

/**
 * Close the recipe detail modal.
 * @param {HTMLDialogElement} modal
 */
export function closeModal(modal) {
  if (modal) modal.close();
}

//Application Init

function init() {
  // DOM refs
  const ingredientInput = document.getElementById("ingredient-input");
  const addIngBtn = document.getElementById("add-ingredient-btn");
  const pillContainer = document.getElementById("ingredient-pills");
  const searchBtn = document.getElementById("search-btn");
  const surpriseBtn = document.getElementById("surprise-btn");
  const clearBtn = document.getElementById("clear-btn");
  const statusBanner = document.getElementById("status-banner");
  const resultsGrid = document.getElementById("results-grid");
  const recipeModal = document.getElementById("recipe-modal");
  const modalContent = document.getElementById("modal-content");
  const modalCloseBtn = document.getElementById("modal-close-btn");

  //State
  let ingredients = [];

  //Helpers 
  function getSelectedDiet() {
    const selected = document.querySelector("input[name='diet']:checked");
    return selected ? selected.value : "";
  }

  function setButtonsLoading(loading) {
    [searchBtn, surpriseBtn].forEach(btn => {
      btn.disabled = loading;
    });
  }

  //Ingredient management
  function handleAddIngredient() {
    const val = (ingredientInput.value || "").trim();
    if (!val) return;
    ingredients = addIngredient(val, ingredients);
    renderIngredientPills(ingredients, pillContainer);
    ingredientInput.value = "";
    ingredientInput.focus();
    clearBanner(statusBanner);
  }

  addIngBtn.addEventListener("click", handleAddIngredient);

  ingredientInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddIngredient();
    }
  });

  pillContainer.addEventListener("click", (e) => {
    const btn = e.target.closest(".pill-remove");
    if (!btn) return;
    ingredients = removeIngredient(btn.dataset.tag, ingredients);
    renderIngredientPills(ingredients, pillContainer);
  });

  //Recipe Search 
  searchBtn.addEventListener("click", async () => {
    const diet = getSelectedDiet();

    clearBanner(statusBanner);
    setButtonsLoading(true);
    renderSkeletons(resultsGrid, 6);

    try {
      const data = await fetchRecipes(ingredients.join(","), diet);
      renderRecipeCards(data.results, resultsGrid);
      if (data.results.length === 0) {
        showBanner("No recipes found for those criteria. Try different ingredients!", statusBanner, "info");
      }
    } catch (err) {
      resultsGrid.innerHTML = "";
      showBanner(`⚠️ ${err.message}`, statusBanner, "error");
    } finally {
      setButtonsLoading(false);
    }
  });

  //Surprise Me
  surpriseBtn.addEventListener("click", async () => {
    clearBanner(statusBanner);
    setButtonsLoading(true);
    renderSkeletons(resultsGrid, 1);

    try {
      const recipe = await fetchRandom();
      renderRecipeCards([recipe], resultsGrid);
    } catch (err) {
      resultsGrid.innerHTML = "";
      showBanner(`⚠️ ${err.message}`, statusBanner, "error");
    } finally {
      setButtonsLoading(false);
    }
  });

  //Clear
  clearBtn.addEventListener("click", () => {
    ingredients = [];
    renderIngredientPills([], pillContainer);
    ingredientInput.value = "";
    document.getElementById("diet-none").checked = true;
    resultsGrid.innerHTML = "";
    clearBanner(statusBanner);
  });

  //Recipe Card — open modal
  resultsGrid.addEventListener("click", async (e) => {
    const card = e.target.closest(".recipe-card");
    if (!card) return;
    await handleCardOpen(card);
  });

  resultsGrid.addEventListener("keydown", async (e) => {
    if (e.key === "Enter" || e.key === " ") {
      const card = e.target.closest(".recipe-card");
      if (!card) return;
      e.preventDefault();
      await handleCardOpen(card);
    }
  });

  async function handleCardOpen(card) {
    const id = card.dataset.id;
    if (!id) return;
    try {
      showBanner("Loading recipe details…", statusBanner, "info");
      const detail = await fetchRecipeDetail(id);
      clearBanner(statusBanner);
      openModal(detail, recipeModal, modalContent);
    } catch (err) {
      showBanner(`⚠️ ${err.message}`, statusBanner, "error");
    }
  }

  //Modal close
  modalCloseBtn.addEventListener("click", () => closeModal(recipeModal));

  recipeModal.addEventListener("click", (e) => {
    // Close on backdrop click
    if (e.target === recipeModal) closeModal(recipeModal);
  });

  recipeModal.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal(recipeModal);
  });
}

// Run on DOM ready
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", init);
}
const bannerEl = document.querySelector('#search-status');

// To show a red error
showBanner("Please enter a search term", bannerEl);

// To show an orange info message
showBanner("Searching...", bannerEl, "info");