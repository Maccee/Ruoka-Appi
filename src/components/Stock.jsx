import React from "react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";

const Stock = ({ fridgeItems, setFridgeItems }) => {
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [newItemUnit, setNewItemUnit] = useState("kpl");
  const [isFormVisible, setIsFormVisible] = useState(false);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  const handleAddItem = (event) => {
    event.preventDefault();
    let validQuantity = parseFloat(newItemQuantity.replace(",", "."));
    if (isNaN(validQuantity) || validQuantity <= 0) {
      return;
    }

    const itemName = capitalizeFirstLetter(newItemName.trim());

    const existingItem = fridgeItems.find((item) => item.name === itemName);

    if (existingItem) {
      if (existingItem.unit === newItemUnit) {
        existingItem.quantity = (
          parseFloat(existingItem.quantity) + validQuantity
        ).toString();
      } else {
        // Indicate mismatched item with "!"
        existingItem.name = `! ${existingItem.name}`;

        // Sum the quantities and default to "kpl" unit
        existingItem.quantity = (
          parseFloat(existingItem.quantity) + validQuantity
        ).toString();
        existingItem.unit = "kpl";
        alert(
          "Item found in fridge, please edit the item and check correct quantity and unit"
        );

        // Move the item to the top of the list
        const index = fridgeItems.indexOf(existingItem);
        if (index > -1) {
          fridgeItems.splice(index, 1);
        }
        fridgeItems.unshift(existingItem);
      }
      setFridgeItems([...fridgeItems]); // Refresh the state
    } else {
      const newItem = {
        name: itemName,
        quantity: validQuantity.toString(),
        unit: newItemUnit,
      };
      setFridgeItems([newItem, ...fridgeItems]);
    }
    setIsFormVisible(false);
    setNewItemName("");
    setNewItemQuantity("");
  };

  const handleModifyItem = (itemName) => {
    setIsFormVisible(true);
    const itemToModify = fridgeItems.find((item) => item.name === itemName);
    setNewItemName(itemToModify.name);
    setNewItemQuantity(itemToModify.quantity.toString());
    setNewItemUnit(itemToModify.unit);
    setFridgeItems((prevItems) =>
      prevItems.filter((item) => item.name !== itemName)
    );
  };

  const handleRemoveItem = (itemName) => {
    setFridgeItems((prevItems) =>
      prevItems.filter((item) => item.name !== itemName)
    );
  };

  return (
    <>
      <div className="stockHeader">
        <h2>Ainekset ja Tarvikket</h2>
        <button
          className="stockToggle"
          onClick={() => setIsFormVisible(!isFormVisible)}
        >
          {isFormVisible ? "Sulje" : "Lisää"}
        </button>
      </div>
      <div className={
          isFormVisible ? "stockFormContainer visible" : "stockFormContainer"
        }
      >
      <form className="stockForm" onSubmit={handleAddItem} noValidate>
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="elintarvike"
        />
        <div>
          <input
            type="number"
            pattern="\d*([.,]\d+)?"
            inputMode="decimal"
            value={newItemQuantity}
            onChange={(e) => setNewItemQuantity(e.target.value)}
            placeholder="määrä"
          />
          <select
            value={newItemUnit}
            onChange={(e) => setNewItemUnit(e.target.value)}
          >
            <option value="kpl">kpl</option>
            <option value="g">g</option>
            <option value="litraa">litraa</option>
          </select>
          <button type="submit">Valmis</button>
        </div>
      </form>
      </div>
      <hr />
      <ul>
        {fridgeItems.map((item, idx) => (
          <li className="stockItemsList" key={idx}>
            <div className="itemDetails">
              <div className="itemName">{item.name}</div>
              <span className="quantity">{item.quantity}</span>
              <span className="unit">{item.unit}</span>
            </div>
            <div className="itemActions">
              <button
                aria-label="Modify item"
                onClick={() => handleModifyItem(item.name)}
              >
                <FontAwesomeIcon className="faIcon" icon={faPenToSquare} />
              </button>
              <button
                aria-label="Remove item"
                onClick={() => handleRemoveItem(item.name)}
              >
                <FontAwesomeIcon className="faIcon" icon={faTrashCan} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Stock;
