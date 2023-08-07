import styled from "styled-components"
import { useState } from "react"
import { CollectionFilter } from "../collection-state-models"
import { collectionTransitions } from "../collection-transitions"

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center; // Center the buttons
  gap: 10px; // Adjust the gap between the buttons
  margin: 15px;
`;
//Posible improvment to be implmented after prototype is to have the onNext grow the cached collection intead of setting it
//then the onPrevious woudl just need to scroll though the collection array, not having to ask it again
  export const PaginationView = ({ filter }: { filter: CollectionFilter }) => {
    
    const onNext = () => {
        collectionTransitions.setFilter({...filter, page: filter.page + 1})
        collectionTransitions.getCollection({...filter, page: filter.page + 1})
      }

    const onPrevious = () => {
        if(filter.page < 2) return
        collectionTransitions.setFilter({...filter, page: filter.page - 1})
        collectionTransitions.getCollection({...filter, page: filter.page - 1})
      }
    return (
    <PaginationContainer>
      <button onClick={onPrevious}>Previous Page</button>
      <button onClick={onNext}>Next Page</button>
    </PaginationContainer>
    )
}