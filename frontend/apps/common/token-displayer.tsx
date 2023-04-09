import Image from 'next/image';
import styled from 'styled-components';

const OvalContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: rgba(240, 240, 240, 0.1); // Lighter gray background
  border: 1px solid rgba(128, 128, 128, 0.3); // Gray border
  border-radius: 25px;
  padding: 5px 10px;
`;

const TokenImageWrapper = styled.div`
  position: relative;
  width: calc(15px + 2vw);
  height: calc(15px + 2vw);
  max-width: 50px;
  max-height: 50px;
`;
const NumberText = styled.span`
  font-size: var(--min-font-size);
  margin-left: 10px;
`;

interface TokenDisplayerProps {
  icon: string;
  number: number;
}

export const TokenDisplayer: React.FC<TokenDisplayerProps> = ({ icon, number }) => {
  return (
    <OvalContainer>
      <TokenImageWrapper>
        <Image
          src={`https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/navbar_main/icons/${icon}.svg`}
          layout="fill"
          objectFit="contain"
          alt="token drunken dragon icon"
        />
      </TokenImageWrapper>
      <NumberText>{number}</NumberText>
    </OvalContainer>
  );
};
