import { useState } from "react";
import { Overlay } from "../Overlay/Overlay";
import { ContentContainer } from "../ContentContainer/ContentContainer";
import styles from "../Modals/AddItemModel.module.css";

export type NewItem = {
  name: string;
  category: string;
  quantity: string;
};

export type AddItemProps = {
  onClose: () => void;
  onSubmit: (newItem: NewItem) => void;
};

export const AddItem = ({ onClose, onSubmit }: AddItemProps) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");

  return (
    <Overlay onClose={onClose}>
      <ContentContainer
        className={styles["modal"]}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Add new Item</h3>

        <label>Item name</label>
        <input
          type="text"
          value={name}
          placeholder="item"
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />

        <label>Choose a Category:</label>
        <select
          id="category"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="personal">Personal Care</option>
          <option value="household">HouseHold & Cleaning</option>
          <option value="beverage">Beverages</option>
          <option value="snacks">Snacks</option>
          <option value="fruits">Fruits & Vegetables</option>
          <option value="meat">Meat</option>
          <option value="pantry">Pantry & canned food</option>
        </select>

        <label>Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <div>
          <button
            type="button"
            onClick={() => onSubmit({ name, category, quantity })}
          >
            Add
          </button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </ContentContainer>
    </Overlay>
  );
};

export default AddItem;
