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
      alert("Please enter an item name.");
      return;
    }

    if (quantity < 1) {
      alert("Quantity must be at least 1.");
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
      const updatedData = await apiFetch<Item>(
        `/items/${itemId}`,
        {
          method: "PATCH",
          body: JSON.stringify(updatedItem),
        },
        false,
      );

      setItems((previousItems) =>
        previousItems.map((item) => (item.id === itemId ? updatedData : item)),
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
    setEditName("");
    setEditCategory("");
    setEditQuantity(1);
  };

  const handleSaveEdit = async () => {
    if (!editingItem) {
      return;
    }

    if (!editName.trim()) {
      alert("Please enter an item name.");
      return;
    }

    if (editQuantity < 1) {
      alert("Quantity must be at least 1.");
      return;
    }

    await updateItem(editingItem.id, {
      name: editName.trim(),
      category: editCategory.trim(),
      quantity: editQuantity,
    });

    closeEditModal();
  };

  const sortedItems = useMemo(() => {
    // Convert search term to lowercase
    const search = searchTerm.toLowerCase().trim();

    const filteredItems = items.filter((item) => {
      const itemName = item.name.toLowerCase();

      const itemCategory = item.category.toLowerCase();

      return itemName.includes(search) || itemCategory.includes(search);
    });

    const itemsCopy = [...filteredItems];

    itemsCopy.sort((a, b) => {
      let comparison = 0;

      if (sortField === "name") {
        comparison = a.name.localeCompare(b.name);
      }

      if (sortField === "category") {
        comparison = a.category.localeCompare(b.category);
      }

      if (sortField === "createdAt") {
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }

      if (sortOrder === "asc") {
        return comparison;
      }

      return -comparison;
    });

    return itemsCopy;
  }, [items, searchTerm, sortField, sortOrder]);

  return (
    <ContentContainer>
      <h1>Shopping List</h1>

      <div className="list-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {searchTerm && (
            <button type="button" onClick={() => setSearchTerm("")}>
              Clear
            </button>
          )}
        </div>

        <div className="sort-controls">
          <label htmlFor="sortBy">Sort by:</label>

          <select
            id="sortBy"
            value={`${sortField}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split("-") as [
                SortField,
                SortOrder,
              ];

              setSortField(field);
              setSortOrder(order);
            }}
          >
            <option value="name-asc">Name (A-Z)</option>

            <option value="name-desc">Name (Z-A)</option>

            <option value="category-asc">Category (A-Z)</option>

            <option value="category-desc">Category (Z-A)</option>

            <option value="createdAt-asc">Date (Oldest First)</option>

            <option value="createdAt-desc">Date (Newest First)</option>
          </select>
        </div>
      </div>

      <Button label="Add Item" onClick={() => setIsAddModalOpen(true)} />

      {sortedItems.length > 0 ? (
        <ul>
          {sortedItems.map((item) => (
            <li key={item.id}>
              <strong>{item.name}</strong>

              <span>Category: {item.category}</span>

              <span>Quantity: {item.quantity}</span>

              <button type="button" onClick={() => openEditModal(item)}>
                Edit
              </button>

              <button type="button" onClick={() => deleteItem(item.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>
          {searchTerm
            ? `No items found for "${searchTerm}"`
            : "No items in this shopping list yet."}
        </p>
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
