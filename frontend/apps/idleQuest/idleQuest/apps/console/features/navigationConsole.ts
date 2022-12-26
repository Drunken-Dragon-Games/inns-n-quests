import { createSlice, PayloadAction } from '@reduxjs/toolkit'; 
  
interface initialStateNavigationConsole{
    page: "available" | "in_progress"
}

const initialStateNavigationConsole: initialStateNavigationConsole = {page: "available"}

const navigationConsole = createSlice({
    name: "navigationConsole",
    initialState: initialStateNavigationConsole,
    reducers: {
        setPage:  (state, action: PayloadAction<"available" | "in_progress">)=> {
            
            state.page = action.payload
            
        }
    },
});

export const { setPage } = navigationConsole.actions


//combinacion de reducer
export const navigationConsoleReducer = navigationConsole.reducer
  

