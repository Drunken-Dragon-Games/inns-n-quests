import { createSlice, PayloadAction } from '@reduxjs/toolkit'; 
import { combineReducers } from "redux";
import { axiosCustomInstance } from '../../../../../../axios/axiosApi'; 
import { createSliceStatus, actionsGenerator } from "../../../../../utils/features/utils"
import { generalReducerThunk } from '../../../../../../features/generalReducer';
import { adventurer } from "../../../dummy_data"

//fetch para obeter a los aventureros

export const getAdventurers = () : generalReducerThunk => async (dispatch) =>{
  
    dispatch(setFetchGetAdventurersStatusPending())
    try {  

        if(process.env["NEXT_PUBLIC_API_BASE_HOSTNAME"] !== undefined){
            //fetch para obeter a los aventureros
            // FIXME: verify path
            const response = await axiosCustomInstance('/quests/api/adventurers').get('/quests/api/adventurers')   
            dispatch(setAdventurers(response.data))  
            dispatch(setFetchGetAdventurersStatusFulfilled())

        } else{
                     
            dispatch(setAdventurers(adventurer))
            dispatch(setFetchGetAdventurersStatusFulfilled())
        }
       
      
 
    } catch (err: unknown) {
        
        // if(err instanceof AxiosError ){
        //     dispatch(setFetchGetAdventurersStatusErrors(err.response))
        //     dispatch(fetchRefreshToken( () => dispatch(getAdventurers()), err))
        // }
    }
  
}

//reducer para monitorear el estado del request para los aventureros
  
const  fetchGetAdventurersStatus  = createSliceStatus("fetchGetAdventurersStatus")

const [ setFetchGetAdventurersStatusIdle, setFetchGetAdventurersStatusPending, setFetchGetAdventurersStatusFulfilled, setFetchGetAdventurersStatusErrors ] = actionsGenerator(fetchGetAdventurersStatus.actions)



//reducer para manejar los cambios en los datos de adventurers


interface DataAdventurer{
    id: string
    name: string,
    experience: number
    adventurer_img: string
    in_quest: boolean
    on_chain_ref: string
    onRecruitment?: boolean
    sprites: string
    type: "pixeltile" | "gma"
    metadata: metadata
    race: string
    class: string
  }

  interface metadata{
    is_alive?: boolean,
    dead_cooldown?: number
  }


  interface adventurerAfterQuest{
    id: string
    experience?: number
    type?: "pixeltile" | "gma"
    dead_cooldown?: number
  }


//funcion para ordenar por nivel los aventureros INPUT array de aventureros 
const sortingLevel = (adventurersArray: DataAdventurer []) => {
    

    adventurersArray.sort(function (a: DataAdventurer , b: DataAdventurer) {
        if (a.experience > b.experience) {
          return -1;
        }
        if (a.experience < b.experience) {
          return 1;
        }

        return 0;
    });

}


const adventurersSorting = (adventurers: DataAdventurer[] ) =>{
    const adventurersFree = adventurers.filter((element: DataAdventurer) => element.in_quest  == false);
    const adventurersInQuest = adventurers.filter((element: DataAdventurer) => element.in_quest  == true);

    sortingLevel(adventurersFree);
    sortingLevel(adventurersInQuest);

    return adventurersFree.concat(adventurersInQuest)
}


interface initialStateAdventurer{
    data:  DataAdventurer [] 
}
const initialStateAdventurer:  initialStateAdventurer = {data: []}

