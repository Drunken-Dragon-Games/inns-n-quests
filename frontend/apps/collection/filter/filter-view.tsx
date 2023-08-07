import React, { useState } from 'react';
import { collectionTransitions } from "../collection-transitions"
import { APSFilter, AssetClass, CollectionFilter, CollectionPolicyNames, collectionPolicies, filterClasses } from '../collection-state-models'
import styled from 'styled-components';
import { vh } from '../../common';
import { PixelCheckbox } from './components';

const FilterContainer = styled.div`
  width: 9.5vw;
  position: absolute;
  left: 0;
  top: 0;
  color: #333;
  background-color: #999;
  z-index: 2;
`

const LabelWrapper = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 10px;
`
const RangeWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`

const RangeLabel = styled.span`
  margin-right: 5px;
`

const RangeInput = styled.input`
  width: 50px; // You can adjust this as needed
  margin-right: 5px;
`

export const FilterView = ({ filter }: { filter: CollectionFilter }) => {
    type  filterChange 
      = {ctype: "class", filterClass: AssetClass}
      | {ctype: "policy", policy: CollectionPolicyNames}
    const setClassFilter = (classFilter: AssetClass[]) => {
      collectionTransitions.setFilter({...filter, classFilter})
    }
    const setPolicyFilter = (policyFilter: CollectionPolicyNames[]) => {
      collectionTransitions.setFilter({...filter, policyFilter})
    }

    const setAPSFilter = (APSFilter: APSFilter) => {
      collectionTransitions.setFilter({...filter, APSFilter})
    }
  
    const hanldeFilterChange = (change: filterChange, checked: boolean) => {
      switch ( change.ctype ) {
        case "class":
            if (checked) setClassFilter([...filter.classFilter, change.filterClass])
            else setClassFilter(filter.classFilter.filter(selectedWord => selectedWord !== change.filterClass))
            break
        case "policy":
          if (checked) setPolicyFilter([...filter.policyFilter, change.policy])
          else setPolicyFilter(filter.policyFilter.filter(selectedWord => selectedWord !== change.policy))
          break
        default: 
            break
     }
    }

    const handleRangeChange = (attribute: keyof APSFilter, rangeKey: 'from' | 'to', value: number) => {
      setAPSFilter({
        ...filter.APSFilter,
        [attribute]: { ...filter.APSFilter[attribute], [rangeKey]: value }
      })
    }
  
    const handleApply = () => {
        collectionTransitions.setFilter({...filter, page: 1})
        collectionTransitions.getCollection({...filter, page: 1})
    }

    const handleClear = () => {
      const defaultFilter: CollectionFilter = {page: 1, policyFilter: [], classFilter: [], APSFilter:{ath: {}, int: {}, cha: {}}}
      collectionTransitions.setFilter(defaultFilter)
      collectionTransitions.getCollection(defaultFilter)
    }
    
  
    return (
      <FilterContainer>
        <h3>Classes</h3>
        <hr />
        {filterClasses.map((filterClass, index) => (
          <LabelWrapper key={index} onClick={() => hanldeFilterChange({ctype: "class", filterClass}, !filter.classFilter.includes(filterClass))}>
            <PixelCheckbox checked={filter.classFilter.includes(filterClass)} size={vh(2)} /> {filterClass}
          </LabelWrapper>
        ))}
        <h3>Policies</h3>
        <hr />
        {collectionPolicies.map((policy, index) => (
          <LabelWrapper key={index} onClick={() => hanldeFilterChange({ctype: "policy", policy}, !filter.policyFilter.includes(policy))}>
            <PixelCheckbox checked={filter.policyFilter.includes(policy)} size={vh(2)} /> {policy}
          </LabelWrapper>
        ))}
        <h3>APS</h3>
      <hr />
      {Object.keys(filter.APSFilter).map((key) => (
        <div key={key}>
          <h5>{key.toUpperCase()}</h5>
          <RangeWrapper>
            <RangeLabel>From:</RangeLabel>
            <RangeInput
              type="number"
              value={filter.APSFilter[key as keyof APSFilter]?.from || ''}
              onChange={e => handleRangeChange(key as keyof APSFilter, 'from', Number(e.target.value))}
            />
            <RangeLabel>To:</RangeLabel>
            <RangeInput
              type="number"
              value={filter.APSFilter[key as keyof APSFilter]?.to || ''}
              onChange={e => handleRangeChange(key as keyof APSFilter, 'to', Number(e.target.value))}
            />
          </RangeWrapper>
        </div>
      ))}
        <button onClick={handleApply}>Apply</button>
        <button onClick={handleClear}>Clear</button>
      </FilterContainer>
    )
  }
