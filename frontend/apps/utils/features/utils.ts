import { createSlice, PayloadAction, Action } from '@reduxjs/toolkit'
import { AxiosError } from 'axios';

export const createSliceStatus = (name: string) =>{

     interface CounterState {
        status: 'idle' | 'pending' | 'fulfilled' | 'rejected'
        error: null | AxiosError | string | string []
      }
      
      const initialState: CounterState = {
        status: 'idle',
        error: null
      };


    const newSliceStatus = createSlice({
        name: `${name}/status`,
        initialState,
        
        reducers: {
        
        idle: (state) => {
            state.status = "idle"
        },

        pending: (state) => {
            state.status = "pending"
        },

        fulfilled: (state) => {
            state.status = "fulfilled"
        },
        rejected: (state, action: PayloadAction<string>) => {
            state.status = "rejected"
            state.error = action.payload
        },
        },
    });


    return  newSliceStatus
}


interface actions{
    idle: Action
    pending: Action
    fulfilled: Action
    rejected: Action
}

export const actionsGenerator = (actions: any) =>  [actions.idle, actions.pending, actions.fulfilled, actions.rejected]





  