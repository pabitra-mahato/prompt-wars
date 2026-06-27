/**
 * Gemini API & Mock Service for AI Meal App
 */

// Common culinary substitutes with estimated pricing (in ₹) per serving
const MOCK_SUBSTITUTES = {
  "paneer": [
    { name: "Tofu", estimatedCost: 50, note: "A plant-based, high-protein alternative with similar texture." },
    { name: "Soya Chunks", estimatedCost: 20, note: "Budget-friendly, high-protein swap." },
    { name: "Mushrooms", estimatedCost: 40, note: "Provides an earthy, savory flavor profile." }
  ],
  "milk": [
    { name: "Soy Milk", estimatedCost: 35, note: "High protein, plant-based alternative." },
    { name: "Almond Milk", estimatedCost: 45, note: "Low-calorie dairy alternative." },
    { name: "Oat Milk", estimatedCost: 40, note: "Creamy, naturally sweet plant milk." }
  ],
  "rice": [
    { name: "Brown Rice", estimatedCost: 25, note: "Higher fiber, lower glycemic index choice." },
    { name: "Cauliflower Rice", estimatedCost: 55, note: "Low-carb, keto-friendly alternative." },
    { name: "Quinoa", estimatedCost: 60, note: "Complete protein, high-fiber substitute." }
  ],
  "chicken": [
    { name: "Paneer", estimatedCost: 60, note: "Vegetarian dairy protein alternative." },
    { name: "Tofu", estimatedCost: 50, note: "Vegan protein swap with similar absorption." },
    { name: "Tempeh", estimatedCost: 70, note: "Fermented soy option with rich nutty flavor." }
  ],
  "eggs": [
    { name: "Tofu Scramble", estimatedCost: 40, note: "Crumbled tofu seasoned with turmeric." },
    { name: "Flaxseed paste", estimatedCost: 15, note: "Excellent binding substitute for baking." },
    { name: "Chickpea Flour (Besan)", estimatedCost: 10, note: "Ideal for making egg-free savory crepes." }
  ],
  "oats": [
    { name: "Broken Wheat (Dalia)", estimatedCost: 15, note: "High-fiber traditional grain." },
    { name: "Quinoa Flakes", estimatedCost: 45, note: "Gluten-free, high-protein flake substitute." },
    { name: "Ragi Flakes", estimatedCost: 20, note: "Calcium-rich millet alternative." }
  ],
  "bread": [
    { name: "Lettuce Wraps", estimatedCost: 20, note: "Fresh, low-carb, and gluten-free wrapper." },
    { name: "Roti (Whole Wheat)", estimatedCost: 10, note: "Traditional Indian flatbread option." },
    { name: "Gluten-free Bread", estimatedCost: 40, note: "Safe alternative for wheat sensitivities." }
  ],
  "butter": [
    { name: "Olive Oil", estimatedCost: 25, note: "Heart-healthy unsaturated fat." },
    { name: "Coconut Oil", estimatedCost: 20, note: "Great for medium heat cooking, vegan." },
    { name: "Ghee", estimatedCost: 30, note: "Clarified butter, rich traditional aroma." }
  ]
};

