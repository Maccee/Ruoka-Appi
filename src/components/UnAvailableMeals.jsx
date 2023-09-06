import React from "react";

const UnAvailableMeals = ({ recipe, fridgeItems }) => {
  // Get missing ingredients
  const missingIngredients = recipe.ingredients.filter((ingredient) => {
    const fridgeItem = fridgeItems.find(
      (item) => item.name === ingredient.name
    );
    return (
      !fridgeItem || Number(fridgeItem.quantity) < Number(ingredient.quantity)
    );
  });

  return (
    <li className="listMeals greyedOut">
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
      {missingIngredients.length > 0 && (
        <>
          <p>Missing:</p>
          <ul>
            {missingIngredients.map((ing, ingIdx) => (
              <li key={ingIdx} className="missingIngredientItem">
                <span className="ingredientName">{ing.name}</span>
                <span className="ingredientQuantity">
                  ({ing.quantity} {ing.unit})
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </li>
  );
};

export default UnAvailableMeals;
