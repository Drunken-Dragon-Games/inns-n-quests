import styled from 'styled-components';
import { TextElMessiri } from '../../../../../../utils/components/basic_components';

const DragonSilverTextWrapper = styled.div`
    width: 2.5vw;
    margin: 0.1vw 0.4vw 0vw -0.2vw;
`

const CountEffect = () => {
    
    //realiza el efecto de contador de dragon silver
    //const dragonSilver  = useEffectCounting(10, 15, 10)
    const dragonSilver = 10
   
    return (
        <>
            <DragonSilverTextWrapper>
                <TextElMessiri fontsize={0.9} color="white">{dragonSilver}</TextElMessiri>
            </DragonSilverTextWrapper>
        </>
    )
}

export default CountEffect