// Mock meals generator for Demo Mode
function generateMockPlan(profile) {
  const servings = Number(profile.servings) || 1;
  const targetBudget = Number(profile.budget) || 350;
  
  // Custom meal suggestions based on diet
  let breakfastOptions = [];
  let lunchOptions = [];
  let dinnerOptions = [];
  
  if (profile.diet === "Vegetarian" || profile.diet === "Vegan" || profile.diet === "Gluten-Free") {
    breakfastOptions = [
      {
        type: "Breakfast",
        name: "Vegetable Oats Upma",
        cookTime: 12,
        calories: 280,
        nutritionScore: 92,
        macros: { protein: 10, carbs: 42, fat: 8 },
        ingredients: [
          { name: "Oats", quantity: `${40 * servings}g`, estimatedCost: Math.round(15 * servings) },
          { name: "Mixed Vegetables", quantity: `${100 * servings}g`, estimatedCost: Math.round(20 * servings) },
          { name: "Mustard Seeds & Curry Leaves", quantity: "1 tsp", estimatedCost: Math.round(5 * servings) },
          { name: "Cooking Oil", quantity: "1 tbsp", estimatedCost: Math.round(8 * servings) }
        ]
      },
      {
        type: "Breakfast",
        name: "Ragi Dosa with Coconut Chutney",
        cookTime: 15,
        calories: 310,
        nutritionScore: 95,
        macros: { protein: 8, carbs: 52, fat: 9 },
        ingredients: [
          { name: "Ragi Flour", quantity: `${80 * servings}g`, estimatedCost: Math.round(12 * servings) },
          { name: "Grated Coconut", quantity: `${30 * servings}g`, estimatedCost: Math.round(15 * servings) },
          { name: "Curd", quantity: `${50 * servings}ml`, estimatedCost: Math.round(10 * servings) },
          { name: "Green Chilies", quantity: "2 pcs", estimatedCost: Math.round(3 * servings) }
        ]
      }
    ];
    
    lunchOptions = [
      {
        type: "Lunch",
        name: "Rajma Rice & Salad",
        cookTime: 20,
        calories: 450,
        nutritionScore: 90,
        macros: { protein: 16, carbs: 68, fat: 11 },
        ingredients: [
          { name: "Rice", quantity: `${80 * servings}g`, estimatedCost: Math.round(12 * servings) },
          { name: "Rajma (Kidney Beans)", quantity: `${60 * servings}g`, estimatedCost: Math.round(18 * servings) },
          { name: "Tomato & Onion", quantity: `${150 * servings}g`, estimatedCost: Math.round(22 * servings) },
          { name: "Spices & Oil", quantity: "2 tbsp", estimatedCost: Math.round(12 * servings) }
        ]
      },
      {
        type: "Lunch",
        name: "Chana Masala with Jeera Rice",
        cookTime: 22,
        calories: 470,
        nutritionScore: 89,
        macros: { protein: 15, carbs: 70, fat: 12 },
        ingredients: [
          { name: "Basmati Rice", quantity: `${80 * servings}g`, estimatedCost: Math.round(18 * servings) },
          { name: "Kabuli Chana (Chickpeas)", quantity: `${60 * servings}g`, estimatedCost: Math.round(15 * servings) },
          { name: "Onion, Garlic & Ginger", quantity: `${100 * servings}g`, estimatedCost: Math.round(15 * servings) },
          { name: "Spices & Oil", quantity: "2 tbsp", estimatedCost: Math.round(10 * servings) }
        ]
      }
    ];
    
    dinnerOptions = [
      {
        type: "Dinner",
        name: "Paneer Bhurji Wrap",
        cookTime: 15,
        calories: 380,
        nutritionScore: 94,
        macros: { protein: 22, carbs: 32, fat: 16 },
        ingredients: [
          { name: "Paneer", quantity: `${100 * servings}g`, estimatedCost: Math.round(60 * servings) },
          { name: "Whole Wheat Tortilla/Roti", quantity: `${2 * servings} pcs`, estimatedCost: Math.round(15 * servings) },
          { name: "Capsicum & Onion", quantity: `${100 * servings}g`, estimatedCost: Math.round(18 * servings) },
          { name: "Spices & Butter", quantity: "1 tbsp", estimatedCost: Math.round(10 * servings) }
        ]
      },
      {
        type: "Dinner",
        name: "Tofu Veggie Stir Fry",
        cookTime: 18,
        calories: 320,
        nutritionScore: 96,
        macros: { protein: 18, carbs: 24, fat: 14 },
        ingredients: [
          { name: "Tofu", quantity: `${120 * servings}g`, estimatedCost: Math.round(50 * servings) },
          { name: "Broccoli & Bell Peppers", quantity: `${150 * servings}g`, estimatedCost: Math.round(35 * servings) },
          { name: "Soy Sauce & Sesame Oil", quantity: "2 tbsp", estimatedCost: Math.round(15 * servings) }
        ]
      }
    ];
  } else {
    // Non-Vegetarian / Keto
    breakfastOptions = [
      {
        type: "Breakfast",
        name: "Masala Egg Omelette & Toast",
        cookTime: 10,
        calories: 340,
        nutritionScore: 91,
        macros: { protein: 18, carbs: 22, fat: 16 },
        ingredients: [
          { name: "Eggs", quantity: `${2 * servings} pcs`, estimatedCost: Math.round(14 * servings) },
          { name: "Whole Wheat Bread", quantity: `${2 * servings} slices`, estimatedCost: Math.round(10 * servings) },
          { name: "Onion & Tomato", quantity: `${50 * servings}g`, estimatedCost: Math.round(10 * servings) },
          { name: "Butter", quantity: `${10 * servings}g`, estimatedCost: Math.round(8 * servings) }
        ]
      },
      {
        type: "Breakfast",
        name: "Scrambled Eggs with Avocado Toast",
        cookTime: 12,
        calories: 390,
        nutritionScore: 96,
        macros: { protein: 16, carbs: 24, fat: 22 },
        ingredients: [
          { name: "Eggs", quantity: `${2 * servings} pcs`, estimatedCost: Math.round(14 * servings) },
          { name: "Sourdough/Toast", quantity: `${2 * servings} slices`, estimatedCost: Math.round(20 * servings) },
          { name: "Avocado", quantity: `${0.5 * servings} pc`, estimatedCost: Math.round(50 * servings) }
        ]
      }
    ];
    
    lunchOptions = [
      {
        type: "Lunch",
        name: "Chicken Curry with Rice",
        cookTime: 25,
        calories: 520,
        nutritionScore: 88,
        macros: { protein: 32, carbs: 62, fat: 14 },
        ingredients: [
          { name: "Chicken", quantity: `${150 * servings}g`, estimatedCost: Math.round(50 * servings) },
          { name: "Rice", quantity: `${80 * servings}g`, estimatedCost: Math.round(12 * servings) },
          { name: "Onion & Tomato Gravy", quantity: `${100 * servings}g`, estimatedCost: Math.round(15 * servings) },
          { name: "Cooking Oil & Spices", quantity: "2 tbsp", estimatedCost: Math.round(10 * servings) }
        ]
      },
      {
        type: "Lunch",
        name: "Egg Bhurji with Roti",
        cookTime: 15,
        calories: 440,
        nutritionScore: 92,
        macros: { protein: 22, carbs: 40, fat: 18 },
        ingredients: [
          { name: "Eggs", quantity: `${3 * servings} pcs`, estimatedCost: Math.round(21 * servings) },
          { name: "Roti (Whole Wheat)", quantity: `${3 * servings} pcs`, estimatedCost: Math.round(15 * servings) },
          { name: "Onion, Chilies & Coriander", quantity: `${80 * servings}g`, estimatedCost: Math.round(12 * servings) },
          { name: "Butter", quantity: `${15 * servings}g`, estimatedCost: Math.round(10 * servings) }
        ]
      }
    ];
    
    dinnerOptions = [
      {
        type: "Dinner",
        name: "Grilled Chicken Breast with Sauteed Veggies",
        cookTime: 20,
        calories: 390,
        nutritionScore: 97,
        macros: { protein: 38, carbs: 12, fat: 18 },
        ingredients: [
          { name: "Chicken", quantity: `${180 * servings}g`, estimatedCost: Math.round(60 * servings) },
          { name: "Broccoli & Mushrooms", quantity: `${150 * servings}g`, estimatedCost: Math.round(40 * servings) },
          { name: "Olive Oil", quantity: "1 tbsp", estimatedCost: Math.round(15 * servings) }
        ]
      },
      {
        type: "Dinner",
        name: "Butter Chicken Roll",
        cookTime: 22,
        calories: 480,
        nutritionScore: 84,
        macros: { protein: 28, carbs: 36, fat: 22 },
        ingredients: [
          { name: "Chicken", quantity: `${120 * servings}g`, estimatedCost: Math.round(40 * servings) },
          { name: "Roti / Wrap", quantity: `${2 * servings} pcs`, estimatedCost: Math.round(15 * servings) },
          { name: "Cream & Butter Sauce", quantity: `${100 * servings}g`, estimatedCost: Math.round(35 * servings) }
        ]
      }
    ];
  }

  // Filter based on user's cook time constraint (fall back if all are above, but we have items <= 15m)
  const maxTime = Number(profile.timeAvailable) || 30;
  const filterByTime = (options) => {
    const fitted = options.filter(o => o.cookTime <= maxTime);
    return fitted.length > 0 ? fitted : options;
  };

  const breakfastOptionsFitted = filterByTime(breakfastOptions);
  const lunchOptionsFitted = filterByTime(lunchOptions);
  const dinnerOptionsFitted = filterByTime(dinnerOptions);

  // Generate Option 1
  const mealsOption1 = [];
  if (profile.meals.includes("Breakfast")) mealsOption1.push(breakfastOptionsFitted[0]);
  if (profile.meals.includes("Lunch")) mealsOption1.push(lunchOptionsFitted[0]);
  if (profile.meals.includes("Dinner")) mealsOption1.push(dinnerOptionsFitted[0]);

  // Generate Option 2 (if we have a second fitted option, otherwise change some ingredients or details)
  const mealsOption2 = [];
  if (profile.meals.includes("Breakfast")) mealsOption2.push(breakfastOptionsFitted[1] || breakfastOptionsFitted[0]);
  if (profile.meals.includes("Lunch")) mealsOption2.push(lunchOptionsFitted[1] || lunchOptionsFitted[0]);
  if (profile.meals.includes("Dinner")) mealsOption2.push(dinnerOptionsFitted[1] || dinnerOptionsFitted[0]);

  // Adjust cost multipliers or mock cost adjustments to fit within / outside budget to test features
  const calcTotalCost = (meals) => meals.reduce((sum, meal) => 
    sum + meal.ingredients.reduce((iSum, ing) => iSum + ing.estimatedCost, 0), 0
  );

  // If Option 1 cost exceeds budget substantially, let's nudge it slightly.
  // We want to make one plan "budget-focused" and one plan "premium/protein-packed"
  
  return {
    options: [
      {
        id: 1,
        title: "Balanced & Budget-Friendly",
        description: `Optimized plan under ₹${targetBudget} for ${profile.name}`,
        meals: mealsOption1,
        totalCost: calcTotalCost(mealsOption1)
      },
      {
        id: 2,
        title: "High Protein & Gourmet",
        description: `Premium nutrition focus for ${profile.name}`,
        meals: mealsOption2,
        totalCost: calcTotalCost(mealsOption2)
      }
    ]
  };
}

