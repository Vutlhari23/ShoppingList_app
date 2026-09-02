import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../lib/api"
import type { ShoppingList } from "../../type";
import { getCurrentUser } from "../../lib/auth";
import { Button } from "../../components/Button/Button";
import { Text } from "../../components/Text/Text";
import { ContentContainer } from "../../components/ContentContainer/ContentContainer";
import styles from "./ShoppingLists.module.css";
import {Navbar} from '../../components/Navbar/Navbar'
import NoList  from '../../assets/no_list.png'

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

type SortField = "name" | "createdAt";
type SortOrder = "asc" | "desc";

export const ShoppingLists = () => {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [listName, setListName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

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
      const itemsResponse = await fetch(
        `${API_URL}/items?shoppingListId=${listId}`,
        { headers: authHeaders() }
      );

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
    navigate(`/home/${listId}`);
  };

 
  const handleSortChange = (field: SortField) => {
    if (field === sortField) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedShoppingLists = useMemo(() => {
    const listsCopy = [...shoppingLists];

    listsCopy.sort((a, b) => {
      let comparison = 0;

      if (sortField === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === "createdAt") {
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return listsCopy;
  }, [shoppingLists, sortField, sortOrder]);

  return (
    <>
    <ContentContainer className={styles['home-page']} >
     <ContentContainer className={styles['sidebar']}>
        <Navbar />
      </ContentContainer>
      <ContentContainer className={styles.content}>
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

      {shoppingLists.length > 0 && (
        <div className={styles.sortControls}>
          <span>Sort by:</span>
          <button onClick={() => handleSortChange("name")}>
            Name {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
          <button onClick={() => handleSortChange("createdAt")}>
            Date Created{" "}
            {sortField === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
        </div>
      )}

      {!isLoading && shoppingLists.length === 0 ? (
        <ContentContainer className={styles.emptystate}>
          <img src={NoList} alt="No list" />
          <Text variant="p">No shopping lists yet. Create your first shopping list above to get started!</Text>
        </ContentContainer>
      ) : (
        sortedShoppingLists.map((list) => (
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
      </ContentContainer>
      </ContentContainer>
    </>
  );
};