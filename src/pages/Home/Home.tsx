import { useEffect, useState } from 'react';
import { ContentContainer } from '../../components/ContentContainer/ContentContainer';
import styles from '../Home/Home.module.css'
import {Navbar} from '../../components/Navbar/Navbar'
import {AddItem} from '../../components/Modals/AddItem'
import DeleteModal from '../../components/Modals/DeleteModal';


interface Item {
  id: string;
  name: string;
}

export const Home = () => {
 
  const [shoppingList, setShoppingList] = useState<Item[]>([]);

  

  // Edit state
  {/*const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>('');
*/}
  // Add modal state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Delete confirmation state
  const [itemToDelete, setItemToDelete] = useState<Item| null>(null);

  // Sort state
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | ''>('');

  // Fetch all data from json-server on load to diplay on the UI
  useEffect(() => { fetch('http://localhost:3000/grocery')
      .then(res => res.json())
      .then(data => setShoppingList(data))
      .catch(err => console.error('Error fetching data:', err)); }, []);

  // Post Request
  const postData = async (url: string, data: Partial<Item>) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
      },
      body: JSON.stringify(data)
    });
    return res.json();
  };

  // Delete Request
  const deleteItem = async (id: string) => {
    const res = await fetch(`http://localhost:3000/grocery/${id}`, { method: 'DELETE' });
    return res.json();
  };

  // Update Request
  {/*const updateItem = async (id: string, data: Partial<Item>) => {
    try {
      const respond = await fetch(`http://localhost:3000/grocery/${id}`, {
        method: "PATCH",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!respond.ok) {
        throw new Error("Failed to update the Item");
      }
      const updatedItem: Item = await respond.json();
      return updatedItem;
    } catch (error) {
      console.error("Error updating the shopping item", error);
    }
  };
  */}

  // Adding a new item (used by the Add Item modal now)
  const addItem = async (itemName: string) => {
    if (!itemName.trim()) return;

    const itemObjectToadd = { name: itemName };

    try {
      const newItem: Item = await postData('http://localhost:3000/grocery', itemObjectToadd);
      setShoppingList((prev) => [...prev, newItem]);
    } catch (error) {
      console.error("Failed to add item into the database.", error);
    }
  };

  // Deleting an item (runs only after confirmation)
  const HandleDelete = async (itemToRemove: Item) => {
    try {
      await deleteItem(itemToRemove.id);
      setShoppingList(shoppingList.filter(item => item.id !== itemToRemove.id));
    } catch (error) {
      console.error("Failed to delete item from json-server:", error);
    } finally {
      setItemToDelete(null);
    }
  };

  const HandleCancelDelete = () => {
    setItemToDelete(null);
  };

  // Enter edit mode
  {/*}
  const HandleEdit = (item: Item) => {
    setEditingId(item.id);
    setEditName(item.name);
  };
*/}
  // Save edit
  {/*const HandleSaveEdit = async (id: string) => {
    if (!editName.trim()) return;

    try {
      const updated = await updateItem(id, { name: editName });
      if (updated) {
        setShoppingList(shoppingList.map(item => (item.id === id ? updated : item)));
      }
      setEditingId(null);
      setEditName('');
    } catch (error) {
      console.error("Failed to save edit:", error);
    }
  };

  const HandleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };
*/}
  
  const sortedList = [...shoppingList].sort((a, b) => {
    if (sortOrder === 'asc') return a.name.localeCompare(b.name);
    if (sortOrder === 'desc') return b.name.localeCompare(a.name);
    return 0;
  });

  return (
  <ContentContainer className ={styles['home-page']}>
    <ContentContainer className={styles['sidebar']} >
     <Navbar/>
    </ContentContainer>

    <ContentContainer className={styles['home-content']}>
      <h1>My Shopping List</h1>

      <button type="button" onClick={() => setShowAddModal(true)}>Add new item</button>

      <div style={{ marginTop: "10px", marginBottom: "10px" }}>
        <label htmlFor="sortSelect">Sort by name: </label>
        <select
          id="sortSelect"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc' | '')}
        >
          <option value="">Default order</option>
          <option value="asc">ascending</option>
          <option value="desc">descending</option>
        </select>
      </div>

      {sortedList.map((item) => (
        <div
          key={item.id}
          style={{ backgroundColor: "lightgray", marginBottom: "10px", display: "flex", gap: "10px", alignItems: "center" }}
        >
          <input type="radio" />
          <h6>{item.name}</h6>
          <button onClick={() => setItemToDelete(item)}>Delete</button>
          {/*<button onClick={() => HandleEdit(item)}>Edit</button>*/}
        </div>
      ))}
 
      {/* Add Item Modal */}
      {showAddModal && (
        <AddItem
          onClose={() => setShowAddModal(false)}
          onSubmit={async (newItem) => {
            console.log("AddItem rendering")
            await addItem(newItem.name);
            setShowAddModal(false);
          }}
        />
      )}

      {/* Edit Item Modal */}
ap   

      {/* Delete Confirmation Modal */}
      {itemToDelete !== null && (
        <DeleteModal 
        onClose={()=>HandleCancelDelete()}
        onConfirmDelete={()=>{HandleDelete(itemToDelete)}}
        />   
      
      )}
      </ContentContainer>
    </ContentContainer>
  );
};