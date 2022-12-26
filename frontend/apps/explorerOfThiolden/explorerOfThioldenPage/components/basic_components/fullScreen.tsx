import styled from "styled-components";



const FullScreen = styled.div`
    width: 100%;
    height: 100%;
    background-color: #090E14;
    position: absolute;
    display: flex;
    z-index: 12;
    top: 0vw;

    @media only screen and (max-width: 414px) {
        width: 100%;
        height: 100vh;
    }
`

export default FullScreen