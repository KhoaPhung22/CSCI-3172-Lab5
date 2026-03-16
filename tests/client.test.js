
import {
  addIngredient,
  removeIngredient,
  stripHtml,
  showBanner,
  clearBanner,
  renderIngredientPills,
  renderRecipeCards,
  renderSkeletons,
} from "../public/js/main.js";

//addIngredient
describe("addIngredient", () => {
  it("adds a new ingredient to an empty array", () => {
    const result = addIngredient("tomato", []);
    expect(result).toEqual(["tomato"]);
  });

  it("trims whitespace from the ingredient", () => {
    const result = addIngredient("  basil  ", []);
    expect(result).toEqual(["basil"]);
  });

  it("converts ingredient to lowercase", () => {
    const result = addIngredient("Chicken", []);
    expect(result).toEqual(["chicken"]);
  });

  it("does not add duplicate ingredients (case-insensitive)", () => {
    const arr = ["tomato"];
    const result = addIngredient("Tomato", arr);
    expect(result).toEqual(["tomato"]);
  });

  it("ignores empty strings", () => {
    const arr = ["tomato"];
    const result = addIngredient("", arr);
    expect(result).toEqual(["tomato"]);
    expect(result).toHaveLength(1);
  });

  it("ignores whitespace-only strings", () => {
    const arr = [];
    const result = addIngredient("   ", arr);
    expect(result).toHaveLength(0);
  });

  it("appends to an existing array", () => {
    const arr = ["tomato", "cheese"];
    const result = addIngredient("basil", arr);
    expect(result).toEqual(["tomato", "cheese", "basil"]);
  });

  it("does not mutate the original array", () => {
    const arr = ["tomato"];
    addIngredient("basil", arr);
    expect(arr).toEqual(["tomato"]);
  });
});

// removeIngredient 
describe("removeIngredient", () => {
  it("removes an existing ingredient", () => {
    const arr = ["tomato", "cheese", "basil"];
    const result = removeIngredient("cheese", arr);
    expect(result).toEqual(["tomato", "basil"]);
  });

  it("is case-insensitive when removing", () => {
    const arr = ["tomato", "Cheese"];
    const result = removeIngredient("cheese", arr);
    expect(result).toEqual(["tomato"]);
  });

  it("returns the same array when ingredient not found", () => {
    const arr = ["tomato"];
    const result = removeIngredient("garlic", arr);
    expect(result).toEqual(["tomato"]);
  });

  it("does not mutate the original array", () => {
    const arr = ["tomato", "basil"];
    removeIngredient("tomato", arr);
    expect(arr).toEqual(["tomato", "basil"]);
  });

  it("returns empty array when last ingredient is removed", () => {
    const result = removeIngredient("tomato", ["tomato"]);
    expect(result).toHaveLength(0);
  });
});

//stripHtml
describe("stripHtml", () => {
  it("removes HTML tags from a string", () => {
    const result = stripHtml("<p>Hello <b>world</b></p>");
    expect(result).toBe("Hello world");
  });

  it("handles an empty string", () => {
    expect(stripHtml("")).toBe("");
  });

  it("handles null/undefined gracefully", () => {
    expect(stripHtml(null)).toBe("");
    expect(stripHtml(undefined)).toBe("");
  });

  it("preserves plain text without modification", () => {
    expect(stripHtml("No tags here")).toBe("No tags here");
  });

  it("collapses extra whitespace", () => {
    const result = stripHtml("<p>   Too   many   spaces   </p>");
    expect(result).toBe("Too many spaces");
  });
});

// showBanner / clearBanner
describe("showBanner", () => {
  it("sets error class and message on the container", () => {
    const container = document.createElement("div");
    showBanner("Something went wrong", container, "error");
    expect(container.textContent).toBe("Something went wrong");
    expect(container.className).toContain("error");
  });

  it("sets info class when type is info", () => {
    const container = document.createElement("div");
    showBanner("Loading…", container, "info");
    expect(container.className).toContain("info");
  });

  it("does nothing when container is null", () => {
    expect(() => showBanner("msg", null)).not.toThrow();
  });
});

