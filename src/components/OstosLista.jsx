import { useState, useEffect } from "react";

const OstosLista = ({ fridgeItems, setFridgeItems }) => {
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
    let updatedFridgeItems = [...fridgeItems]; // make a copy of the current fridgeItems to prevent direct mutations
    
    // Iterate over each shopping list item
    shoppingList.forEach((item, index) => {
      if (clickedItems[index]) {  // Check if the item was clicked/strikethrough
        // Check if the item is already in updatedFridgeItems
        const existingItem = updatedFridgeItems.find(
          (fridgeItem) => fridgeItem.name === item.name && fridgeItem.unit === item.unit
        );
  
        if (existingItem) {
          // If item exists in fridge, increase its quantity
          existingItem.quantity = Number(existingItem.quantity) + Number(item.quantity);
        } else {
          // If item doesn't exist in fridge, add it
          updatedFridgeItems.push(item);
        }
      }
    });
  
    // Update the state directly
    setFridgeItems(updatedFridgeItems);
  
    const updatedShoppingList = shoppingList.filter(
      (_, index) => !clickedItems[index]
    );
  
    // Update local storage for shoppingList
    localStorage.setItem("shoppingList", JSON.stringify(updatedShoppingList));
  
    // Update component state
    setShoppingList(updatedShoppingList);
    setClickedItems({});
  };
  
  

  return (
    <div className="shoppingList">
      <h2>OstosLista</h2>
      <hr />
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
