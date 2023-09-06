import { useState, useEffect } from "react";

const OstosLista = () => {
  const [shoppingList, setShoppingList] = useState([]);
  const [clickedItems, setClickedItems] = useState({});

  useEffect(() => {
    const retrievedShoppingList =
      JSON.parse(localStorage.getItem("shoppingList")) || [];
    setShoppingList(retrievedShoppingList);
  }, []);

  const handleItemClick = (index) => {
    // Toggle the clicked state for the item
    setClickedItems((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const clearStrikethroughItems = () => {
    const updatedShoppingList = shoppingList.filter(
      (_, index) => !clickedItems[index]
    );

    // Update local storage
    localStorage.setItem("shoppingList", JSON.stringify(updatedShoppingList));

    // Update component state
    setShoppingList(updatedShoppingList);
    setClickedItems({});
  };

  return (
    <div className="shoppingList">
      <h2>OstosLista</h2>
      {shoppingList.length > 0 ? (
        <>
          <ul>
            {shoppingList.map((item, index) => (
              <li
                key={index}
                onClick={() => handleItemClick(index)}
                className={clickedItems[index] ? "strikethrough" : ""}
              >
                {item.name} ({item.quantity} {item.unit})
              </li>
            ))}
          </ul>
          <button
            className="ostosListaButton"
            onClick={clearStrikethroughItems}
          >
            Tyhjennä
          </button>
        </>
      ) : (
        <p className="tyhjaLista">Ostoslista on tyhjä!</p>
      )}
    </div>
  );
};

export default OstosLista;
