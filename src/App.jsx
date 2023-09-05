import { useState, useEffect } from "react";
import React, { useRef } from "react";

import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import MealList from "./components/MealList";
import Stock from "./components/Stock";
import Recipes from "./components/Recipes";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  fas,
  faPenToSquare,
  faTrashCan,
  faR,
} from "@fortawesome/free-solid-svg-icons";

import "./App.css";

function App() {
  library.add(fas, faR, faPenToSquare, faTrashCan);
  const [fridgeItems, setFridgeItems] = useState([]);

  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [newItemUnit, setNewItemUnit] = useState("kpl"); // default unit

  const [recipes, setRecipes] = useState([]);
  const [newRecipeName, setNewRecipeName] = useState("");
  const [newRecipeIngredients, setNewRecipeIngredients] = useState([
    { name: "", quantity: "", unit: "kpl" },
  ]);
  const [newRecipeInstructions, setNewRecipeInstructions] = useState("");
  const [showInstructions, setShowInstructions] = useState(false);

  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const [ingredientCount, setIngredientCount] = useState(0);
  const inputRefs = useRef([]);

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
      const itemName = capitalizeFirstLetter(newItemName.trim());
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
    if (showInstructions) {
      setShowInstructions(!showInstructions);
    }

    if (
      newRecipeName &&
      newRecipeIngredients.every((ing) => ing.name && ing.quantity)
    ) {
      const recipeName = capitalizeFirstLetter(newRecipeName);
      const ingredients = newRecipeIngredients.map((ing) => ({
        name: capitalizeFirstLetter(ing.name.trim()),
        quantity: ing.quantity,
        unit: ing.unit,
      }));

      const newRecipe = {
        name: recipeName,
        ingredients: ingredients,
        instructions: newRecipeInstructions, // Added this line
      };
      setRecipes([...recipes, newRecipe]);
      setNewRecipeName("");
      setNewRecipeInstructions(""); // Reset the instructions field
      setNewRecipeIngredients([{ name: "", quantity: "", unit: "kpl" }]);
    }
  };

  const addIngredientToRecipe = () => {
    setNewRecipeIngredients([
      ...newRecipeIngredients,
      { name: "", quantity: "", unit: "kpl" },
    ]);
    setIngredientCount(newRecipeIngredients.length + 1);
  };
  useEffect(() => {
    if (ingredientCount > 0 && inputRefs.current.length === ingredientCount) {
      const lastInput = inputRefs.current[inputRefs.current.length - 1];
      if (lastInput) lastInput.focus();
    }
  }, [ingredientCount, inputRefs.current]);

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
    setNewRecipeInstructions(recipeToModify.instructions); // Added this line
    // Remove the recipe from the list temporarily, until modifications are saved
    handleRemoveRecipe(recipeName);
  };

  const handleRemoveRecipeIngredient = (index) => {
    const updatedIngredients = [...newRecipeIngredients];
    updatedIngredients.splice(index, 1);
    setNewRecipeIngredients(updatedIngredients);
  };

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

    // Update the fridgeItems state with the new values
    setFridgeItems(updatedFridgeItems);

    // Deselect the current recipe
    setSelectedRecipe(null);
  }

  return (
    <Router>
      <div className="App">
        <header>
          <h1>Ruokaappi!</h1>
        </header>

        <Routes>
          <Route
            path="/"
            element={
              <MealList
                possibleMeals={possibleMeals}
                selectedRecipe={selectedRecipe}
                setSelectedRecipe={setSelectedRecipe}
                handleTehtyButtonClick={handleTehtyButtonClick}
              />
            }
          />
          <Route
            path="/stock"
            element={
              <Stock
                newItemName={newItemName}
                setNewItemName={setNewItemName}
                newItemQuantity={newItemQuantity}
                setNewItemQuantity={setNewItemQuantity}
                newItemUnit={newItemUnit}
                setNewItemUnit={setNewItemUnit}
                handleAddItem={handleAddItem}
                fridgeItems={fridgeItems}
                handleModifyItem={handleModifyItem}
                handleRemoveItem={handleRemoveItem}
              />
            }
          />
          <Route
            path="/recipes"
            element={
              <Recipes
                newRecipeName={newRecipeName}
                setNewRecipeName={setNewRecipeName}
                newRecipeIngredients={newRecipeIngredients}
                setNewRecipeIngredients={setNewRecipeIngredients}
                handleAddRecipe={handleAddRecipe}
                inputRefs={inputRefs}
                handleRemoveRecipeIngredient={handleRemoveRecipeIngredient}
                addIngredientToRecipe={addIngredientToRecipe}
                showInstructions={showInstructions}
                setShowInstructions={setShowInstructions}
                newRecipeInstructions={newRecipeInstructions}
                setNewRecipeInstructions={setNewRecipeInstructions}
                recipes={recipes}
                handleModifyRecipe={handleModifyRecipe}
                handleRemoveRecipe={handleRemoveRecipe}
              />
            }
          />
        </Routes>

        <nav>
          <ul>
            <li>
              <Link to="/">
                <FontAwesomeIcon icon="fa-solid fa-utensils" />
                <span>Ruuat</span>
              </Link>
            </li>
            <li>
              <Link to="/stock">
                <FontAwesomeIcon icon="fa-solid fa-cubes-stacked" />
                <span>Ainekset</span>
              </Link>
            </li>
            <li>
              <Link to="/recipes">
                <FontAwesomeIcon icon="fa-solid fa-book" />
                <span>Reseptit</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </Router>
  );
}

export default App;
