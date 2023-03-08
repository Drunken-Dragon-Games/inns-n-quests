import { MouseEventHandler, ReactNode, TouchEventHandler, useEffect, useMemo, useState } from "react"
import { shallowEqual, useSelector } from "react-redux"
import styled, { keyframes } from "styled-components"
import _ from "underscore"
import { notEmpty, PixelArtImage, px, takenQuestStatus, takenQuestTimeLeft, useDrag, useRememberLastValue } from "../../../../common"
import { InventoryItem, InventoryPageName, isDraggableItem, mapQuestScroll, sortCharacters } from "../../inventory-dsl"
import { InventoryState } from "../../inventory-state"
import InventoryTransitions from "../../inventory-transitions"
import { CharacterSprite, FurnitureSprite } from "../sprites"
import InventoryBox from "./inventory-box"

const InventoryPagesContainer = styled.div`
    width: 100%;
    position: relative;
    overflow: hidden;
`

const SwipePageAnimation = (from: number, to: number) => keyframes`
    0% { transform: translateX(${from}px); }
    100% { transform: translateX(${to}px); }
`

const PagesManagerContainer = styled.div<{ scrollFrom: number, scrollTo: number }>`
    height: 100%;
    padding: 10px;
    position: absolute;
    display: flex;
    gap: 10px;
    transform: translateX(${props => props.scrollTo}px);
    animation: ${props => SwipePageAnimation(props.scrollFrom, props.scrollTo)} 0.5s ease-in-out;
`

const Page = styled.div`
    box-sizing: border-box;
    padding: 0 10px;
    width: 490px;
    
    #background-color: blue;

    direction: rtl;
    overflow-x: hidden;
    overflow-y: scroll;

    ::-webkit-scrollbar {
        width: 0.4vw; 
      }
      
    /* Track */
    ::-webkit-scrollbar-track {
        background: #495362;
        background-clip: padding-box;
        border-left: 0.1vw solid transparent;
        border-right: 0.1vw solid transparent;
    }
       
    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0);
        border-top: 0.3vw solid rgba(0, 0, 0, 0);
        border-right: 0.5vw  solid #8A8780;
        border-bottom: 0.3vw  solid rgba(0, 0, 0, 0);;
        border-left: 0.5vw  solid #8A8780;
    }
      
    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #585652; 
    }
`

const DirectionFix = styled.div<{ tall?: boolean }>`
    direction: ltr;
    overflow: visible;

    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: minmax(${props => props.tall ? "180px" : "108.5px"}, 1fr);
    grid-gap: 10px;

    width: 100%;
`

const InventoryBoxContainer = styled.div`
    display: inline-block;
    height: 100%;
`

type InventoryItemViewState = {
    info?: string
    selected?: boolean
    disabled?: boolean
    center?: boolean
    overflowHidden?: boolean
    hover: boolean,
    itemClick: MouseEventHandler,
    hoverOn: MouseEventHandler,
    hoverOff: MouseEventHandler,
    startDrag: MouseEventHandler,
    startDragTouch: TouchEventHandler,
}

const useInventoryItemViewState = (item?: InventoryItem): InventoryItemViewState => {
    const subState = useSelector((state: InventoryState) => ({ 
        selection: state.activitySelection,
        selectedParty: state.selectedParty,
        otherDraggingHappening: notEmpty(state.draggingState)
    }), _.isEqual)
    const boxState = useMemo(() => {
        if (item && item.ctype === "character") {
            return {
                info: `${item.evAPS.athleticism}/${item.evAPS.intellect}/${item.evAPS.charisma}`,
                selected:
                    subState.selectedParty?.some((a) => a && a.entityId === item.entityId) ||
                    subState.selection?.ctype === "character" &&
                    subState.selection?.entityId === item.entityId,
                disabled:
                    subState.selection?.ctype === "available-staking-quest" && 
                    item.inActivity,
                center: false,
                overflowHidden: false,
            }
        } else if (item && item.ctype === "taken-staking-quest") {
            return {
                info: takenQuestTimeLeft(item),
                selected:
                    subState.selection &&
                    subState.selection.ctype === "taken-staking-quest" &&
                    subState.selection.takenQuestId === item.takenQuestId,
                disabled: false,
                center: true,
                overflowHidden: true,
            }
        } else if (item && item.ctype === "furniture") {
            return {
                info: "",
                selected:
                    subState.selection &&
                    subState.selection.ctype === "furniture" &&
                    subState.selection.entityId === item.entityId,
                disabled: false,
                center: false,
                overflowHidden: true,
            }
        } else return {}
    }, [item, subState.selection, subState.selectedParty])

    const { startDrag, startDragTouch } = useDrag({
        onDrag: (position) =>
            isDraggableItem(item) && InventoryTransitions.setDraggingState({ item: item, position }),
        onDrop: () =>
            isDraggableItem(item) && InventoryTransitions.onItemDragEnded(),
    })

    /*
    const draggingState = useMemo(() => ({
        dragging:
            !boxState.disabled &&
            isDraggableItem(item) &&
            notEmpty(vector) && 
            (Math.abs(vector[0]) > 20 || Math.abs(vector[1]) > 20),
    }), [item, boxState.disabled, vector])
    */

    const callbacks = useMemo(() => ({
        itemClick: () => !boxState.disabled && /*!draggingState.dragging &&*/ item && InventoryTransitions.onItemClick(item),
        hoverOn: () => {
            const allowedHover = !boxState.disabled && !subState.otherDraggingHappening
            setHover(allowedHover)
            if (allowedHover && item?.ctype === "character")
                InventoryTransitions.setCharacterInfo(item)
        },
        hoverOff: () => setHover(false),
    }), [item, boxState.disabled, /*draggingState.dragging,*/ subState.otherDraggingHappening])

    const [hover, setHover] = useState(false)

    const [ timedInfo, setTimedInfo ] = useState<{ info?: string } | undefined>(undefined)

    useEffect(() => {
        if (item?.ctype === "taken-staking-quest" && takenQuestStatus(item) === "in-progress") {
            setTimedInfo({ info: takenQuestTimeLeft(item) }) 
            const interval = setInterval(() => { 
                setTimedInfo({ info: takenQuestTimeLeft(item) }) 
                if (takenQuestStatus(item) !== "in-progress") clearInterval(interval) 
            }, 1000)
            return () => clearInterval(interval)
        } else {
            setTimedInfo({ info: boxState.info })
        }
    }, [item])

    return { ...boxState, /*...draggingState,*/ ...callbacks, hover, startDrag, startDragTouch, ...timedInfo }

}

