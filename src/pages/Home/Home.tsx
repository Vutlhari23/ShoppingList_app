import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../../lib/api";
import type { Item } from "../../type";
import { ContentContainer } from "../../components/ContentContainer/ContentContainer";
import { Button } from "../../components/Button/Button";
import Navbar from "../../components/Navbar/Navbar";
import styles from "../Home/Home.module.css";
import { AddItem } from "../../components/Modals/AddItem";
import { EditModal } from "../../components/Modals/EditModal";
import DeleteModal from "../../components/Modals/DeleteModal";
import  noList from '../../assets/no_list.png'

type NewItem= {
  name: string;
  category: string;
  quantity: number;

};

type SortField = "name" | "category" | "createdAt";
type SortOrder = "asc" | "desc";

export const Home = () => {
  const { listId } = useParams();

  const [items, setItems] = useState<Item[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [openConfirmModal,setOpenConfirmModal]= useState(false);
  const [listToDelete,setListToDelete] =useState("");
    


  const fetchItems = async () => {
    if (!listId) {
      setMessage("Shopping list could not be found.");
      return;
    }
    

    try {
      const data = await apiFetch<Item[]>(
        `/items?shoppingListId=${listId}`,
        {},
        false
      );
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
      showMessage("Failed to load shopping list items.");
    }
  };

  useEffect(() => {
    fetchItems();
  }, [listId]);


const addNewItem = async (newItem:NewItem) => {
  if (!listId) {
    showMessage("Shopping list could not be found.");
    return;
  }
   const itemToSave = {
      ...newItem,
      shoppingListId: listId,
      createdAt: new Date().toISOString(),
      createdBy: "1",
    };

  try {
   console.log("RESPONSE");
    const savedItem = await apiFetch<Item>(
      "/items",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemToSave),
      },
      false
    );
    console.log("SETTING ITEMS");

    setItems((previousItems) => [
      ...previousItems,
      savedItem,
    ]);

    showMessage("Item added successfully.");
    setIsAddModalOpen(false);
  } catch (error) {
    console.error("Failed to add item:", error);
    showMessage("Failed to add item.");
    console.log("Item added");
  }
};

