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
  clip-path: polygon(
    5% 3%, 10% 0%, 90% 0%, 95% 3%,
    97% 5%, 100% 10%, 100% 90%, 97% 95%,
    95% 97%, 90% 100%, 10% 100%, 5% 97%,
    3% 95%, 0 90%, 0 10%, 3% 5%
  );
  &:hover {
    background-color: #FFC300;
  }
  &:focus {
    outline: none;
  }
`;


