import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";

const Stock = ({
  newItemName,
  setNewItemName,
  newItemQuantity,
  setNewItemQuantity,
  newItemUnit,
  setNewItemUnit,
  handleAddItem,
  fridgeItems,
  handleModifyItem,
  handleRemoveItem,
}) => {
  return (
    <>
      <h2>Ainekset ja Tarvikket</h2>
      <form className="stockForm" onSubmit={handleAddItem}>
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="elintarvike"
        />
        <div>
          <input
            type="number"
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
          <button type="submit">Lisää</button>
        </div>
      </form>
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
