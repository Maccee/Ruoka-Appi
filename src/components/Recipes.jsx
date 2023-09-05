import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";

const Recipes = ({
  newRecipeName,
  setNewRecipeName,
  newRecipeIngredients,
  setNewRecipeIngredients,
  handleAddRecipe,
  inputRefs,
  handleRemoveRecipeIngredient,
  addIngredientToRecipe,
  showInstructions,
  setShowInstructions,
  newRecipeInstructions,
  setNewRecipeInstructions,
  recipes,
  handleModifyRecipe,
  handleRemoveRecipe,
}) => {
  return (
    <>
      <h2>Reseptit - Lisää</h2>
      <div>
        <form className="recipeForm" onSubmit={handleAddRecipe}>
          <input
            value={newRecipeName}
            onChange={(e) => setNewRecipeName(e.target.value)}
            placeholder="reseptin nimi"
          />
          <br />
          <br />
          <br />
          {newRecipeIngredients.map((ingredient, idx) => (
            <div key={idx}>
              <input
                ref={(el) => (inputRefs.current[idx] = el)}
                value={ingredient.name}
                onChange={(e) => {
                  const updatedIngredients = [...newRecipeIngredients];
                  updatedIngredients[idx].name = e.target.value;
                  setNewRecipeIngredients(updatedIngredients);
                }}
                placeholder="aines"
              />

              <div className="quantityDiv">
                <input
                  type="number"
                  value={ingredient.quantity}
                  onChange={(e) => {
                    const updatedIngredients = [...newRecipeIngredients];
                    updatedIngredients[idx].quantity = e.target.value;
                    setNewRecipeIngredients(updatedIngredients);
                  }}
                  placeholder="määrä"
                />
                <select
                  value={ingredient.unit}
                  onChange={(e) => {
                    const updatedIngredients = [...newRecipeIngredients];
                    updatedIngredients[idx].unit = e.target.value;
                    setNewRecipeIngredients(updatedIngredients);
                  }}
                >
                  <option value="kpl">kpl</option>
                  <option value="g">g</option>
                  <option value="litraa">litraa</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleRemoveRecipeIngredient(idx)}
                >
                  Poista
                </button>
              </div>
            </div>
          ))}
          <div className="reseptiNapit">
            <button type="submit" onClick={addIngredientToRecipe}>
              Lisää Aines
            </button>
            <button
              type="button"
              onClick={() => setShowInstructions(!showInstructions)}
            >
              Ohjeet
            </button>
            <button type="button" onClick={handleAddRecipe}>
              Lisää Resepti
            </button>
          </div>
          {showInstructions && (
            <textarea
              value={newRecipeInstructions}
              onChange={(e) => setNewRecipeInstructions(e.target.value)}
              placeholder="Valmistusohjeet"
            />
          )}
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
                <FontAwesomeIcon className="faIcon" icon={faPenToSquare} />
              </button>
              <button onClick={() => handleRemoveRecipe(recipe.name)}>
                <FontAwesomeIcon className="faIcon" icon={faTrashCan} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Recipes;
