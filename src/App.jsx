import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [fridgeItems, setFridgeItems] = useState([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [newItemUnit, setNewItemUnit] = useState("pieces"); // default unit

  const [recipes, setRecipes] = useState([]);
  const [newRecipeName, setNewRecipeName] = useState("");
  const [newRecipeIngredients, setNewRecipeIngredients] = useState([
    { name: "", quantity: "", unit: "pieces" },
  ]);

  // Load fridge items and recipes from local storage on app start
  useEffect(() => {
    const savedItems = localStorage.getItem("fridgeItems");
    const savedRecipes = localStorage.getItem("recipes");
    if (savedItems) setFridgeItems(JSON.parse(savedItems));
    if (savedRecipes) setRecipes(JSON.parse(savedRecipes));
  }, []);

  // Save to local storage whenever fridgeItems or recipes change
  useEffect(() => {
    localStorage.setItem("fridgeItems", JSON.stringify(fridgeItems));
  }, [fridgeItems]);

  useEffect(() => {
    localStorage.setItem("recipes", JSON.stringify(recipes));
  }, [recipes]);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  const handleAddItem = (event) => {
    event.preventDefault();
    if (newItemName) {
      const itemName = capitalizeFirstLetter(newItemName);
      const newItem = {
        name: itemName,
        quantity: parseFloat(newItemQuantity), // convert string to float
        unit: newItemUnit,
      };
      setFridgeItems([...fridgeItems, newItem]);
      setNewItemName("");
      setNewItemQuantity("");
    }
  };

  const handleModifyItem = (itemName) => {
    const itemToModify = fridgeItems.find((item) => item.name === itemName);
    setNewItemName(itemToModify.name);
    setNewItemQuantity(itemToModify.quantity.toString()); // convert number to string
    setNewItemUnit(itemToModify.unit);
    // Remove the item from the list temporarily, until modifications are saved
    setFridgeItems((prevItems) =>
      prevItems.filter((item) => item.name !== itemName)
    );
  };
  const handleRemoveItem = (itemName) => {
    setFridgeItems((prevItems) =>
      prevItems.filter((item) => item.name !== itemName)
    );
  };

  const handleAddRecipe = (event) => {
    event.preventDefault();

    if (
      newRecipeName &&
      newRecipeIngredients.every((ing) => ing.name && ing.quantity)
    ) {
      const recipeName = capitalizeFirstLetter(newRecipeName);
      const ingredients = newRecipeIngredients.map((ing) => ({
        name: capitalizeFirstLetter(ing.name),
        quantity: ing.quantity,
        unit: ing.unit,
      }));

      const newRecipe = {
        name: recipeName,
        ingredients: ingredients,
      };
      setRecipes([...recipes, newRecipe]);
      setNewRecipeName("");
      setNewRecipeIngredients([{ name: "", quantity: "", unit: "pieces" }]);
    }
  };

  const addIngredientToRecipe = () => {
    setNewRecipeIngredients([
      ...newRecipeIngredients,
      { name: "", quantity: "", unit: "pieces" },
    ]);
  };

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

  const handleRemoveRecipe = (recipeName) => {
    setRecipes((prevRecipes) =>
      prevRecipes.filter((recipe) => recipe.name !== recipeName)
    );
  };

  const handleModifyRecipe = (recipeName) => {
    const recipeToModify = recipes.find((recipe) => recipe.name === recipeName);
    setNewRecipeName(recipeToModify.name);
    setNewRecipeIngredients(recipeToModify.ingredients);
    // Remove the recipe from the list temporarily, until modifications are saved
    handleRemoveRecipe(recipeName);
  };
  const handleRemoveRecipeIngredient = (index) => {
    const updatedIngredients = [...newRecipeIngredients];
    updatedIngredients.splice(index, 1);
    setNewRecipeIngredients(updatedIngredients);
  };

  return (
    <div className="App">
      <h2>Fridge Contents</h2>
      <form onSubmit={handleAddItem}>
        <input
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Ingredient name"
        />
        <input
          type="number"
          value={newItemQuantity}
          onChange={(e) => setNewItemQuantity(e.target.value)}
          placeholder="Quantity"
        />
        <select
          value={newItemUnit}
          onChange={(e) => setNewItemUnit(e.target.value)}
        >
          <option value="pieces">pieces</option>
          <option value="kilograms">kilograms</option>
          <option value="litres">litres</option>
          {/* add any other units you'd like */}
        </select>
        <button type="submit">Add</button>
      </form>
      <ul>
        {fridgeItems.map((item, idx) => (
          <li key={idx}>
            {item.name} - {item.quantity} {item.unit}
            <button onClick={() => handleModifyItem(item.name)}>Modify</button>
            <button onClick={() => handleRemoveItem(item.name)}>Remove</button>
          </li>
        ))}
      </ul>

      <h2>Recipe Creation</h2>
      <div>
        <form onSubmit={handleAddRecipe}>
          <input
            value={newRecipeName}
            onChange={(e) => setNewRecipeName(e.target.value)}
            placeholder="Recipe name"
          />

          {newRecipeIngredients.map((ingredient, idx) => (
            <div key={idx}>
              <input
                value={ingredient.name}
                onChange={(e) => {
                  const updatedIngredients = [...newRecipeIngredients];
                  updatedIngredients[idx].name = e.target.value;
                  setNewRecipeIngredients(updatedIngredients);
                }}
                placeholder="Ingredient name"
              />
              <input
                type="number"
                value={ingredient.quantity}
                onChange={(e) => {
                  const updatedIngredients = [...newRecipeIngredients];
                  updatedIngredients[idx].quantity = e.target.value;
                  setNewRecipeIngredients(updatedIngredients);
                }}
                placeholder="Quantity"
              />
              <select
                value={ingredient.unit}
                onChange={(e) => {
                  const updatedIngredients = [...newRecipeIngredients];
                  updatedIngredients[idx].unit = e.target.value;
                  setNewRecipeIngredients(updatedIngredients);
                }}
              >
                <option value="pieces">pieces</option>
                <option value="kilograms">kilograms</option>
                <option value="litres">litres</option>
                {/* add any other units you'd like */}
              </select>
              <button
                type="button"
                onClick={() => handleRemoveRecipeIngredient(idx)}
              >
                Remove Ingredient
              </button>
            </div>
          ))}

          <button type="button" onClick={addIngredientToRecipe}>
            Add another ingredient
          </button>
          <button type="submit">Add Recipe</button>
        </form>
      </div>

      <ul>
        {recipes.map((recipe, idx) => (
          <li key={idx}>
            {recipe.name} - Ingredients:{" "}
            {recipe.ingredients
              .map((ing) => `${ing.name} - ${ing.quantity} ${ing.unit}`)
              .join(", ")}
            <button onClick={() => handleModifyRecipe(recipe.name)}>
              Modify
            </button>
            <button onClick={() => handleRemoveRecipe(recipe.name)}>
              Remove
            </button>
          </li>
        ))}
      </ul>

      <h2>Possible Meals</h2>
      <ul>
        {possibleMeals.map((recipe, idx) => (
          <li key={idx}>
            {recipe.name} - Ingredients:
            {recipe.ingredients
              .map((ing) => ` ${ing.name} (${ing.quantity} ${ing.unit})`)
              .join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
