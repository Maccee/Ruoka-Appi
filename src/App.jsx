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

  const [recipes, setRecipes] = useState([]); // MealList, Recipes
  const [fridgeItems, setFridgeItems] = useState([]); // MealLisst

  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [newItemUnit, setNewItemUnit] = useState("kpl");

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

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  const handleAddItem = (event) => {
    event.preventDefault();
    if (!newItemQuantity || newItemQuantity <= 0) {
      return;
    }
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

  // Update the fridgeItems state with the new values

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
                setFridgeItems={setFridgeItems}
                recipes={recipes}
                fridgeItems={fridgeItems}
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
            element={<Recipes recipes={recipes} setRecipes={setRecipes} />}
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
