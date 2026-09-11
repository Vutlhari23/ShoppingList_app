import { useState } from "react";
import { Overlay } from "../Overlay/Overlay";
import { ContentContainer } from "../ContentContainer/ContentContainer";
import styles from "../Modals/AddItemModal.module.css";

export type NewItem = {
  name: string;
  category: string;
  quantity: number;
};

export type AddItemProps = {
  onClose: () => void;
  onSubmit: (newItem: NewItem) => Promise<void> | void;
};

export const AddItem = ({ onClose, onSubmit }: AddItemProps) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("personal");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  return (
    <Overlay>
      <ContentContainer
        className={styles["modal"]}
        onClick={(e) => e.stopPropagation()}
      >
        <ContentContainer className={styles.header}>
          <h3>Add new Item</h3>
          <i className="bi bi-x-lg" onClick={onClose}></i>
        </ContentContainer>

        {error && (
          <p style={{ color:"red", marginBottom: "10px" }}>{error}</p>
        )}

        <label>Item name</label>
        <input
          type="text"
          className={styles.input}
          value={name}
          placeholder="item"
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />

        <label>Choose a Category:</label>
        <select
          id="category"
          className={styles.input}
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
          className={styles.input}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min="1"
        />

        <ContentContainer className={styles["options"]}>
          <button type="button" onClick={onClose}>
            {" "}
            Cancel
          </button>

          <button
            type="button"
            onClick={async () => {
              if(!name.trim()){
                setError("Please enter an item name");
                return;
              }
              if(quantity<1){
                setError("Quantity must be at least 1");
                return;
              }
              setError("");

              await onSubmit({
                name,
                category,
                quantity,
              });
              onClose();
            }}
          >
            Save
          </button>
        </ContentContainer>
      </ContentContainer>
    </Overlay>
  );
};

export default AddItem;
