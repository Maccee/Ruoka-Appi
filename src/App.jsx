import { useState, useEffect } from "react";
import { ReactComponent as Logo } from "./assets/logo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
  faList,
} from "@fortawesome/free-solid-svg-icons";

import "./App.css";
import OstosLista from "./components/OstosLista";

function App() {
  library.add(fas, faR, faPenToSquare, faTrashCan, faList);

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
          <Logo className="logo" />
          <FontAwesomeIcon
            className="syncIcon"
            icon="fa-solid fa-rotate"
            spin
          />
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
          <Route
            path="/ostoslista"
            element={
              <OstosLista
                fridgeItems={fridgeItems}
                setFridgeItems={setFridgeItems}
              />
            }
          />
        </Routes>

        <Navbar />
      </div>
    </Router>
  );
}

export default App;
