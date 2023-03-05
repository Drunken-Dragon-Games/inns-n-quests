import { MouseEventHandler, useEffect, useMemo, useState } from "react"
import { shallowEqual, useSelector } from "react-redux"
import styled from "styled-components"
import _ from "underscore"
import { takenQuestStatus, takenQuestTimeLeft } from "../../../../common"
import { notEmpty, PixelArtImage, useDrag, vmax } from "../../../../utils"
import { InventoryItem, InventoryPageName, isDraggableItem, mapQuestScroll, sortCharacters } from "../../inventory-dsl"
import { InventoryState } from "../../inventory-state"
import InventoryTransitions from "../../inventory-transitions"
import { CharacterSprite, FurnitureSprite } from "../sprites"
import InventoryBox from "./inventory-box"

const InventoryPageContainer = styled.div`
    box-sizing: border-box;
    margin: 0.5vmax;
    padding-left: 0.5vmax;
    height: calc(100% - 1vmax);
    width: 100%;
    
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

const DirectionFix = styled.div`
    direction: ltr;

    display: inline-flex;
    flex-wrap: wrap;

    width: 100%;
    gap: 0.5vmax;

`

const ItemBox = styled(InventoryBox)`
    position: relative;
    width: 8vmax;
    height: 8vmax;
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
                    subState.selection?.ctype === "available-quest" && 
                    item.inActivity,
                center: false,
                overflowHidden: false,
            }
        } else if (item && item.ctype === "taken-quest") {
            return {
                info: takenQuestTimeLeft(item),
                selected:
                    subState.selection &&
                    subState.selection.ctype === "taken-quest" &&
                    subState.selection.takenQuestId === item.takenQuestId,
                disabled: false,
                center: true,
                overflowHidden: false,
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

    const {startDrag } = useDrag({
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
        hoverOn: () => setHover(!boxState.disabled && !subState.otherDraggingHappening),
        hoverOff: () => setHover(false),
    }), [item, boxState.disabled, /*draggingState.dragging,*/ subState.otherDraggingHappening])

    const [hover, setHover] = useState(false)

    const [ timedInfo, setTimedInfo ] = useState<{ info?: string } | undefined>(undefined)

    useEffect(() => {
        if (item?.ctype === "taken-quest" && takenQuestStatus(item) === "in-progress") {
            const interval = setInterval(() => { 
                setTimedInfo({ info: takenQuestTimeLeft(item) }) 
                if (takenQuestStatus(item) !== "in-progress") clearInterval(interval) 
            }, 1000)
            return () => clearInterval(interval)
        } else {
            setTimedInfo({ info: boxState.info })
        }
    }, [item])

    return { ...boxState, /*...draggingState,*/ ...callbacks, hover, startDrag, ...timedInfo }

}

const InventoryItemView = ({ item }: { item?: InventoryItem }) => {
    const state = useInventoryItemViewState(item)
    return (
        <ItemBox
            //onClick={() => !state.disabled && props.onItemClick && item && props.onItemClick(item)}
            onMouseUp={state.itemClick}
            onMouseDown={state.startDrag}
            onMouseEnter={state.hoverOn}
            onMouseLeave={state.hoverOff}
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
                units={vmax(0.8)}
                render={state.hover ? "hovered" : "normal"}
            /> 
        : item?.ctype === "taken-quest" ? 
            <PixelArtImage
                src={mapQuestScroll(item)}
                alt="quest scroll"
                width={7.3} height={6}
            /> 
        : item?.ctype === "furniture" ? 
            <FurnitureSprite
                furniture={item}
                units={vmax(0.8)}
                render={state.hover ? "hovered" : "normal"}
            /> :
        <></> } 
        </ItemBox>
    )
}

type InventoryPageState = {
    items: InventoryItem[]
    emptySlots: number[]
}

const useInventoryPageState = (page: InventoryPageName): InventoryPageState => {
    const subState = useSelector((state: InventoryState) => ({ 
        characters: Object.values(state.characters), 
        furniture: Object.values(state.furniture), 
        takenQuests: state.takenQuests,
        selection: state.activitySelection
    }), shallowEqual)
    const itemSlots = useMemo(() => {
        const items = 
            page == "characters" ? sortCharacters(subState.characters) :
            page == "furniture" ? subState.furniture
            : subState.takenQuests
        const slotsTail = items.length % 4
        const extraSlots = slotsTail === 0 ? 4 : 4 - slotsTail
        const amountIfWithExtraSlots = items.length + extraSlots
        const amountIfWithoutExtraSlots = (4 * 8) -items.length 
        const totalExtraSlots = amountIfWithExtraSlots >= 4 * 8 ? extraSlots : amountIfWithoutExtraSlots
        const emptySlots = Array(totalExtraSlots).fill(null).map((_, i) => i + items.length)
        return { items, emptySlots }
    }, [subState.characters, subState.furniture, subState.takenQuests, page])
    return itemSlots
}

const InventoryPage = ({ page }: { page: InventoryPageName }) => {
    const { items, emptySlots } = useInventoryPageState(page)
    return (
        <InventoryPageContainer>
            <DirectionFix>
                {items.map((item, index) =>
                    <InventoryItemView key={index} item={item} />
                )}
                {emptySlots.map((key) => 
                    <InventoryItemView key={key} />
                )}
            </DirectionFix>
        </InventoryPageContainer>
    )
}

export default InventoryPage