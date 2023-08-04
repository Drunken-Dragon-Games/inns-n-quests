import React, { useState } from 'react';
import { collectionTransitions } from "../collection-transitions"
import { CollectionFilter } from '../collection-state-models'
import styled from 'styled-components';
import { vh } from '../../common';
import { PixelCheckbox } from './components';

const FilterContainer = styled.div`
  width: 200px;
  position: absolute;
  left: 0;
  top: 0;
  color: white;
  background-color: lightblue;
`;


export const FilterView = () => {
    const words = [""]
    const [selectedWords, setSelectedWords] = useState<string[]>([]);
  
    const handleCheckboxChange = (word: string, checked: boolean) => {
      if (checked) {
        setSelectedWords([...selectedWords, word]);
      } else {
        setSelectedWords(selectedWords.filter(selectedWord => selectedWord !== word));
      }
    };
  
    const handleApply = () => {
        const filter = { array1: selectedWords, array2: [] }; // Modify as needed
        collectionTransitions.getCollection()
    };
  
    return (
      <FilterContainer>
        {words.map((word, index) => (
          <div key={index}>
            <label>
              <PixelCheckbox
                checked={selectedWords.includes(word)}
                size={vh(5)} // adjust as needed
                onChange={(checked) => handleCheckboxChange(word, checked)}
              />
              {word}
            </label>
          </div>
        ))}
        <button onClick={handleApply}>Apply</button>
      </FilterContainer>
    );
  };
