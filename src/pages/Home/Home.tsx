import { apiFetch } from "../../lib/api";
import type { Item } from "../../type";
import { useState, useEffect } from "react";
import { ContentContainer } from "../../components/ContentContainer/ContentContainer";
import { useParams } from "react-router-dom";
import { Button } from "../../components/Button/Button";

export const Home = () => {
  const { listId } = useParams();

  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      console.log("listId:", listId);

      const data = await apiFetch<Item[]>(
        `/items?shoppingListId=${listId}`,
        {},
        false,
      );

      console.log("Items from database:", data);

      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [listId]);

  const AddItem = async () => {
    try {
      const newItem = {
        name: name,
        category: category,
        quantity: quantity,
        shoppingListId: listId,
        createdAt: new Date().toISOString(),
      };

      const data = await apiFetch<Item>(
        `/items`,
        {
          method: "POST",
          body: JSON.stringify(newItem),
        },
        false,
      );
      console.log("Item added to the database:", data);
      setItems((prevItems) => [...prevItems, data]);
    } catch (error) {
      console.error("Failed to add items into the database :", error);
    }
  };
  // delete an item
 const deleteItem  =  async (itemid: string ) => {

  try{

    await apiFetch<void>(`/items/${itemid}`, {
      method: "DELETE",
      body: JSON.stringify({ id: itemid }),

    }, false);
    setItems((previousItems) => previousItems.filter((item) => item.id !== itemid));


  }catch(error){
    console.error("Failed  to delete the item from the database: ", error);
  }

 }


  return (
    <ContentContainer>
      <h1>Shopping List</h1>
      <Button label="Add Item" onClick={AddItem} />

      <ul>
        {items.map((item) => (
          <>
          <li key={item.id}>{item.name}</li>
          <button onClick={() => deleteItem(item.id)}>Delete</button>
          </>
        ))}
        
      </ul>
    </ContentContainer>
  );
};
