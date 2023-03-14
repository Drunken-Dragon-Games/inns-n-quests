import { MouseEventHandler, ReactNode, TouchEventHandler, useEffect, useMemo, useState } from "react"
import { shallowEqual, useSelector } from "react-redux"
import styled, { keyframes } from "styled-components"
import _ from "underscore"
import { Character, Furniture, isCharacter, isFurniture, notEmpty, PixelArtImage, px, takenQuestStatus, takenQuestTimeLeft, useRememberLastValue, vh, vw } from "../../../../common"
import { DragNDropApi } from "../../../drag-n-drop"
import { ActivitySelection, CharacterParty, InventoryItem, InventoryPageName, mapQuestScroll } from "../../inventory-dsl"
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
    0% { transform: translateX(${from}%); }
    100% { transform: translateX(${to}%); }
`

const PagesManagerContainer = styled.div<{ scrollFrom: number, scrollTo: number }>`
    height: 100%;
    width: 300%;
    padding: 2%;
    position: absolute;
    display: flex;
    gap: 1.5%;

    #background-color: red;

    transform: translateX(${props => props.scrollTo}%);
    animation: ${props => SwipePageAnimation(props.scrollFrom, props.scrollTo)} 0.5s ease-in-out;
`

const Page = styled.div`
    box-sizing: border-box;
    padding-left: 0.66%;
    width: 33%;
    
    
    #background-color: blue;

    direction: rtl;
    overflow-x: hidden;
    overflow-y: scroll;

    ::-webkit-scrollbar {
        width: 5px; 
      }
      
    /* Track */
    ::-webkit-scrollbar-track {
        background: #495362;
        background-clip: padding-box;
        border-left: 1px solid transparent;
        border-right: 1px solid transparent;
    }
       
    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0);
        border-top: 2px solid rgba(0, 0, 0, 0);
        border-right: 3px  solid #8A8780;
        border-bottom: 2px  solid rgba(0, 0, 0, 0);;
        border-left: 3px  solid #8A8780;
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
    grid-gap: 10px;
    & > * { aspect-ratio: ${props => props.tall ? "1/1.75" : "1/1"}; }

    width: 100%;
`

const InventoryItemViewContainer = styled.div`
    #display: inline-block;
    #height: 100%;
`

const isDraggableItem = (item?: InventoryItem): item is (Character | Furniture) => 
    notEmpty(item) && item.ctype !== "taken-staking-quest"

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

const useInventoryItemViewState = (activity?: ActivitySelection, party: CharacterParty = [], item?: InventoryItem): InventoryItemViewState => {
    const boxState = useMemo(() => {
        if (item && item.ctype === "character") {
            return {
                info: `${item.evAPS.athleticism}/${item.evAPS.intellect}/${item.evAPS.charisma}`,
                selected:
                    party.some((a) => a && a.entityId === item.entityId) ||
                    activity?.ctype === "character" &&
                    activity?.entityId === item.entityId,
                disabled:
                    activity?.ctype === "available-staking-quest" && 
                    item.inActivity,
                center: false,
                overflowHidden: false,
            }
        } else if (item && item.ctype === "taken-staking-quest") {
            return {
                info: takenQuestTimeLeft(item),
                selected:
                    activity?.ctype === "taken-staking-quest" &&
                    activity.takenQuestId === item.takenQuestId,
                disabled: false,
                center: true,
                overflowHidden: true,
            }
        } else if (item && item.ctype === "furniture") {
            return {
                info: "",
                selected:
                    activity?.ctype === "furniture" &&
                    activity.entityId === item.entityId,
                disabled: false,
                center: false,
                overflowHidden: true,
            }
        } else return {}
    }, [item, activity, party])

    const enableDragging = !boxState.disabled && isDraggableItem(item)
    const { dragging, startDrag, startDragTouch } = DragNDropApi.useDrag({
        utility: !activity ? "overworld-drop" :  "party-pick",
        payload: item,
        enabled: enableDragging,
        onDragStart: () => {
            if (!activity) InventoryTransitions.openOverworldDropbox()
        },
        onDragStop: () => 
            InventoryTransitions.closeOverworldDropbox(),
        draggingView: () => 
            isCharacter(item) ? <CharacterSprite character={item} render="hovered" units={vh(1.7)} /> :
            isFurniture(item) ? <FurnitureSprite furniture={item} render="hovered" units={vh(1.7)} /> :
            <></>
    })

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

    const [hover, setHover] = useState(false)
    const callbacks = useMemo(() => ({
        itemClick: () => !boxState.disabled && !dragging && item && InventoryTransitions.onItemClick(item),
        hoverOn: () => {
            const allowedHover = !boxState.disabled && !DragNDropApi.dragging()
            setHover(allowedHover)
            if (allowedHover && item?.ctype === "character")
                InventoryTransitions.setCharacterInfo(item)
        },
        hoverOff: () => setHover(false),
    }), [item, boxState.disabled, /*draggingState.dragging,*/ DragNDropApi.dragging()])

    return { ...boxState, /*...draggingState,*/ ...callbacks, hover, startDrag, startDragTouch, ...timedInfo }

}

const InventoryItemView = ({ item, activity, party }: { item?: InventoryItem, activity?: ActivitySelection, party?: CharacterParty }) => {
    const state = useInventoryItemViewState(activity, party, item)
    return (
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
                //units={px(17)}
                units={vh(1.5)}
                //max={px(17)}
                render={state.hover ? "hovered" : "normal"}
            />
        : item?.ctype === "taken-staking-quest" ?
            <PixelArtImage
                src={mapQuestScroll(item)}
                alt="quest scroll"
                width={7.3} height={6}
                units={vh(1.5)}
            />
        : item?.ctype === "furniture" ?
            <FurnitureSprite
                furniture={item}
                units={vh(0.9)}
                render={state.hover ? "hovered" : "normal"}
            /> :
        <></> }
        </InventoryBox>
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
    const state = useSelector((state: InventoryState) => ({
        items:
            page === "characters" ? Object.values(state.characters) :
            page === "furniture" ?  Object.values(state.furniture) :
            Object.values(state.takenQuests),
        activity: state.activitySelection,
        party: page == "characters" ? state.selectedParty : [],
    }), _.isEqual)
    const emptySlots = useMemo(() => pageEmptySlots(state.items.length), [state.items.length])
    return (
        <Page>
            <DirectionFix tall={page == "characters"}>
                {state.items.map((item, index) =>
                    <InventoryItemView key={index} item={item} activity={state.activity} party={state.party} />
                )}
                {emptySlots.map((key) =>
                    <InventoryItemView key={key} activity={state.activity} />
                )}
            </DirectionFix>
        </Page>
    )
}

const pagePosition = (page: InventoryPageName): number => 
    page == "characters" ? 0 :
    page == "furniture" ? -33.3333 :
    -66.6666

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