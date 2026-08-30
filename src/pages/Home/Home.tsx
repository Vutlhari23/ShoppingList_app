import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Item } from '../../type';
import { API_URL } from '../../api/api';
import { ContentContainer } from '../../components/ContentContainer/ContentContainer';


export const Home = () => {

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

const {listId} = useParams();
const [shoppingList,setShoppingList]= useState<Item[]>([]);
const [errorMessage,setErrorMessage]= useState("");

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

































  
  return (
<>
</>

  )
}

