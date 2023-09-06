import { useState, useEffect } from "react";

const OstosLista = ({ recipes }) => {
  return (
    <div>
      <h2>OstosLista</h2>
      <ul>
        {recipes.map((recipe, index) => (
          <li key={index}>{recipe.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default OstosLista;
