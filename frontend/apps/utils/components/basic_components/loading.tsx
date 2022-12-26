
import styled from "styled-components";
import Image from 'next/image'
import { useLoadingAnimation } from "../../hooks";

interface size {
    width: number
}
const LotusLoading = styled.div<size>`
    margin: auto;
    width: ${props => props.width}vw;
    height: ${props => props.width}vw;
    position: relative;
`

interface LoadingElements{
    render: boolean
}

const LoadingOne = styled.div<LoadingElements>`
    position: absolute;
    visibility: ${props => props.render ? "visible": "hidden"};
    img{
        width:  100% !important;
    }
`

const LoadingTwo = styled.div<LoadingElements>`
    position: absolute;
    visibility: ${props => props.render ? "visible": "hidden"};
    img{
        width:  100% !important;
    }
`

const LoadingThree = styled.div<LoadingElements>`
    position: absolute;
    visibility: ${props => props.render ? "visible": "hidden"};
    img{
        width:  100% !important;
    }
`

const LoadingFour = styled.div<LoadingElements>`
    position: absolute;
    visibility: ${props => props.render ? "visible": "hidden"};
    img{
        width:  100% !important;
    }
`

const LoadingFive = styled.div<LoadingElements>`
    position: absolute;
    visibility: ${props => props.render ? "visible": "hidden"};
    img{
        width:  100% !important;
    }
`

interface Loading {
    size: number
}
const Loading = ({size}:Loading ): JSX.Element => {

    const [LoadingRenderNumber] = useLoadingAnimation(300)
    

    return (<>
   
        <LotusLoading width ={size}>

            <LoadingOne render={LoadingRenderNumber == 1}>
                <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/utils/loading/wait1.png"  alt="loading icon" width={1000} height={1000}/>
            </LoadingOne>

            <LoadingTwo render={LoadingRenderNumber == 2}>
                <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/utils/loading/wait2.png"  alt="loading icon" width={1000} height={1000}/>
            </LoadingTwo>

                    
            <LoadingThree render={LoadingRenderNumber == 3}>
                <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/utils/loading/wait3.png"  alt="loading icon" width={1000} height={1000}/>
            </LoadingThree>

            <LoadingFour render={LoadingRenderNumber == 4}>
                <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/utils/loading/wait4.png"  alt="loading icon" width={1000} height={1000}/>
            </LoadingFour>

            <LoadingFive render={LoadingRenderNumber == 5}>
                <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/utils/loading/wait5.png"  alt="loading icon" width={1000} height={1000}/>
            </LoadingFive>

        </LotusLoading>
        
    </>)
}

export default Loading