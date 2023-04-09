import styled from "styled-components";

export const ClaimButton = styled.button`
  background: linear-gradient(135deg, #9f692c, #fab94d, #cc9d54);
  color: #333;
  font-size: var(--min-font-size);
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: bold;
  transition: all 0.2s ease-in-out;
  clip-path: polygon(15% 0, 85% 0, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0 85%, 0 15%);
  &:hover {
    background-color: #FFC300;
  }
  &:focus {
    outline: none;
  }
`;


