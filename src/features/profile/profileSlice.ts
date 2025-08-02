import { createSlice} from '@reduxjs/toolkit';
import type {  PayloadAction } from '@reduxjs/toolkit';

interface ProfileState {
  id: number | null;
  username: string;
  full_name: string;
  email: string;
  photo_profile: string;
  cover_photo: string | null;
  bio: string;
  followingCount: number,
  followerCount:number
}

const initialState: ProfileState = {
  id: null,
  username: '',
  full_name: '',
  email: '',
  photo_profile: '',
  cover_photo: null,
  bio: '',
  followingCount: 0,
  followerCount: 0
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<ProfileState>) {
      return { ...state, ...action.payload };
    },
    clearProfile() {
      return initialState;
    },
  },
});

export const { setProfile, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;