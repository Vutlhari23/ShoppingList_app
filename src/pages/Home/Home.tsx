import { useEffect, useState } from 'react';


interface GroceryItem {
  id: string;
  name: string;
}

export const Home = () => {

  const [name, setName] = useState<string>('');
  const [grocery, setGrocery] = useState<GroceryItem[]>([]); 

  // Fetch all data from json-server on load
  useEffect(() => {
    fetch('http://localhost:3000/grocery')
      .then(res => res.json())
      .then(data => setGrocery(data))
      .catch(err => console.error('Error fetching data:', err));
  }, []);

  // Post Request Helper
  const postData = async (url: string, data: Partial<GroceryItem>) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  };

  // Delete Request Helper
  const deleteItem = async (id: string) => {
    const res = await fetch(`http://localhost:3000/grocery/${id}`, { method: 'DELETE' });
    return res.json();
  };

  // Adding a new item
  const addItem = async () => {
    if (!name.trim()) return;

    const itemObject = { name: name };
    try {
      const newItem: GroceryItem = await postData('http://localhost:3000/grocery', itemObject);
      setGrocery([...grocery, newItem]);
      setName(''); // Clear input box after adding
    } catch (error) {
      console.error("Failed to add item into the database.", error);
    }
  };

  // Deleting an item
  const HandleDelete = async (itemToRemove: GroceryItem) => {
    try {
      await deleteItem(itemToRemove.id);
      setGrocery(grocery.filter(item => item.id !== itemToRemove.id));
    } catch (error) {
      console.error("Failed to delete item from json-server:", error);
    }
  };

  // Placeholder for your Edit function
  const HandleEdit = (item: GroceryItem) => {
    console.log("Edit requested for:", item);
    //I will have to add the edit logic here
  };

  return (
    <div>
      <h1>Shopping List {name}</h1>
      
      {grocery.map((item) => (
      
        <div 
          key={item.id} 
          style={{ backgroundColor: "lightgray", marginBottom: "10px", display: "flex", gap: "10px", alignItems: "center" }}
        >
          <input type="radio" /> 
          <h6>{item.name}</h6>
          <button onClick={() => HandleDelete(item)}>Delete</button>
     
          <button onClick={() => HandleEdit(item)}>Edit</button>
        </div> 
      ))}

      <h3>Add new Item</h3>
      <input 
        type="text" 
        value={name}  
        placeholder='item' 
        onChange={(e) => setName(e.target.value)}
      />
      <button type="button" onClick={addItem}>Add new item</button>
    </div>
  );
};