const InventoryItemView = ({ item }: { item?: InventoryItem }) => {
    const state = useInventoryItemViewState(item)
    return (
        <InventoryBoxContainer>
            <InventoryBox
                //onClick={() => !state.disabled && props.onItemClick && item && props.onItemClick(item)}
                onMouseUp={state.itemClick}
                onMouseDown={state.startDrag}
                onMouseEnter={state.hoverOn}
                onMouseLeave={state.hoverOff}
                onTouchStart={state.startDragTouch}
                selected={state.selected}
                disabled={state.disabled}
                center={state.center}
                hover={state.hover}
                empty={!item}
                info={state.info}
                overflowHidden={state.overflowHidden}
            >
            { item?.ctype === "character" ?
                <CharacterSprite
                    character={item}
                    emoji={state.hover ? item.entityId : undefined}
                    units={px(17)}
                    render={state.hover ? "hovered" : "normal"}
                />
            : item?.ctype === "taken-staking-quest" ?
                <PixelArtImage
                    src={mapQuestScroll(item)}
                    alt="quest scroll"
                    width={7.3} height={6}
                    units={px(13)}
                />
            : item?.ctype === "furniture" ?
                <FurnitureSprite
                    furniture={item}
                    units={px(12)}
                    render={state.hover ? "hovered" : "normal"}
                /> :
            <></> }
            </InventoryBox>
        </InventoryBoxContainer>
    )
}

const pageEmptySlots = (pageItemsAmount: number): number[] => {
    const slotsTail = pageItemsAmount % 4
    const extraSlots = slotsTail === 0 ? 4 : 4 - slotsTail
    const amountIfWithExtraSlots = pageItemsAmount + extraSlots
    const amountIfWithoutExtraSlots = (4 * 8) - pageItemsAmount 
    const totalExtraSlots = amountIfWithExtraSlots >= 4 * 8 ? extraSlots : amountIfWithoutExtraSlots
    const emptySlots = Array(totalExtraSlots).fill(null).map((_, i) => i + pageItemsAmount)
    return emptySlots
}

const InventoryPage = ({ page }: { page: InventoryPageName }) => {
    const items = useSelector((state: InventoryState) => 
        page === "characters" ? Object.values(state.characters) :
        page === "furniture" ?  Object.values(state.furniture) :
        Object.values(state.takenQuests), shallowEqual)
    const emptySlots = useMemo(() => pageEmptySlots(items.length), [items.length])
    return (
        <Page>
            <DirectionFix tall={page == "characters"}>
                {items.map((item, index) =>
                    <InventoryItemView key={index} item={item} />
                )}
                {emptySlots.map((key) =>
                    <InventoryItemView key={key} />
                )}
            </DirectionFix>
        </Page>
    )
}

const pagePosition = (page: InventoryPageName): number => 
    page == "characters" ? 0 :
    page == "furniture" ? -500 :
    -1000

const PagesManager = ({ children }: { children?: ReactNode }) => {
    const page = useSelector((state: InventoryState) => state.activeInventoryPage, shallowEqual)
    const lastPage = useRememberLastValue(page, "characters")
    const scrollState = useMemo(() => ({ scrollFrom: pagePosition(lastPage), scrollTo: pagePosition(page)}), [page])
    return (
        <PagesManagerContainer {...scrollState}>
            {children}
        </PagesManagerContainer>
    )
}

const InventoryPages = ({ className }: { className?: string }) => 
    <InventoryPagesContainer className={className}>
        <PagesManager>
            <InventoryPage page="characters" />
            <InventoryPage page="furniture" />
            <InventoryPage page="taken-quests" />
        </PagesManager>
    </InventoryPagesContainer>

export default InventoryPages