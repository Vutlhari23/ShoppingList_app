import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { apiFetch } from "../../lib/api";
import type { Item } from "../../type";

import { ContentContainer } from "../../components/ContentContainer/ContentContainer";
import { Button } from "../../components/Button/Button";

export const Home = () => {
  const { listId } = useParams();

  const [items, setItems] = useState<Item[]>([]);

 
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState(1);


  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editQuantity, setEditQuantity] = useState(1);


  const [searchTerm, setSearchTerm] = useState("");


  type SortField = "name" | "category" | "createdAt";
  type SortOrder = "asc" | "desc";

  const [sortField, setSortField] = useState<SortField>("createdAt");

  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");



  const fetchItems = async () => {
    if (!listId) {
      console.error("No shopping list ID was provided.");
      return;
    }

    try {
      const data = await apiFetch<Item[]>(
        `/items?shoppingListId=${encodeURIComponent(listId)}`,
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


  const addItem = async () => {
    if (!name.trim()) {
      return;
    }

    if (!listId) {
      console.error("Cannot add item without a shopping list ID.");
      return;
    }

    try {
      const newItem = {
        name: name.trim(),
        category: category.trim(),
        quantity,
        shoppingListId: listId,
        createdAt: new Date().toISOString(),
      };

      const createdItem = await apiFetch<Item>(
        "/items",
        {
          method: "POST",
          body: JSON.stringify(newItem),
        },
        false,
      );

      setItems((previousItems) => [...previousItems, createdItem]);

      // Reset form
      setName("");
      setCategory("");
      setQuantity(1);

      // Close modal
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Failed to add item into the database:", error);
    }
  };


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
    if (!editingItem) {
      return;
    }

    if (!editName.trim()) {
      return;
    }

    await updateItem(editingItem.id, {
      name: editName.trim(),
      category: editCategory.trim(),
      quantity: editQuantity,
    });

    closeEditModal();
  };

 

  const handleSortChange = (field: SortField) => {
    if (field === sortField) {
      setSortOrder((previousOrder) =>
        previousOrder === "asc" ? "desc" : "asc",
      );
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };



  const sortedItems = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    const filteredItems = items.filter((item) => {
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
      }

      if (sortField === "createdAt") {
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

      <Button label="Add Item" onClick={() => setIsAddModalOpen(true)} />

 

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

    

      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add Item</h2>

            <label>
              Name
              <input
                type="text"
                placeholder="e.g. Milk"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            <label>
              Category
              <input
                type="text"
                placeholder="e.g. Dairy"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </label>

            <label>
              Quantity
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </label>

            <div className="modal-actions">
              <Button label="Add Item" onClick={addItem} />

              <Button label="Cancel" onClick={() => setIsAddModalOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {editingItem && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Item</h2>

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
                min="1"
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
};