const deleteItem = async (itemId: string) => {
    try {
      await apiFetch<void>(
        `/items/${itemId}`,
        {
          method: "DELETE",
        },
        false
      );

      setItems((previousItems) =>
        previousItems.filter((item) => item.id !== itemId)
      );

      showMessage("Item deleted successfully.");
    } catch (error) {
      console.error("Failed to delete item:", error);
      showMessage("Failed to delete item.");
    }
  };

  const updateItem = async (
    itemId: string,
    updatedItem: Partial<Item>
  ) => {
    try {
      const updatedData = await apiFetch<Item>(
        `/items/${itemId}`,
        {
          method: "PATCH",
          headers: {
      "Content-Type": "application/json",
    },
          body: JSON.stringify(updatedItem),
        },
        false
      );

      setItems((previousItems) =>
        previousItems.map((item) =>
          item.id === itemId ? updatedData : item
        )
      );

      showMessage("Item updated successfully.");
      setMessage("");
    } catch (error) {
      console.error("Failed to update item:", error);
      showMessage("Failed to update item.");

    }
  };

  const openEditModal = (item: Item) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingItem(null);
  };

  const handleSaveEdit = async (
    name: string,
    category: string,
    quantity: number
  ) => {
    if (!editingItem) {
      return;
    }

    const trimmedName = name.trim();
    const trimmedCategory = category.trim();

    if (!trimmedName) {
      setMessage("Please enter an item name.");
      return;
    }

    if (!trimmedCategory) {
      showMessage("Please enter a category.");
      return;
    }

    if (!Number.isFinite(quantity) || quantity < 1) {
      showMessage("Quantity must be at least 1.");
      return;
    }

    updateItem(editingItem.id, {
      name: trimmedName,
      category: trimmedCategory,
      quantity,
    }).catch((error) => {
      console.error("Failed handling save edit execution:", error);
    });

    closeEditModal();
  };

  const sortedItems = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    const filteredItems = items.filter((item) => {
      const itemName = item.name.toLowerCase();
      const itemCategory = item.category.toLowerCase();

      return (
        itemName.includes(search) ||
        itemCategory.includes(search)
      );
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
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime();
      }

      return sortOrder === "asc"
        ? comparison
        : -comparison;
    });

    return itemsCopy;
  }, [items, searchTerm, sortField, sortOrder]);
  
  const handleCheck =(id :string) => {
    setItems(
      items.map((item)=>
      item.id === id ? {...item, checked: !item.checked} : item)
    )

  }
  const showMessage=(text: string)=>{
    setMessage(text);
    setTimeout(()=>{setMessage("")}, 3000);
  };


  return (

    
    <ContentContainer className={styles["home-page"]}>

     
      <ContentContainer className={styles.navbar}>
        <Navbar />
      </ContentContainer>

      <ContentContainer className={styles["list-home"]}>
        <div className={styles.header}>
          <div>
            
            <h1>Shopping List</h1>
            <p>Manage the items you need to buy.</p>
          </div>
          <div>
          <Button
          className={styles.btn}
            label="Add Item"
            onClick={() => {
              setMessage("");
              setIsAddModalOpen(true);
            }}
          />
        </div>
        </div>

      {message && (
          <div className={styles.message}>
            <span>{message}</span>
          </div>
        )}

        <ContentContainer className={styles["list-controls"]}>
          <ContentContainer className={styles["search-container"]}>
            <input
              className={styles.inputField}
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {searchTerm && (
              <button
                className={styles.clearButton}
                type="button"
                onClick={() => setSearchTerm("")}
              >
                Clear
              </button>
            )}
          </ContentContainer>

          <ContentContainer className={styles["sort-container"]}>
            <label
            className={styles['sort-lbl']}
            
            htmlFor="sortBy">Sort by:</label>
            <select
              id="sortBy"
              value={`${sortField}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split("-") as [
                  SortField,
                  SortOrder
                ];
                setSortField(field);
                setSortOrder(order);
              }}
            >
              <option value="createdAt-desc">Date created</option>
              <option value="name-asc">Name </option>
              <option value="category-asc">Category</option>
             
            </select>
          </ContentContainer>
        </ContentContainer>

        {sortedItems.length > 0 ? (

          <ul className={styles.itemList}>
            {sortedItems.map((item) => (
              <li className={styles.itemCard} key={item.id}>
               
                <div className={styles.itemInfo}   style={{ textDecoration: item.checked? "line-through" : "none"}}>
                  <input type="checkbox"
                  className={styles.checkbox}
                  checked={item.checked}
                  onChange={() =>handleCheck(item.id)}
                  
                  ></input>
                  <strong>{item.name}</strong><br/>
                  <span> Category: ({item.category})</span><br/>
                  <span>   Quantity: {item.quantity}</span>
                </div>
              
                <div className={styles.itemActions}>
                  <Button label="Edit" onClick={() => openEditModal(item)} />
                  <Button 
                  className={styles.delete}
                  label="Delete" onClick={() => {setOpenConfirmModal(true)
                    setListToDelete(item.id)} }/>
                </div> 
              </li>
            ))}
          </ul>
        ) : (
          <ContentContainer className={styles.emptystate}>

          <img src={noList} />
          <p className={styles.noItems}>No items yet.Please click "add item" to add items in your list.</p>
           <Button
          className={styles.btn}
            label="Add Item"
            onClick={() => {
              setMessage("");
              setIsAddModalOpen(true);
            }}
          />
          </ContentContainer>
        )}
      </ContentContainer>

      {isAddModalOpen && (
        <AddItem
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={addNewItem}
          
        />
      )}

      {isEditModalOpen && editingItem && (
        <EditModal
           item={editingItem}
  onClose={closeEditModal}
    onSaveEdits={handleSaveEdit}
        />
      )}
      {openConfirmModal && (
            <DeleteModal
              onClose={() => setOpenConfirmModal(false)}
              onConfirmDelete={async () => {
                await deleteItem(listToDelete);
                setOpenConfirmModal(false);
                setListToDelete("");
              }}
            />
          )}
    </ContentContainer>
  );
};
