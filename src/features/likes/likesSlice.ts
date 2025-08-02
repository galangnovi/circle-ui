import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface LikesState {
  likedThreadIds: number[];   // Menyimpan ID thread yang disukai user
  likedRepliesIds: number[];  // Menyimpan ID reply yang disukai user
}

const initialState: LikesState = {
  likedThreadIds: [],
  likedRepliesIds: [],
};

const likesSlice = createSlice({
  name: 'likes',
  initialState,
  reducers: {
    // THREADS
    setThreadLikes(state, action: PayloadAction<number[]>) {
      state.likedThreadIds = action.payload;
    },
    addThreadLike(state, action: PayloadAction<number>) {
      if (!state.likedThreadIds.includes(action.payload)) {
        state.likedThreadIds.push(action.payload);
      }
    },
    removeThreadLike(state, action: PayloadAction<number>) {
      state.likedThreadIds = state.likedThreadIds.filter(id => id !== action.payload);
    },
    clearThreadLikes(state) {
      state.likedThreadIds = [];
    },

    // REPLIES
    setReplyLikes(state, action: PayloadAction<number[]>) {
      state.likedRepliesIds = action.payload;
    },
    addReplyLike(state, action: PayloadAction<number>) {
      if (!state.likedRepliesIds.includes(action.payload)) {
        state.likedRepliesIds.push(action.payload);
      }
    },
    removeReplyLike(state, action: PayloadAction<number>) {
      state.likedRepliesIds = state.likedRepliesIds.filter(id => id !== action.payload);
    },
    clearReplyLikes(state) {
      state.likedRepliesIds = [];
    },
  },
});

export const {
  setThreadLikes,
  addThreadLike,
  removeThreadLike,
  clearThreadLikes,
  setReplyLikes,
  addReplyLike,
  removeReplyLike,
  clearReplyLikes,
} = likesSlice.actions;

export default likesSlice.reducer;