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

  useEffect(() => {
    const savedItems = localStorage.getItem("fridgeItems");
    const savedRecipes = localStorage.getItem("recipes");
    if (savedItems) setFridgeItems(JSON.parse(savedItems));
    if (savedRecipes) setRecipes(JSON.parse(savedRecipes));
  }, []);

  useEffect(() => {
    localStorage.setItem("fridgeItems", JSON.stringify(fridgeItems));
  }, [fridgeItems]);

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
                fridgeItems={fridgeItems}
                setFridgeItems={setFridgeItems}
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
