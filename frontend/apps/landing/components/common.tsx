import { useWindowWidth } from "@react-hook/window-size"
import { useEffect, useState } from "react"
import styled from "styled-components"

export const LandingPageSection = styled.section`
    width: 100%;
    max-width: 2400px;
`

export const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false)
    const width = useWindowWidth()
    useEffect(() => {
      if(width <= 820){
        setIsMobile(true)
      } else if(width > 820){
        setIsMobile(false)
      } 
    }, [width])
    return isMobile
}