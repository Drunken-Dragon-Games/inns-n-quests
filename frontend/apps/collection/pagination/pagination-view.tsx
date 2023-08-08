import styled from "styled-components"
import { useState } from "react"
import { CollectionFilter, CollectionWithUIMetada } from "../collection-state-models"
import { collectionTransitions } from "../collection-transitions"

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center; // Center the buttons
  gap: 10px; // Adjust the gap between the buttons
  margin: 15px;
`;

export const PaginationView = ({ filter, collectionCache }: { filter: CollectionFilter, collectionCache: Record<number, CollectionWithUIMetada> }) => {
    
    const onNext = () => {
        collectionTransitions.setFilter({...filter, page: filter.page + 1})
        collectionTransitions.setDisplayCollection(collectionCache, {...filter, page: filter.page + 1})
      }

    const onPrevious = () => {
        if(filter.page < 2) return
        collectionTransitions.setFilter({...filter, page: filter.page - 1})
        collectionTransitions.setDisplayCollection(collectionCache, {...filter, page: filter.page - 1})
      }
    return (
    <PaginationContainer>
      <button onClick={onPrevious}>Previous Page</button>
      <button onClick={onNext}>Next Page</button>
    </PaginationContainer>
    )
}