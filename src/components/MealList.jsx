import React from "react";
import { useState } from "react";

const MealList = ({ setFridgeItems, recipes, fridgeItems }) => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const possibleMeals = recipes.filter((recipe) =>
    recipe.ingredients.every((ingredient) => {
      const fridgeItem = fridgeItems.find(
        (item) => item.name === ingredient.name
      );
      // If ingredient is not in fridge, or the quantity in fridge is less than needed, return false
      if (!fridgeItem || fridgeItem.quantity < ingredient.quantity) {
        return false;
      }
      // Otherwise, this ingredient is okay
      return true;
    })
  );

  function handleTehtyButtonClick(recipe) {
    // Create a copy of the fridgeItems to update
    let updatedFridgeItems = [...fridgeItems];

    // For each ingredient in the recipe
    recipe.ingredients.forEach((recipeIngredient) => {
      // Find this ingredient in the stock
      const fridgeItem = updatedFridgeItems.find(
        (ing) => ing.name === recipeIngredient.name
      );

      if (fridgeItem) {
        // Subtract the required amount from the fridge item
        fridgeItem.quantity -= recipeIngredient.quantity;

        // If the quantity of the fridge item reaches 0, remove it from the list
        if (fridgeItem.quantity <= 0) {
          updatedFridgeItems = updatedFridgeItems.filter(
            (item) => item.name !== fridgeItem.name
          );
        }
      }
    });
    // Deselect the current recipe
    setSelectedRecipe(null);
    setFridgeItems(updatedFridgeItems);
  }
  return (
    <>
      <h2>Mahdolliset ruuat</h2>
      <hr />
      <ul>
        {possibleMeals.length === 0 && !selectedRecipe ? (
          <p>
            Ei mitään aineksia tehdä mitään! Käy kaupassa tai lisää reseptejä!
          </p>
        ) : (
          possibleMeals.map((recipe, idx) => {
            return (
              <li
                className="listMeals"
                key={idx}
                onClick={() => {
                  if (selectedRecipe && recipe.name === selectedRecipe.name) {
                    setSelectedRecipe(null);
                  } else {
                    setSelectedRecipe(recipe);
                  }
                }}
              >
                <p>{recipe.name}:</p>
                <ul>
                  {recipe.ingredients.map((ing, ingIdx) => (
                    <li key={ingIdx} className="ingredientItem">
                      <span className="ingredientName">{ing.name}</span>
                      <span className="ingredientQuantity">
                        ({ing.quantity} {ing.unit})
                      </span>
                    </li>
                  ))}
                </ul>

                {selectedRecipe && recipe.name === selectedRecipe.name && (
                  <div className="selectedMealWindow">
                    <hr />
                    <h2>Valmistusohjeet</h2>
                    <p>{selectedRecipe.instructions}</p>
                    <button
                      onClick={() => handleTehtyButtonClick(selectedRecipe)}
                    >
                      Valmistin tämän ruuan
                    </button>
                  </div>
                )}
              </li>
            );
          })
        )}
      </ul>
    </>
  );
};

export default MealList;