const adventurers = createSlice({
    name: "adventurers ",
    initialState: initialStateAdventurer,
    reducers: {
        
        //Este caso primero se hacen dos arrays dividiendo entre los aventureros disponibles y los que no y posteriormente se ordena por cantidad de experiencia

        setAdventurers: (state, action: PayloadAction<DataAdventurer[]>) => {

            const adventurersSorted = adventurersSorting(action.payload)
            state.data = adventurersSorted

        },

        setAdventuresInQuest: (state, action: PayloadAction<(string | undefined)[]>) => {

            // FIXME: change it to filter, forEach or map
            const reducer =  state.data.reduce ((acc: DataAdventurer [] , originalElement: DataAdventurer) =>{
                
                action.payload.forEach((newElement: string | undefined) => {
                    if(newElement == originalElement.id){
                            originalElement.in_quest = true
                        return acc.concat(originalElement)
                    }
                })

                return acc.concat(originalElement)
                
            }, [])

    
            const adventurersSorted = adventurersSorting(reducer)

            state.data = adventurersSorted
        },

        setFreeAdventurers: (state, action: PayloadAction<DataAdventurer[]>) => {

            // FIXME: change it to filter, forEach or map
            //crea un array con todos los id de los aventureros en el array
            const adventurersIds = action.payload.reduce ((acc: string [] , originalElement: adventurerAfterQuest) =>{            
                return acc.concat(originalElement.id)
            }, [])

            // FIXME: change it to filter, forEach or map
             //este reducer toma el array con los ids y el estado con el array de los aventureros y cuando tenga el mismo id cambia la propiedad in_quest  a false
        
            const adventurers =  state.data.reduce ((acc: DataAdventurer [] , originalElement: DataAdventurer) =>{            
            
            adventurersIds.forEach((adventurerId: string) => {
                if(adventurerId == originalElement.id){
                        originalElement.in_quest = false
                    return acc.concat(originalElement)
                }
            })

            return acc.concat(originalElement)
                
            }, [])

            const adventurersSorted = adventurersSorting(adventurers)

            state.data = adventurersSorted

        },

          //Este caso recibe un array de aventureros para dar expericia de un quest y cambia la propiedad de experience a la nueva expericia y el nuevo nivel
        setExperienceReward: (state, action: PayloadAction<DataAdventurer[]>) => {
            // FIXME: change it to filter, forEach or map
            const adventurers =  state.data.reduce ((acc: DataAdventurer [] , originalElement: DataAdventurer) =>{            
                
                action.payload.forEach((adventurer: adventurerAfterQuest) => {

                if(adventurer.id == originalElement.id){
                    
                    originalElement.experience = adventurer.experience!

                    return acc.concat(originalElement)
                }
            })

                return acc.concat(originalElement)
                
            }, [])

            const adventurersSorted = adventurersSorting(adventurers)

            state.data = adventurersSorted

        },

        //este caso setea la muerte llega un array con los heroes muertos y se compara con el estado el array de aventureros se comparan los id y enn caso de que el tipo sea pixeltile se setea la experioencia a 0 y en casa gma se setea el cooldown de muerto
        setDeath: (state, action: PayloadAction<DataAdventurer[]>) => {
            // FIXME: change it to filter, forEach or map
            const adventurers =  state.data.reduce ((acc: DataAdventurer [] , originalElement: DataAdventurer ) =>{            
                    
                action.payload.forEach((adventurer: adventurerAfterQuest) => {


                    if(adventurer.id == originalElement.id){
                        if(adventurer.type == "pixeltile"){
                            originalElement.experience = 0
                        } else if (adventurer.type == "gma"){
                            originalElement.metadata.dead_cooldown = adventurer.dead_cooldown
                            originalElement.metadata.is_alive = false;
                        }

                        return acc.concat(originalElement)
                    }
                })

                return acc.concat(originalElement)
                
            }, [])

            
            const adventurersSorted = adventurersSorting(adventurers)

            state.data = adventurersSorted
        },

        //este caso esta hecho para meter un placeholder en cuando se recluta un aventurero en el faucet
        setRecruitment: (state) => {

            const recruiter: DataAdventurer = {
                id: "b9930b53-aed1-4feb-a424-2c75f3f123456d2asdasdafgasd6bf",
                name: "placeholeder",
                experience: 0,
                adventurer_img: "./images/pixeltiles_props/adventurer_prop",
                in_quest: false,
                on_chain_ref: "placeholder",
                onRecruitment: true,
                sprites: "./images/pixeltiles_props/adventurer_prop",
                type: "pixeltile",
                metadata: {},
                race: "undefined",
                class: "undefined"
            }

            state.data =  state.data.concat(recruiter)

        },
    },
});

export const { setAdventurers, setAdventuresInQuest, setFreeAdventurers, setExperienceReward, setDeath, setRecruitment  } = adventurers.actions



// combinacion de reducer

export const adventurersGeneralReducer = combineReducers({
    data: adventurers.reducer,
    getAdventurersStatus: fetchGetAdventurersStatus.reducer
})