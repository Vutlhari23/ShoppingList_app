import { useEffect, useState } from 'react';
import { ContentContainer } from '../../components/ContentContainer/ContentContainer';
import styles from '../Home/Home.module.css'
import {Navbar} from '../../components/Navbar/Navbar'


interface Item {
  id: string;
  name: string;
}

export const Home = () => {
  const [name, setName] = useState<string>('');
  const [shoppingList, setShoppingList] = useState<Item[]>([]);
  const [valueToFilter, setValueToFilter] = useState("");

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>('');

  // Add modal state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Delete confirmation state
  const [itemToDelete, setItemToDelete] = useState<Item| null>(null);

  // Sort state
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | ''>('');

  // Fetch all data from json-server on load to diplay on the UI
  //This allows us to diplay the data saved in the Json-server instead of rendering nothing on load.
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
  const updateItem = async (id: string, data: Partial<Item>) => {
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

  // Adding a new item
  const addItem = async () => {
    if (!name.trim()) return;

    const itemObjectToadd = { name: name };

    try {
      const newItem: Item = await postData('http://localhost:3000/grocery', itemObjectToadd);
      setShoppingList([...shoppingList, newItem]);
      setName('');
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
  const HandleEdit = (item: Item) => {
    setEditingId(item.id);
    setEditName(item.name);
  };

  // Save edit
  const HandleSaveEdit = async (id: string) => {
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
          <option value="">Unsorted List </option>
          <option value="asc">ascending order</option>
          <option value="desc">descending order</option>
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
          <button onClick={() => HandleEdit(item)}>Edit</button>
        </div>
      ))}
 
      {/* Add Item Modal */}
      {showAddModal && (
        <div
          style={{
            position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex",
            justifyContent: "center", alignItems: "center", zIndex: 1000,
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px", minWidth: "300px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Add new Item</h3>
            <input
              type="text"
              value={name}
              placeholder="item"
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={async () => {
                  await addItem();
                  setShowAddModal(false);
                }}
              >
                Add
              </button>
              <button type="button" onClick={() => setShowAddModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {editingId !== null && (
        <div
          style={{
            position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex",
            justifyContent: "center", alignItems: "center", zIndex: 1000,
          }}
          onClick={HandleCancelEdit}
        >
          <div
            style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px", minWidth: "300px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Edit Item</h3>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              autoFocus
            />
            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
              <button onClick={() => HandleSaveEdit(editingId)}>Save</button>
              <button onClick={HandleCancelEdit}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete !== null && (
        <div
          style={{
            position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex",
            justifyContent: "center", alignItems: "center", zIndex: 1000,
          }}
          onClick={HandleCancelDelete}
        >
          <div
            style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px", minWidth: "300px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Delete Item</h3>
            <p>Are you sure you want to delete "{itemToDelete.name}"?</p>
            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
              <button onClick={() => HandleDelete(itemToDelete)}>Yes, Delete</button>
              <button onClick={HandleCancelDelete}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      </ContentContainer>
    </ContentContainer>
  );
};
