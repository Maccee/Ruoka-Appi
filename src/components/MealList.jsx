import React from "react";

const MealList = ({
  possibleMeals,
  selectedRecipe,
  setSelectedRecipe,
  handleTehtyButtonClick,
}) => {
  return (
    <>
      <h2>Mahdolliset ruuat</h2>
      <hr />
      <ul>
        {possibleMeals.length === 0 && !selectedRecipe ? (
          <p>
            Ei mitään aineksia tehdä mitään! Käy kaupassa tai lisää reseptejä!
          </p>
        ) : (
          possibleMeals.map((recipe, idx) => {
            return (
              <li
                className="listMeals"
                key={idx}
                onClick={() => {
                  if (selectedRecipe && recipe.name === selectedRecipe.name) {
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
                      <span className="ingredientName">{ing.name}</span>
                      <span className="ingredientQuantity">
                        ({ing.quantity} {ing.unit})
                      </span>
                    </li>
                  ))}
                </ul>

                {selectedRecipe && recipe.name === selectedRecipe.name && (
                  <div className="selectedMealWindow">
                    <hr />
                    <h2>Valmistusohjeet</h2>
                    <p>{selectedRecipe.instructions}</p>
                    <button
                      onClick={() => handleTehtyButtonClick(selectedRecipe)}
                    >
                      Valmistin tämän ruuan
                    </button>
                  </div>
                )}
              </li>
            );
          })
        )}
      </ul>
    </>
  );
};

export default MealList;
