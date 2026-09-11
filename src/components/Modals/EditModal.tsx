import { useState } from "react";

import { ContentContainer } from "../ContentContainer/ContentContainer";
import { Overlay } from "../Overlay/Overlay";
import { Button } from "../Button/Button";
import type { Item } from "../../type";

import styles from "../../components/Modals/AddItemModal.module.css";

type EditProps = {
  item: Item;
  onClose: () => void;
  onSaveEdits: (name: string, category: string, quantity: number) => void;
};

export const EditModal = ({ item, onClose, onSaveEdits }: EditProps) => {
  const [editName, setEditName] = useState(item.name);
  const [editCategory, setEditCategory] = useState(item.category);
  const [editQuantity, setEditQuantity] = useState(String(item.quantity));

  const handleSave = () => {
    if (!editName.trim()) {
      return;
    }

    if (!editCategory) {
      return;
    }

    if (!editQuantity || Number(editQuantity) < 1) {
      return;
    }

    onSaveEdits(editName.trim(), editCategory, Number(editQuantity));
  };

  return (
    <Overlay>
      <ContentContainer className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
         <ContentContainer className={styles.header}>
        <h3>Edit Item</h3>
        <i className="bi bi-x-lg"
        onClick={onClose}></i>
        </ContentContainer>

        <label>Item name</label>
        <input
          type="text"
          className={styles.input}
          value={editName}
          placeholder="Item"
          onChange={(e) => setEditName(e.target.value)}
          autoFocus
        /><br></br>

        <label>Choose a Category:</label>
        <select
          className={styles.input}
          id="category"
          name="category"
          value={editCategory}
          onChange={(e) => setEditCategory(e.target.value)}
        >
          <option value="">Select category</option>
          <option value="personal">Personal Care</option>
          <option value="household">Household &amp; Cleaning</option>
          <option value="beverage">Beverages</option>
          <option value="snacks">Snacks</option>
          <option value="fruits">Fruits &amp; Vegetables</option>
          <option value="meat">Meat</option>
          <option value="pantry">Pantry &amp; Canned Food</option>
        </select>
        <br/>

        <label>Quantity</label>
        <input
        className={styles.input}
          type="number"
          value={editQuantity}
          onChange={(e) => setEditQuantity(e.target.value)}
          min="1"
        />

        <ContentContainer className={styles.options}>
          <Button label="Cancel" type="button" onClick={onClose} />
          <Button 
          label="Save changes"
          type="button" onClick={handleSave}/>
        </ContentContainer>
      </ContentContainer>
    </Overlay>
  );
};