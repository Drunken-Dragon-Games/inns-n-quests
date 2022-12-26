import {  useDrop } from "react-dnd";
import styled from "styled-components";
import { useState } from "react"
// import { setSelectAdventurer } from "../../features/availableQuest"
import { useDispatch } from 'react-redux'
import { Feelings, RescalingImg } from ".";
import { useGetLevel } from "../../hooks";
import Image from 'next/image'

interface DataAdventurer{
    id: string,
    src: string,
    experience: number,
    type: string
}

interface DropBox {
    index: number,
    questLevel: number,
}

const DropBoxElement = styled.div`
    width: 7vw;
    height: 8vw;
    position: relative;
    
`

const Center = styled.div`
    display: flex;
    width: inherit;
    height: inherit;
    position: absolute;

`
const Absolute = styled.div`
    position: absolute;
    top: 1.5vw;
    width: inherit;
    height: 5vw;
    display: flex;
`

const Flex = styled.div`
    
    margin: auto;
    z-index: -1;
  
    width: 2.3vw;
    height: 2.3vw ;


`
interface FeelingAnimationWrapper{
    hover: boolean
}

const FeelingAnimationWrapper = styled.div<FeelingAnimationWrapper>`
    opacity: ${props => props.hover ? "0" : "1" };
    transition: opacity 0.6s;
`

interface DeleteAnimationWrapper{
    hover: boolean
}

const DeleteAnimationWrapper = styled.div<DeleteAnimationWrapper>`
    opacity: ${props => props.hover ? "1" : "0" };
    transition: opacity 0.6s;
    position: absolute;
    top: -0.6vw;
    left: 3.4vw;
    cursor: pointer;
    &:hover{
      opacity: 0.7;
    }
    
    img{
        width: 1vw !important;
        height: 1vw !important;
        
    }
`

const AdventureWrapper = styled.div`
    margin: auto;
`


const AdventurerCenterWrapper = styled.div`
    display: flex;
    
    height: 7.8vw;

    div{
        
        margin: auto auto 0vw auto;
    }
`
 

const DropBox = ({index, questLevel}: DropBox ) =>{ 
    const dispatch = useDispatch()

    const [ adventurer, SetAdventurer ] = useState<string>("")
    const [ type, SetType ] = useState<string>("")
    const [ experience, setExperience] = useState<number>(0)
    const [ onHover, setOnHover ] =useState<boolean>(false)
    const [ level ] = useGetLevel(experience)
    
    //un hook del drag and drop lo que toma los datos que se requieren desde el elemento que dropea 
    const [{isOver}, drop] = useDrop(() => ({
        accept: "adventurer",
        drop: (item: DataAdventurer) => addBox(item.id, item.src, item.experience, item.type),
        collect:(monitor) => ({
            isOver: !!monitor.isOver()
        })
    }))

    //se activa esta funcion cuando un objeto es dejada en estra dropbox
    const addBox = (id: string, src: string, experience: number, type: string) =>{
        SetAdventurer(src)
        // dispatch(setSelectAdventurer({index: index , id, unSelect: false}))
        setExperience(experience)
        SetType(type)
    }

    //elimina el objeto en este dropbox

    const removeBox = () => {
        SetAdventurer("")
        // dispatch(setSelectAdventurer({index: index , unSelect: true}))
        setExperience(0)
    }


    
    return (
        <>
            <DropBoxElement ref={drop} 
                            onMouseOver = {adventurer != undefined ? () => setOnHover(true) : () => null} 
                            onMouseLeave ={adventurer != undefined ? () => setOnHover(false) : () => null}              
            >
                
                { adventurer != "" 
                    ?  
                        <Center>
                                <AdventureWrapper>
                                    <FeelingAnimationWrapper hover ={onHover}>
                                        <Feelings level = {level} questLevel ={questLevel}/>
                                    </FeelingAnimationWrapper>

                                    <DeleteAnimationWrapper hover ={onHover} onClick = {removeBox}>
                                        <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/close_icon.png"  alt="fail mark image" width={2000} height={1250} />
                                    </DeleteAnimationWrapper>

                                    <AdventurerCenterWrapper>
                                        <div>                                    
                                            <RescalingImg  
                                                src= {adventurer}
                                                type={type} 
                                            />
                                        </div>

                                    </AdventurerCenterWrapper>
        
                                </AdventureWrapper>
                            </Center>
                        
                    : null }

                    <Absolute>
                        <Flex>
                            <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/dropbox.png"  alt="paper prop" width={2000} height={2000} layout="responsive" />
                        </Flex>
                    </Absolute>

            </DropBoxElement>
        </>
    )
}

export default DropBox