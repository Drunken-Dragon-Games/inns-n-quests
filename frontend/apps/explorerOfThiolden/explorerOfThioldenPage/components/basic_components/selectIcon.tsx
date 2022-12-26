import styled from "styled-components"
import Image from "next/image"


const IconComponentWrapper =styled.div`
    position: relative;
    width: 100%;
    height: 100%;
`

const IconWrapper = styled.div`
    z-index: 1;
    position: absolute;
    width: 90%;
    height: 100%;
    top: 0.1vw;
    left: 0.125vw;
`

const IconActiveWrapper = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0.0vw;
    right: 0.01vw;
    z-index: 0;
`


interface SelectIcon{
    isActive: boolean
    icon_src: string
    icon_src_active: string
}


const SelectIcon = ({isActive, icon_src, icon_src_active}:SelectIcon ) =>{
    return(<>     
            <IconComponentWrapper>
                <IconWrapper>
                    <Image 
                            src = {icon_src}  
                            alt = "icon drunken dragon"   
                            layout = "responsive" 
                            width={2000} 
                            height={2000}
                    />
                </IconWrapper>
                
                {isActive == true
                    ?
                        <IconActiveWrapper>
                            <Image 
                                    src = {icon_src_active}  
                                    alt = "icon drunken dragon"   
                                    layout = "responsive" 
                                    width={2000} 
                                    height={2000}
                            />
                        </IconActiveWrapper>
                    :
                        null
                }

            </IconComponentWrapper>
        </>)
}

export default SelectIcon