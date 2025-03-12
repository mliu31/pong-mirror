import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// for dispatching an action
export const useAppDispatch: () => AppDispatch = useDispatch;

// for accessing the state in the store
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