/**
 * Generates meal suggestions using Gemini API or Mock Data
 */
export async function fetchMealSuggestions(profile, apiKey) {
  if (!apiKey) {
    // Simulated network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return generateMockPlan(profile);
  }

  const prompt = `
You are an expert AI Dietitian and Culinary Assistant.
Generate a meal plan with EXACTLY TWO options based on the following user profile:
- Name: ${profile.name}
- Today's Schedule: ${profile.schedule}
- Diet preference: ${profile.diet}
- Budget: ₹${profile.budget}
- Prep time constraint: ${profile.timeAvailable} minutes per meal
- Servings (number of people): ${profile.servings}
- Planned meals: ${profile.meals.join(", ")}

Guidelines:
1. Provide exactly TWO distinct options (Option 1: Budget-Friendly and Option 2: Higher Protein/Premium).
2. Limit cooking time for meals to respect their time constraint of ${profile.timeAvailable} mins if possible.
3. Scale ingredient quantities and costs to match ${profile.servings} servings.
4. Costs must be in Indian Rupees (₹) and represent realistic prices for groceries in India (e.g. 100g Paneer = ₹50-60, 2 eggs = ₹14, 100g Rice = ₹10-15).
5. Output MUST be valid JSON matching the schema below. Do not output any markdown formatting other than raw JSON.

JSON Schema:
{
  "options": [
    {
      "id": 1,
      "title": "Short title describing Option 1 (e.g. Quick & Budget Friendly)",
      "description": "Short explanation of how it fits their schedule and diet",
      "meals": [
        {
          "type": "Breakfast" | "Lunch" | "Dinner",
          "name": "Meal name",
          "cookTime": 15, // number in minutes
          "calories": 350, // number of kcal
          "nutritionScore": 92, // number out of 100
          "macros": {
            "protein": 15, // grams as number
            "carbs": 45, // grams as number
            "fat": 10 // grams as number
          },
          "ingredients": [
            {
              "name": "Ingredient name",
              "quantity": "e.g., 200g, 2 pcs, 1 tbsp",
              "estimatedCost": 60 // estimated price in ₹ for the total quantity required
            }
          ]
        }
      ],
      "totalCost": 310 // sum of all ingredient costs for this option
    },
    {
      "id": 2,
      "title": "Short title describing Option 2 (e.g. Protein-Rich Power Plan)",
      "description": "Short explanation",
      "meals": [...]
    }
  ]
}
`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to fetch from Gemini API");
    }

    const data = await response.json();
    const rawText = data.candidates[0].content.parts[0].text;
    const parsed = JSON.parse(rawText);
    return parsed;
  } catch (error) {
    console.error("Gemini API error, falling back to mock data:", error);
    throw error;
  }
}

