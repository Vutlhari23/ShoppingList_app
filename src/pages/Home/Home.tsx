import { apiFetch } from '../../lib/api';
import type { Item } from '../../type';
import { useState, useEffect } from 'react';
import { ContentContainer } from '../../components/ContentContainer/ContentContainer';
import { useParams } from 'react-router-dom';

export const Home = () => {
  const { listId } = useParams();

  const [items, setItems] = useState<Item[]>([]);

  const fetchItems = async () => {
    try {
      console.log('listId:', listId);

      const data = await apiFetch<Item[]>(
        `/items?shoppingListId=${listId}`,
        {},
        false
      );

      console.log('Items from database:', data);

      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [listId]);

  return (
    <ContentContainer>
      <h1>Shopping List</h1>

      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </ContentContainer>
  );
};