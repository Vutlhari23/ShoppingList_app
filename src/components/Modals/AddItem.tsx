import { useState } from "react";
import { Overlay } from "../Overlay/Overlay";
import { ContentContainer } from "../ContentContainer/ContentContainer";
import styles from '../Modals/AddItemModel.module.css'

export type NewItem = {
  name: string;
  quantity: number;
  notes?: string;
  category: string;
  image?: string;
};

export type AddItemProps = {
  onClose: () => void;
  onSubmit: (newItem: NewItem) => void;
};

export const AddItem = ({ onClose, onSubmit }: AddItemProps) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState("");

  return (
    <Overlay onClose={onClose}>
      <ContentContainer className={styles['modal']}>
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
          <option value="" disabled>Select a category</option>
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
          min={1}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />

        <label>Notes (optional)</label>
        <input
          type="text"
          value={notes}
          placeholder="e.g,brand preference, size"
          onChange={(e) => setNotes(e.target.value)}
        />

        <label>Image URL (optional)</label>
        <input
          type="text"
          value={image}
          placeholder="https://..."
          onChange={(e) => setImage(e.target.value)}
        />

        <div>
          <button
            type="button"
            onClick={() =>
              onSubmit({
                name,
                quantity,
                category,
                notes: notes || undefined,
                image: image || undefined,
              })
            }
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