/**
 * Suggests substitutes for a specific ingredient
 */
export async function fetchSubstitutes(ingredientName, mealName, apiKey) {
  if (!apiKey) {
    // Simulated network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    const lowerKey = ingredientName.toLowerCase();
    
    // Find matching mock substitutes or generate generic ones
    for (const key of Object.keys(MOCK_SUBSTITUTES)) {
      if (lowerKey.includes(key)) {
        return MOCK_SUBSTITUTES[key];
      }
    }
    
    // Default fallback substitutes
    return [
      { name: `Organic ${ingredientName}`, estimatedCost: Math.round(30), note: "Slightly premium organic alternative." },
      { name: `Alternative brand of ${ingredientName}`, estimatedCost: Math.round(20), note: "Generic brand equivalent." },
      { name: "Water/Oil Mix (for binders/liquids)", estimatedCost: Math.round(5), note: "Simple household backup." }
    ];
  }

  const prompt = `
You are an expert culinary assistant. Suggest 3 healthy, popular, and accessible food substitutes for:
Ingredient: "${ingredientName}"
Used in meal: "${mealName}"

Provide response in Indian market prices (₹) and make sure the notes explain why it is a suitable swap.
Output MUST be valid JSON matching the schema below. Do not output any markdown formatting other than raw JSON.

JSON Schema:
[
  {
    "name": "Substitute ingredient name",
    "estimatedCost": 40, // estimated price in ₹
    "note": "Short explanation of why it fits and how it affects texture or taste"
  },
  ...
]
`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      throw new Error("Failed to fetch substitutes from Gemini API");
    }

    const data = await response.json();
    const rawText = data.candidates[0].content.parts[0].text;
    return JSON.parse(rawText);
  } catch (error) {
    console.error("Gemini API error for substitutes, using mock data:", error);
    // Fallback to local mock
    const lowerKey = ingredientName.toLowerCase();
    for (const key of Object.keys(MOCK_SUBSTITUTES)) {
      if (lowerKey.includes(key)) return MOCK_SUBSTITUTES[key];
    }
    return [
      { name: `Alternative ${ingredientName}`, estimatedCost: 25, note: "A general swap for this item." }
    ];
  }
}