describe("clearBanner", () => {
  it("hides the banner by adding hidden class", () => {
    const container = document.createElement("div");
    container.className = "status-banner error";
    container.textContent = "Error!";
    clearBanner(container);
    expect(container.className).toContain("hidden");
    expect(container.textContent).toBe("");
  });

  it("does nothing when container is null", () => {
    expect(() => clearBanner(null)).not.toThrow();
  });
});

// renderIngredientPills 
describe("renderIngredientPills", () => {
  it("renders a pill for each ingredient", () => {
    const container = document.createElement("div");
    renderIngredientPills(["tomato", "basil"], container);
    const pills = container.querySelectorAll(".pill");
    expect(pills).toHaveLength(2);
  });

  it("renders nothing for an empty array", () => {
    const container = document.createElement("div");
    renderIngredientPills([], container);
    expect(container.innerHTML).toBe("");
  });

  it("each pill has a remove button with data-tag", () => {
    const container = document.createElement("div");
    renderIngredientPills(["cheese"], container);
    const btn = container.querySelector(".pill-remove");
    expect(btn).not.toBeNull();
    expect(btn.dataset.tag).toBe("cheese");
  });

  it("does nothing when container is null", () => {
    expect(() => renderIngredientPills(["tomato"], null)).not.toThrow();
  });
});

//renderRecipeCards 
describe("renderRecipeCards", () => {
  const sampleRecipes = [
    {
      id: 1,
      title: "Pasta",
      image: "http://example.com/pasta.jpg",
      readyIn: 20,
      healthScore: 70,
      servings: 2,
      dietaryLabels: { vegetarian: true, vegan: false, glutenFree: false, dairyFree: false },
    },
    {
      id: 2,
      title: "Salad",
      image: null,
      readyIn: 10,
      healthScore: 90,
      servings: 1,
      dietaryLabels: { vegetarian: true, vegan: true, glutenFree: true, dairyFree: true },
    },
  ];

  it("renders the correct number of cards", () => {
    const container = document.createElement("div");
    renderRecipeCards(sampleRecipes, container);
    expect(container.querySelectorAll(".recipe-card")).toHaveLength(2);
  });

  it("shows the recipe title in each card", () => {
    const container = document.createElement("div");
    renderRecipeCards(sampleRecipes, container);
    const titles = [...container.querySelectorAll(".card-title")].map(el => el.textContent);
    expect(titles).toContain("Pasta");
    expect(titles).toContain("Salad");
  });

  it("shows empty state when passed an empty array", () => {
    const container = document.createElement("div");
    renderRecipeCards([], container);
    expect(container.querySelector(".empty-state")).not.toBeNull();
    expect(container.querySelectorAll(".recipe-card")).toHaveLength(0);
  });

  it("shows empty state when passed null", () => {
    const container = document.createElement("div");
    renderRecipeCards(null, container);
    expect(container.querySelector(".empty-state")).not.toBeNull();
  });

  it("shows a fallback when image is null", () => {
    const container = document.createElement("div");
    renderRecipeCards([sampleRecipes[1]], container);
    expect(container.querySelector(".card-image-fallback")).not.toBeNull();
    expect(container.querySelector("img")).toBeNull();
  });

  it("renders diet tags for active labels", () => {
    const container = document.createElement("div");
    renderRecipeCards([sampleRecipes[1]], container); // all 4 true
    const tags = container.querySelectorAll(".diet-tag");
    expect(tags.length).toBeGreaterThanOrEqual(2);
  });

  it("does nothing when container is null", () => {
    expect(() => renderRecipeCards(sampleRecipes, null)).not.toThrow();
  });
});

// renderSkeletons 
describe("renderSkeletons", () => {
  it("renders the specified number of skeleton cards", () => {
    const container = document.createElement("div");
    renderSkeletons(container, 3);
    expect(container.querySelectorAll(".skeleton-card")).toHaveLength(3);
  });

  it("defaults to 6 skeletons if count not specified", () => {
    const container = document.createElement("div");
    renderSkeletons(container);
    expect(container.querySelectorAll(".skeleton-card")).toHaveLength(6);
  });

  it("does nothing when container is null", () => {
    expect(() => renderSkeletons(null, 3)).not.toThrow();
  });
});
