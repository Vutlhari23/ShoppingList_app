import { useEffect, useState } from "react";

import { API_URL } from "../../api/api";
import type { ShoppingList } from "../../type";

import { Button } from "../../components/Button/Button";
import { Text } from "../../components/Text/Text";
import { ContentContainer } from "../../components/ContentContainer/ContentContainer";

export const ShoppingLists = () => {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [listname, setListName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const current_user_id = "1";


  const fetchShoppinfLists = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        `${API_URL}/shoppingLists?userId= ${current_user_id}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch shopping lists");
      }
      const data: ShoppingList[] = await response.json();

      setShoppingLists(data);
    } catch (error) {
      console.error("Error fecthing shopping lists:", error);
      setErrorMessage("Couldn't load your shopping list.");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect (()=> {
    fetchShoppinfLists();
  })

  return (
    <>
      {/*Render All the shooping  lists for a user */}

      {!isLoading && shoppingLists.length === 0 ? (
        <ContentContainer>
          {/*Empty state list */}
          <Text variant="p">
            No shopping list yet.Click "add new list" to create one.{" "}
          </Text>
        </ContentContainer>
      ) : (
        shoppingLists.map((list) => {
          <ContentContainer>
            <ContentContainer>
              <Text variant="h2">{list.name}</Text>
              <Text variant="span">
                Created {new Date(list.createdAt).toLocaleDateString()}
              </Text>
            </ContentContainer>

            <ContentContainer>
              <Button label="View" onClick={() => {}} />
              <Button label="Delete" onClick={() => {}} />
            </ContentContainer>
          </ContentContainer>;
        })
      )}
    </>
  );
};
