import { v4 as uuidv4 } from 'uuid';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'; 
import { combineReducers } from "redux";
import { metadata, adventurersData } from "../data/data"

const data = metadata;

//agreaga UUID a todos los elementos en el array 
const dataID = (data as []).map((adventurer: any)  => {
    adventurer.uuid = uuidv4();
    return adventurer
})


interface filter{
    Material: string 
    Faction:    string
    "Game Class": string
}




interface CardArray {
    Adventurer: string
    athleticism: number
    charisma: number
    image: string
    intellect: number
    src: string
    tokenNumber: number
    rarity: string
    uuid: string
}


interface adventurersData{
    terrorhertz : adenturers
    vimtyr: adenturers
    aki: adenturers
    othil: adenturers
    tyr: adenturers
    ulf: adenturers
    marendil: adenturers
    haakon: adenturers
    vale: adenturers
    naya: adenturers
    shaden: adenturers
    drignir: adenturers
    gulnim: adenturers
    avva: adenturers
    delthamar: adenturers
    aumara: adenturers
    milnim : adenturers
}


interface adenturers{
    Adventurer: string
    Title: string
    Race: string
    Age: string
    Faction: string
    "Game Class": string
    "Lore Class": string
    "Concept Artists"?: string []
    "Splashart Composition Artists"?: string []
    "Pixel Artists"?: string []
    "Miniature Pixel Artists"?: string []

}

interface initial{
    data: any
    filter: filter
    selected: null | number
    dataOriginal: any
}

const initial : initial = { data: dataID, filter:{Material: "",Faction: "","Game Class": ""},  selected: null, dataOriginal: dataID}

const  adventurersOfThiolden = createSlice({
    name: "adventurers_of_thiolden",
    initialState: initial,
    reducers: {
      
        setFilter: (state, action: PayloadAction<filter>) => {
            state.filter = action.payload
         
        },

        setSelected: (state, action: PayloadAction<number>) => {
            state.selected = action.payload
         
        },
        setFilteredData(state){
            let filteredReducer = state.dataOriginal
    

            Object.keys(state.filter).forEach( ((filterCamp: string ) => {
        
                if(state.filter[(filterCamp as keyof filter) ] !== ''){
                    if(filterCamp == "Faction"){
                        filteredReducer = filteredReducer.filter( (adventurer: CardArray) => adventurersData[(adventurer.Adventurer as keyof adventurersData)].Faction == state.filter[filterCamp])
                    } else if (filterCamp == "Game Class"){
                        filteredReducer = filteredReducer.filter( (adventurer: CardArray) => adventurersData[(adventurer.Adventurer as keyof adventurersData)]["Game Class"] == state.filter[filterCamp])
                    } else if (filterCamp == "Material"){
                        filteredReducer = filteredReducer.filter( (adventurer: CardArray) => adventurer.rarity == state.filter[filterCamp])
                    }
                }
               
            }))

            while (filteredReducer.length < 8 && filteredReducer.length != 0) {
          
                let arrayCopy = filteredReducer.map((object : CardArray) => ({ ...object }))
        
                arrayCopy = arrayCopy.map((adventurer : CardArray) =>{
                    adventurer.uuid = uuidv4();
                        return adventurer
                })
                
                filteredReducer = filteredReducer.concat(arrayCopy)
            }

            state.data = filteredReducer
        },   
      
    },
});

export const { setFilter, setSelected, setFilteredData } = adventurersOfThiolden.actions


interface initialBanner{
   bannerName: "none" | "rarity_chart" | "roster"
}

const initialBanner : initialBanner = { bannerName: "none" }

const  banner = createSlice({
    name: "banner",
    initialState: initialBanner,

    reducers: {
      
        setPage(state, action: PayloadAction<"none" | "rarity_chart" | "roster">){
            state.bannerName = action.payload
        }

    },
});

export const { setPage } = banner.actions

export const exploreOfThioldenReducer = combineReducers({
    data: adventurersOfThiolden.reducer,
    banner: banner.reducer
})