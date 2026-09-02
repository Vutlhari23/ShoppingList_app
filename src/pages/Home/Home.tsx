import { apiFetch } from "../../lib/api";
import type { Item } from "../../type";
import { useState, useEffect, useMemo } from "react";
import { ContentContainer } from "../../components/ContentContainer/ContentContainer";
import { useParams } from "react-router-dom";
import { Button } from "../../components/Button/Button";

export const Home = () => {
  const { listId } = useParams();



  const [items, setItems] = useState<Item[]>([]);


  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);

  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editCategory, setEditCategory] = useState<string>("");
  const [editQuantity, setEditQuantity] = useState<number>(0);

  const [searchTerm, setSearchTerm] = useState<string>("");


  type SortField = "name" | "category" | "createdAt";
  type Sortorder = "asc" | "desc";

  const [sortField, setSortField] = useState<SortField>("createdAt");

  const [sortOrder, setSortOrder] = useState<Sortorder>("asc");


  const fetchItems = async () => {
    try {
      const data = await apiFetch<Item[]>(
        `/items?shoppingListId=${listId}`,
        {},
        false,
      );

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

      setItems((prevItems) => [...prevItems, data]);

      setName("");
      setCategory("");
      setQuantity(0);
    } catch (error) {
      console.error("Failed to add items into the database:", error);
    }


  const deleteItem = async (itemId: string) => {
    try {
      await apiFetch<void>(
        `/items/${itemId}`,
        {
          method: "DELETE",
        },
        false,
      );

      setItems((previousItems) =>
        previousItems.filter((item) => item.id !== itemId),
      );
    } catch (error) {
      console.error("Failed to delete the item from the database:", error);
    }
  };



  const updateItem = async (itemId: string, updatedItem: Partial<Item>) => {
    try {
      const data = await apiFetch<Item>(
        `/items/${itemId}`,
        {
          method: "PATCH",
          body: JSON.stringify(updatedItem),
        },
        false,
      );

      setItems((previousItems) =>
        previousItems.map((item) => (item.id === itemId ? data : item)),
      );
    } catch (error) {
      console.error("Failed to update the item in the database:", error);
    }
  };


  const openEditModal = (item: Item) => {
    setEditingItem(item);

    setEditName(item.name);
    setEditCategory(item.category);
    setEditQuantity(item.quantity);
  };



  const closeEditModal = () => {
    setEditingItem(null);
  };


  const handleSaveEdit = async () => {
    if (!editingItem) return;

    await updateItem(editingItem.id, {
      name: editName,
      category: editCategory,
      quantity: editQuantity,
    });

    closeEditModal();
  };


  const handleSortChange = (field: SortField) => {
    if (field === sortField) {
    
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
     
      setSortField(field);
      setSortOrder("asc");
    }
  };



  const sortedItems = useMemo(() => {
    
    const filteredItems = items.filter((item) => {
      const search = searchTerm.toLowerCase().trim();

      return (
        item.name.toLowerCase().includes(search) ||
        item.category.toLowerCase().includes(search)
      );
    });

    const itemsCopy = [...filteredItems];

    itemsCopy.sort((a, b) => {
      let comparison = 0;

      if (sortField === "name" || sortField === "category") {
        comparison = a[sortField].localeCompare(b[sortField]);
      } else if (sortField === "createdAt") {
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return itemsCopy;
  }, [items, searchTerm, sortField, sortOrder]);



  return (
    <ContentContainer>
      <h1>Shopping List</h1>


      <div className="search-container">
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {searchTerm && <button onClick={() => setSearchTerm("")}>Clear</button>}
      </div>


      <Button label="Add Item" onClick={AddItem} />



      {items.length > 0 && (
        <div className="sort-controls">
          <span>Sort by:</span>

          <button onClick={() => handleSortChange("name")}>
            Name {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>

          <button onClick={() => handleSortChange("category")}>
            Category{" "}
            {sortField === "category" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>

          <button onClick={() => handleSortChange("createdAt")}>
            Date{" "}
            {sortField === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
        </div>
      )}


      <ul>
        {sortedItems.map((item) => (
          <li key={item.id}>
            <strong>{item.name}</strong>

            <span>Category: {item.category}</span>

            <span>Quantity: {item.quantity}</span>

            <button onClick={() => openEditModal(item)}>Edit</button>

            <button onClick={() => deleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>


      {items.length > 0 && sortedItems.length === 0 && searchTerm && (
        <p>No items found for "{searchTerm}"</p>
      )}

 

      {editingItem && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <label>
              Name
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </label>

            <label>
              Category
              <input
                type="text"
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
              />
            </label>

            <label>
              Quantity
              <input
                type="number"
                value={editQuantity}
                onChange={(e) => setEditQuantity(Number(e.target.value))}
              />
            </label>

            <div className="modal-actions">
              <Button label="Save" onClick={handleSaveEdit} />

              <Button label="Cancel" onClick={closeEditModal} />
            </div>
          </div>
        </div>
      )}
    </ContentContainer>
  );
}};
