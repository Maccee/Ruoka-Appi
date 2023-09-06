import React from "react";
import { useState } from "react";

const MealList = ({ setFridgeItems, recipes, fridgeItems }) => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const possibleMeals = recipes.filter((recipe) => {
    return recipe.ingredients.every((ingredient) => {
      const fridgeItem = fridgeItems.find(
        (item) => item.name === ingredient.name
      );
      console.log("Ingredient:", ingredient);
      console.log("Matching fridge item:", fridgeItem);

      if (!fridgeItem) {
      } else if (fridgeItem.quantity < ingredient.quantity) {
      }
      if (
        !fridgeItem ||
        Number(fridgeItem.quantity) < Number(ingredient.quantity)
      ) {
        return false;
      }
      return true;
    });
  });

  function handleTehtyButtonClick(recipe) {
    let updatedFridgeItems = [...fridgeItems];
    recipe.ingredients.forEach((recipeIngredient) => {
      const fridgeItem = updatedFridgeItems.find(
        (ing) => ing.name === recipeIngredient.name
      );
      if (fridgeItem) {
        fridgeItem.quantity = parseFloat(
          (fridgeItem.quantity - recipeIngredient.quantity).toFixed(1)
        );
        if (fridgeItem.quantity <= 0) {
          updatedFridgeItems = updatedFridgeItems.filter(
            (item) => item.name !== fridgeItem.name
          );
        }
      }
    });
    setSelectedRecipe(null);
    setFridgeItems(updatedFridgeItems);
  }

  return (
    <>
      <h2>Mahdolliset ruuat</h2>
      <hr />
      <ul>
        {possibleMeals.length === 0 && !selectedRecipe ? (
          <p className="defaultMessage">
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
