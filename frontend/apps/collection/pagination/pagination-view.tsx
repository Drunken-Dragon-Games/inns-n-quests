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

export const PaginationView = ({ filter, collectionCache }: { filter: CollectionFilter, collectionCache: Record<number, CollectionWithUIMetada & {hasMore: boolean}> }) => {
    
    const onNext = () => {
        if (!collectionCache[filter.page].hasMore) return
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
      <button onClick={onPrevious}  disabled={filter.page < 2}>Previous Page</button>
      <button onClick={onNext} disabled={collectionCache[filter.page] ? !collectionCache[filter.page].hasMore : true}>Next Page</button>
    </PaginationContainer>
    )
}