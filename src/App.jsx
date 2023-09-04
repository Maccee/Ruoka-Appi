import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";


import "./App.css";

function App() {
  const [fridgeItems, setFridgeItems] = useState([]);

  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [newItemUnit, setNewItemUnit] = useState("kpl"); // default unit

  const [recipes, setRecipes] = useState([]);
  const [newRecipeName, setNewRecipeName] = useState("");
  const [newRecipeIngredients, setNewRecipeIngredients] = useState([
    { name: "", quantity: "", unit: "kpl" },
  ]);

  const [selectedRecipe, setSelectedRecipe] = useState(null);
  

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
      setNewRecipeIngredients([{ name: "", quantity: "", unit: "kpl" }]);
    }
  };

  const addIngredientToRecipe = () => {
    setNewRecipeIngredients([
      ...newRecipeIngredients,
      { name: "", quantity: "", unit: "kpl" },
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
              <>
                <h2>Mahdolliset ruuat</h2>
                <ul>
                  {possibleMeals.length === 0 && !selectedRecipe ? (
                    <p>Ei mitään aineksia tehdä mitään! Käy kaupassa tai lisää reseptejä!</p>
                  ) : (
                    possibleMeals.map((recipe, idx) => {
                      // Only render the selected recipe if one is selected
                      if (selectedRecipe && recipe.name !== selectedRecipe.name)
                        return null;
                      return (
                        <li
                          className="listMeals"
                          key={idx}
                          onClick={() => {
                            // If the recipe is already selected, deselect it
                            if (
                              selectedRecipe &&
                              recipe.name === selectedRecipe.name
                            ) {
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
                                <span className="ingredientName">
                                  {ing.name}
                                </span>
                                <span className="ingredientQuantity">
                                  ({ing.quantity} {ing.unit})
                                </span>
                              </li>
                            ))}
                          </ul>
                        </li>
                      );
                    })
                  )}
                </ul>
                {selectedRecipe && (
                  <div className="selectedMealWindow">
                    <h2>{selectedRecipe.name}, valmistusohjeet - Aika n. 14min</h2>
                    <ul>
                      {selectedRecipe.ingredients.map((ing, ingIdx) => (
                        <li key={ingIdx}>
                          <br /><br />
                          {ing.name} - {ing.quantity} {ing.unit}
                          <br /><br />
                          1. Heitä kaikki kattilaan ja nauti!
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => handleTehtyButtonClick(selectedRecipe)}
                    >
                      {" "}
                      Valmistin tämän ruuan{" "}
                    </button>
                  </div>
                )}
              </>
            }
          />

          <Route
            path="/stock"
            element={
              <>
                <h2>Ainekset ja Tarvikket</h2>
                <form className="stockForm" onSubmit={handleAddItem}>
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="Aines"
                  />
                  <div>
                    <input
                      type="number"
                      value={newItemQuantity}
                      onChange={(e) => setNewItemQuantity(e.target.value)}
                      placeholder="Määrä"
                    />
                    <select
                      value={newItemUnit}
                      onChange={(e) => setNewItemUnit(e.target.value)}
                    >
                      <option value="kpl">kpl</option>
                      <option value="kg">kg</option>
                      <option value="litraa">litraa</option>
                    </select>
                  </div>
                  <button type="submit">Lisää</button>
                </form>
                <hr />
                <ul>
                  {fridgeItems.map((item, idx) => (
                    <li className="stockItemsList" key={idx}>
                      <div className="itemDetails">
                        <div className="itemName">{item.name}</div>
                        <div className="itemQuantity">
                          {item.quantity} {item.unit}
                        </div>
                      </div>
                      <div className="itemActions">
                        <button onClick={() => handleModifyItem(item.name)}>
                          Muokkaa
                        </button>
                        <button onClick={() => handleRemoveItem(item.name)}>
                          Poista
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            }
          />

          <Route
            path="/recipes"
            element={
              <>
                <h2>Reseptit - Lisää</h2>
                <div>
                  <form className="recipeForm" onSubmit={handleAddRecipe}>
                    <input
                      value={newRecipeName}
                      onChange={(e) => setNewRecipeName(e.target.value)}
                      placeholder="Resepti"
                    />

                    {newRecipeIngredients.map((ingredient, idx) => (
                      <div key={idx}>
                        <input
                          value={ingredient.name}
                          onChange={(e) => {
                            const updatedIngredients = [
                              ...newRecipeIngredients,
                            ];
                            updatedIngredients[idx].name = e.target.value;
                            setNewRecipeIngredients(updatedIngredients);
                          }}
                          placeholder="Aines"
                        />
                        <input
                          type="number"
                          value={ingredient.quantity}
                          onChange={(e) => {
                            const updatedIngredients = [
                              ...newRecipeIngredients,
                            ];
                            updatedIngredients[idx].quantity = e.target.value;
                            setNewRecipeIngredients(updatedIngredients);
                          }}
                          placeholder="Määrä"
                        />
                        <select
                          value={ingredient.unit}
                          onChange={(e) => {
                            const updatedIngredients = [
                              ...newRecipeIngredients,
                            ];
                            updatedIngredients[idx].unit = e.target.value;
                            setNewRecipeIngredients(updatedIngredients);
                          }}
                        >
                          <option value="kpl">kpl</option>
                          <option value="kg">kg</option>
                          <option value="litraa">litraa</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleRemoveRecipeIngredient(idx)}
                        >
                          Poista Aines
                        </button>
                      </div>
                    ))}

                    <button type="button" onClick={addIngredientToRecipe}>
                      Lisää Uusi Aines
                    </button>
                    <button type="submit">Lisää Resepti</button>
                  </form>
                </div>
                <hr />
                <ul>
                  {recipes.map((recipe, idx) => (
                    <li className="recipeList" key={idx}>
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
                      <div className="recipeActions">
                        <button onClick={() => handleModifyRecipe(recipe.name)}>
                          Muokkaa
                        </button>
                        <button onClick={() => handleRemoveRecipe(recipe.name)}>
                          Poista
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            }
          />
        </Routes>

        <nav>
          <ul>
            <li>
              <Link to="/">Alkuun</Link>
            </li>
            <li>
              <Link to="/stock">Tarvikkeet</Link>
            </li>
            <li>
              <Link to="/recipes">Reseptit</Link>
            </li>
          </ul>
        </nav>
      </div>
    </Router>
  );
}

export default App;
