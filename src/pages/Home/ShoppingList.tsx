import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../lib/api"
import type { ShoppingList } from "../../type";
import { getCurrentUser } from "../../lib/auth";
import { Button } from "../../components/Button/Button";
import { Text } from "../../components/Text/Text";
import { ContentContainer } from "../../components/ContentContainer/ContentContainer";
import styles from "./ShoppingLists.module.css";

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

export const ShoppingLists = () => {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [listName, setListName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const fetchShoppingLists = async () => {
    if (!currentUser) {
      setErrorMessage("Could not verify your login. Please log in again.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        `${API_URL}/shoppingLists?userId=${encodeURIComponent(currentUser.id)}`,
        { headers: authHeaders() }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch shopping lists");
      }

      const data: ShoppingList[] = await response.json();
      setShoppingLists(data.filter((l) => String(l.userId) === currentUser.id));
    } catch (error) {
      console.error("Error fetching shopping lists:", error);
      setErrorMessage(
        "Couldn't load your shopping lists. Check that the server is running and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShoppingLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addShoppingList = async () => {
    if (!listName.trim() || !currentUser) return;

    const newList = {
      userId: currentUser.id,
      name: listName.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(`${API_URL}/shoppingLists`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(newList),
      });

      if (!response.ok) throw new Error("Failed to create shopping list");

      const createdList: ShoppingList = await response.json();
      setShoppingLists((prev) => [...prev, createdList]);
      setListName("");
    } catch (error) {
      console.error("Error creating shopping list:", error);
      setErrorMessage("Couldn't create the list. Please try again.");
    }
  };

  const deleteShoppingList = async (listId: string) => {
    try {
      const itemsResponse = await fetch(`${API_URL}/items?listId=${listId}`, {
        headers: authHeaders(),
      });

      if (!itemsResponse.ok) throw new Error("Failed to fetch items for list");

      const items: { id: string }[] = await itemsResponse.json();

      for (const item of items) {
        const deleteItemResponse = await fetch(`${API_URL}/items/${item.id}`, {
          method: "DELETE",
          headers: authHeaders(),
        });
        if (!deleteItemResponse.ok) throw new Error(`Failed to delete item ${item.id}`);
      }

      const response = await fetch(`${API_URL}/shoppingLists/${listId}`, {
        method: "DELETE",
        headers: authHeaders(),
      });

      if (!response.ok) throw new Error("Failed to delete shopping list");

      setShoppingLists((prev) => prev.filter((list) => list.id !== listId));
    } catch (error) {
      console.error("Error deleting shopping list:", error);
      setErrorMessage(
        "Couldn't delete that list. Some items may not have been removed — please try again."
      );
    }
  };

  const viewShoppingList = (listId: string) => {
    navigate(`/shopping-list/${listId}`);
  };

  return (
    <>
      <ContentContainer className={styles.header}>
        <ContentContainer>
          <Text variant="caption" className={styles.eyebrow}>
            {shoppingLists.length} list{shoppingLists.length === 1 ? "" : "s"}
          </Text>
          <Text variant="h1">My Shopping Lists</Text>
         
    </ContentContainer>
      </ContentContainer>

      {errorMessage && (
        <div className={styles.errorBanner} role="alert">
          {errorMessage}
        </div>
      )}

      <div className={styles.createRow}>
        <input
          type="text"
          placeholder="e.g. Weekly Groceries"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addShoppingList()}
        />
        <Button label="Create list"  onClick={addShoppingList} />
      </div>

      {!isLoading && shoppingLists.length === 0 ? (
        <div className={styles.empty}>
          <Text variant="p">No shopping lists yet — create your first one above.</Text>
        </div>
      ) : (
        shoppingLists.map((list) => (
          <ContentContainer key={list.id} className={styles.listCard}>
            <div className={styles.listInfo}>
              <h2>{list.name}</h2>
              <span className={styles.listMeta}>
                Created {new Date(list.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className={styles.listActions}>
              <Button label="View" onClick={() => viewShoppingList(list.id)} />
              <Button label="Delete"  onClick={() => deleteShoppingList(list.id)} />
            </div>
          </ContentContainer>
        ))
      )}
    </>
  );
};