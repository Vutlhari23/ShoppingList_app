import { useEffect, useState } from 'react';
import { ContentContainer } from '../../components/ContentContainer/ContentContainer';
import styles from '../Home/Home.module.css';
import { Navbar } from '../../components/Navbar/Navbar';
import { AddItem } from '../../components/Modals/AddItem';
import DeleteModal from '../../components/Modals/DeleteModal';
import { apiFetch } from '../../lib/api';
import { getCurrentUser } from '../../lib/auth';

interface Item {
  id: string;
  name: string;
  createdBy: string | null;
}

export const Home = () => {
  const [shoppingList, setShoppingList] = useState<Item[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | ''>('');
  const [error, setError] = useState('');

  const currentUser = getCurrentUser();

  useEffect(() => {
    if (!currentUser) {
      setError('Could not verify your login. Please log in again.');
      return;
    }

    apiFetch<Item[]>(`/grocery?createdBy=${encodeURIComponent(currentUser.email)}`)
      .then((data) => {
        // Belt-and-braces client-side filter — json-server's query filter
        // can be case/whitespace sensitive, so don't rely on it alone.
        const mine = data.filter(
          (item) => item.createdBy?.toLowerCase().trim() === currentUser.email.toLowerCase().trim()
        );
        setShoppingList(mine);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setError('Could not load shopping list. Please log in again.');
      });
  }, []);

  const postData = async (data: Partial<Item>) => {
    return apiFetch<Item>('/grocery', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  };

  const deleteItem = async (id: string) => {
    return apiFetch(`/grocery/${id}`, { method: 'DELETE' });
  };

  const addItem = async (itemName: string) => {
    if (!itemName.trim() || !currentUser) return;

    try {
      const newItem = await postData({ name: itemName, createdBy: currentUser.email });
      setShoppingList((prev) => [...prev, newItem]);
    } catch (err) {
      console.error('Failed to add item into the database.', err);
      setError('Failed to add item.');
    }
  };

  const HandleDelete = async (itemToRemove: Item) => {
    try {
      await deleteItem(itemToRemove.id);
      setShoppingList((prev) => prev.filter((item) => item.id !== itemToRemove.id));
    } catch (err) {
      console.error('Failed to delete item from json-server:', err);
      setError('Failed to delete item.');
    } finally {
      setItemToDelete(null);
    }
  };

  const HandleCancelDelete = () => setItemToDelete(null);

  const sortedList = [...shoppingList].sort((a, b) => {
    if (sortOrder === 'asc') return a.name.localeCompare(b.name);
    if (sortOrder === 'desc') return b.name.localeCompare(a.name);
    return 0;
  });

  return (
    <ContentContainer className={styles['home-page']}>
      <ContentContainer className={styles['sidebar']}>
        <Navbar />
      </ContentContainer>

      <ContentContainer className={styles['home-content']}>
        <h1>My Shopping List</h1>
        {currentUser && <p>Logged in as {currentUser.name ?? currentUser.email}</p>}

        {error && <p style={{ color: 'crimson' }}>{error}</p>}

        <button type="button" onClick={() => setShowAddModal(true)}>
          Add new item
        </button>

        <div style={{ marginTop: '10px', marginBottom: '10px' }}>
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
            style={{
              backgroundColor: 'lightgray',
              marginBottom: '10px',
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
            }}
          >
            <input type="radio" />
            <h6>{item.name}</h6>
            <button onClick={() => setItemToDelete(item)}>Delete</button>
          </div>
        ))}

        {showAddModal && (
          <AddItem
            onClose={() => setShowAddModal(false)}
            onSubmit={async (newItem) => {
              await addItem(newItem.name);
              setShowAddModal(false);
            }}
          />
        )}

        {itemToDelete !== null && (
          <DeleteModal
            onClose={HandleCancelDelete}
            onConfirmDelete={() => HandleDelete(itemToDelete)}
          />
        )}
      </ContentContainer>
    </ContentContainer>
  );
};