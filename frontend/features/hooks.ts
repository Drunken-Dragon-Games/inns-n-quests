import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { generalReducerRootState, generalReducerDispatch } from './generalReducer';

export const useGeneralDispatch = () => useDispatch<generalReducerDispatch>();
export const useGeneralSelector: TypedUseSelectorHook<generalReducerRootState> = useSelector;