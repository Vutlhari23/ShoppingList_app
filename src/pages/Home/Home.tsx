import { useState,useEffect } from "react";
import type {Item} from '../../type'
import { ContentContainer } from "../../components/ContentContainer/ContentContainer";
import { TextInput } from "../../components/TextInput/TextInput";
import { Button } from "../../components/Button/Button";


export const Home = () => {

   
const [shoppingList, setShoppingList] = useState<Item[]>([]);

//Fech all items from the Json server
useEffect(() => {
  fetch(`http://localhost:3000/items`)
    .then((res) => res.json())
    .then((data) => setShoppingList(data))
    .catch((err) => console.error("Error fetching data:", err));
}, []);


return(

<>
{/*Display all the items stored in the Database*/}
  {shoppingList.map((item) => (
  <ContentContainer key={item.id} style={{backgroundColor:"lightgray", marginBottom:"10px", display:"flex", flexDirection:"row"}}>
    <ContentContainer>
      <TextInput
      type="radio"/>
    </ContentContainer>
    <ContentContainer>
    <h3>{item.name}</h3>
    <span>Quantity : {item.quantity}</span><br/>
    <span>Category : {item.category}</span><br/>

    {item.notes && <span>Notes : {item.notes}</span>}
    </ContentContainer>
  </ContentContainer>
))}
</>

)
  
}



