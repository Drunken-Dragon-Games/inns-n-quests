import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MessiriFontFamily } from '../common-css';

const CookieConsentBannerContainer = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 1rem;
    text-align: center;
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: calc(2vh);
`

const ConsentMessage = styled.span`
    flex-grow: 1;
    ${MessiriFontFamily}

    a {
        color: #fcbf5e;
        text-decoration: none;
    }

    a:hover {
        text-decoration: underline;
 `

const CloseButton = styled.button`
    background-color: transparent;
    border: none;
    color: white;
    cursor: pointer;
    @media (max-width: 414px) {
        font-size: calc(4vh);
    }
`

const CookieConsentBanner = (): JSX.Element | null => {
    const [isVisible, setIsVisible] = useState<boolean>(true)
    const handleClose = () => {
        setIsVisible(false)
    }

    return isVisible ? (
        <CookieConsentBannerContainer>
            <ConsentMessage>
            By using this website, you agree to our use of cookies. Learn more in our <a href="https://luispm.files.wordpress.com/2012/12/i-o-u.jpg" target="_blank">Privacy Policy</a>.
            </ConsentMessage>
            <CloseButton onClick={handleClose}>&times;</CloseButton>
        </CookieConsentBannerContainer>
    ) : null
}

export default CookieConsentBanner
