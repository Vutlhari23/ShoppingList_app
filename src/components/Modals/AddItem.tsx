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

export const AddItem = ({ onClose,onSubmit}: AddItemProps) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("personal");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  

  return (
    <Overlay onClose={onClose}>
      <ContentContainer
        className={styles['modal']}
        onClick={(e) => e.stopPropagation()}
        
      >
        <h3>Add new Item</h3>

        {error && <p style={{ color: "crimson", marginBottom: "10px" }}>{error}</p>}

        <label>Item name</label>
        <input
          type="text"
          value={name}
          placeholder="item"
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        <input
        type="file"
        
        
        ></input>

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
          onChange={(e) => setQuantity(Number(e.target.value))}
          min="1"
        />

        <ContentContainer className={styles['btn-container']}>
          
     
          <button
  type="button"
  onClick={async() => {
 await  onSubmit({
      name,
      category,
      quantity,
      
    });
    onClose();
  }}
>
  Add
</button>
        </ContentContainer>
      </ContentContainer>
    </Overlay>
  );
};

export default AddItem;
