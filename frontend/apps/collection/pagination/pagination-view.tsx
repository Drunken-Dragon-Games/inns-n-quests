import styled from "styled-components"
import { useState } from "react"
import { CollectionFilter, CollectionWithUIMetada } from "../collection-state-models"
import { collectionTransitions } from "../collection-transitions"
import {ArrowBackward, ArrowForward} from "./components"

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center; // Center the buttons horizontally
  align-items: center; // Center the buttons vertically
  gap: 30px; // Increase the gap between the buttons
  margin: 15px;
`
const ArrowWrapper = styled.div`
  position: relative;
  width: 50px; // Adjust as needed
  height: 50px; // Adjust as needed
`

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
          <ArrowWrapper>
            <ArrowBackward onClick={onPrevious}  clickAble={filter.page > 1}></ArrowBackward>
          </ArrowWrapper>
          <ArrowWrapper>
            <ArrowForward clickAble = {collectionCache[filter.page] ? collectionCache[filter.page].hasMore : false} onClick={onNext}></ArrowForward>
          </ArrowWrapper>
        </PaginationContainer>
        )
}