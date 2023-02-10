import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { GeneralReducerRootState, GeneralReducerDispatch } from './generalReducer';

export const useGeneralDispatch = () => useDispatch<GeneralReducerDispatch>();
export const useGeneralSelector: TypedUseSelectorHook<GeneralReducerRootState> = useSelector;