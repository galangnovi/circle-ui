import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './features/profile/profileSlice';
import likesReducer from "./features/likes/likesSlice"

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    likes: likesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;