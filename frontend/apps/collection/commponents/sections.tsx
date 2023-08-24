import styled from "styled-components";
import { MessiriFontFamily, OswaldFontFamily, colors } from "../../common";
import { ReactNode } from "react";

const SectionContainer = styled.div`
    ${MessiriFontFamily}
    padding: 20px;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 5px;
    box-shadow: 0 0 20px 0 rgba(0,0,0,0.8);
    display: flex;
    flex-direction: column;
    align-items: center;
    
    @media only screen and (max-width: 1400px) {
        width: 100%;
        max-width: 900px;
    }
`;

const SectionTitle = styled.h1`
    font-size: 20px;
    text-align: center;
    color: ${colors.textGray};
    margin-bottom: 20px;
    ${OswaldFontFamily}
    font-weight: bold;
`;

const SectionContent = styled.div`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
    width: 100%;
`;

export const Section = (props: { children?: ReactNode, title: string }) => 
    <SectionContainer>
        <SectionTitle>{props.title}</SectionTitle>
        <SectionContent> {props.children}</SectionContent>
    </SectionContainer>
