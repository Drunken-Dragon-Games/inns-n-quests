
import { ExplorerDesktop, LoadingSection, ExplorerMovil } from '../explorerOfThioldenPage/components/complex'
import styled from "styled-components"
import { ConditionalRender } from '../../utils/components/basic_components'
import { useIsMovil } from './hooks'



const Relative = styled.section`
  position: relative;
`

const ExplorerOfThioldenApp = (): JSX.Element =>{


  const isMobile = useIsMovil()
  
  
  return(<>
    
      
      <Relative>
        
        {/* <LoadingSection/> */}

        <ConditionalRender condition={isMobile == false}>
            <ExplorerDesktop/>
        </ConditionalRender>

        <ConditionalRender condition={isMobile == true}>
            <ExplorerMovil/>
        </ConditionalRender>
      </Relative>


      
  </>)
}


export default ExplorerOfThioldenApp