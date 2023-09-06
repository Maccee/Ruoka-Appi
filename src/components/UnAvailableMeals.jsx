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
  const handleAddToShoppingList = () => {
    // Retrieve the current shopping list from local storage
    let currentShoppingList =
      JSON.parse(localStorage.getItem("shoppingList")) || [];

    // For each missing ingredient:
    missingIngredients.forEach((missingItem) => {
      // Check if the ingredient already exists in the shopping list
      const existingItem = currentShoppingList.find(
        (item) => item.name === missingItem.name
      );

      if (existingItem) {
        // Ensure the quantities are numbers, then add them together
        existingItem.quantity =
          Number(existingItem.quantity) + Number(missingItem.quantity);
      } else {
        // If it doesn't, add the missing ingredient to the shopping list
        currentShoppingList.push(missingItem);
      }
    });

    // Store the updated shopping list in local storage
    localStorage.setItem("shoppingList", JSON.stringify(currentShoppingList));

    // Log the added or updated items
    console.log(
      "Items added or updated in the shopping list:",
      missingIngredients
    );

    alert("Items added to the shopping list!");
  };

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
          <p>Puuttuvat ainekset:</p>
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
          <button onClick={handleAddToShoppingList}>Ostoslistalle</button>
        </>
      )}
    </li>
  );
};

export default UnAvailableMeals;
