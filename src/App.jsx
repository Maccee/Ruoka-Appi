import { useState, useEffect } from "react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MealList from "./components/MealList";
import Stock from "./components/Stock";
import Recipes from "./components/Recipes";
import Navbar from "./components/Navbar";

import { library } from "@fortawesome/fontawesome-svg-core";
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
  const [fridgeItems, setFridgeItems] = useState([]); // MealList

  useEffect(() => {
    const savedItems = localStorage.getItem("fridgeItems");
    const savedRecipes = localStorage.getItem("recipes");
    if (savedItems) setFridgeItems(JSON.parse(savedItems));
    if (savedRecipes) setRecipes(JSON.parse(savedRecipes));
  }, []);

  useEffect(() => {
    localStorage.setItem("fridgeItems", JSON.stringify(fridgeItems));
  }, [fridgeItems]);

  return (
    <Router>
      <div className="App">
        <header>
          <h1>R</h1>
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

        <Navbar />
      </div>
    </Router>
  );
}

export default App;
