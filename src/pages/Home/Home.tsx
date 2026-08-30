import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Item } from '../../type';
import { API_URL } from '../../api/api';
import { ContentContainer } from '../../components/ContentContainer/ContentContainer';
import type { NewItem } from '../../components/Modals/AddItem';



export const Home = () => {

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

const {listId} = useParams();
const [shoppingList,setShoppingList]= useState<Item[]>([]);
const [errorMessage,setErrorMessage]= useState("");
const [showAddModal,setShowAddModal] =useState(false);
//{Req1}Fetch items of the current list

const fetchItems = async () => {
  if(!listId){
    return;
  }
  setErrorMessage("");

  try{
    const response = await fetch(`${API_URL}/items?listId=${listId}`,
      {headers : authHeaders()});
      if(!response.ok){
        throw new Error ("Failes to fetch items");

      }
      let data : Item[];
      data = await response.json();
      setShoppingList(data); // the array of list now saved in a state variable

  }catch(error){
    console.error("Error fetching list of items:",error);
    setErrorMessage("Couldn't load items for this list. Check if the server is running and try again.");

  }
};

useEffect (()=> {fetchItems()},[listId]);

//{Req2}

const addItem = async (itemToAdd : NewItem) => {
  if(!itemToAdd.name.trim()){
    return;
  }
   if (!listId){
    console.error("No shopping list selected.");
    return;
   }

   const itemObjectToAdd= {
    ...itemToAdd,
    listId,
    createdAt : new Date().toISOString(),

   }

   try {

    const response = await fetch(`${API_URL}/items`,
      {method : "POST",
      headers: {"Content-Type": "application/json", ...authHeaders},
      body : JSON.stringify(itemObjectToAdd),
});
  if (!response.ok) {
        throw new Error("Failed to add item");
      }

      let newItem : Item;
      newItem =await response.json();

      setShoppingList((previousList)=> [...previousList, newItem]);
      setShowAddModal(false);


   }catch(error){
    console.error("Failed to add item:" , error);
    setErrorMessage("Couldn't add the item. Please try again.");

   }
};































  
  return (
<>
</>

  )
}

