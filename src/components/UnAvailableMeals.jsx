import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const UnAvailableMeals = ({ recipe, fridgeItems }) => {
  const [isInShoppingList, setIsInShoppingList] = useState(false);

  const missingIngredients = recipe.ingredients.filter((ingredient) => {
    const fridgeItem = fridgeItems.find(
      (item) => item.name === ingredient.name
    );
    return (
      !fridgeItem || Number(fridgeItem.quantity) < Number(ingredient.quantity)
    );
  });

  useEffect(() => {
    const currentShoppingList =
      JSON.parse(localStorage.getItem("shoppingList")) || [];
    const missingInShoppingList = missingIngredients.every((missingItem) => {
      const existingItem = currentShoppingList.find(
        (item) => item.name === missingItem.name
      );
      return (
        existingItem &&
        Number(existingItem.quantity) >= Number(missingItem.quantity)
      );
    });
    setIsInShoppingList(missingInShoppingList);
  }, [missingIngredients]);

  const handleAddToShoppingList = () => {
    let currentShoppingList =
      JSON.parse(localStorage.getItem("shoppingList")) || [];
    missingIngredients.forEach((missingItem) => {
      const existingItem = currentShoppingList.find(
        (item) => item.name === missingItem.name
      );
      if (existingItem) {
        existingItem.quantity =
          Number(existingItem.quantity) + Number(missingItem.quantity);
      } else {
        currentShoppingList.push(missingItem);
      }
    });
    localStorage.setItem("shoppingList", JSON.stringify(currentShoppingList));
    console.log(
      "Items added or updated in the shopping list:",
      missingIngredients
    );

    // Check if all missing ingredients are in the shopping list now
    const missingInShoppingList = missingIngredients.every((missingItem) => {
      const existingItem = currentShoppingList.find(
        (item) => item.name === missingItem.name
      );
      return (
        existingItem &&
        Number(existingItem.quantity) >= Number(missingItem.quantity)
      );
    });
    setIsInShoppingList(missingInShoppingList);
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
          <button
            onClick={handleAddToShoppingList}
            style={{ color: isInShoppingList ? "gray" : "#0066cc" }}
          >
            <FontAwesomeIcon className="syncIcon" icon="fa-solid fa-list" />
          </button>
        </>
      )}
    </li>
  );
};

export default UnAvailableMeals;
