import { createSlice } from '@reduxjs/toolkit';

interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
}

const initialState: PlayerState = {
  isPlaying: false,
  currentTime: 0,
};

const playerBarSlice = createSlice({
  name: 'playerBar',
  initialState,
  reducers: {
    togglePlay: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    incrementTime: (state) => {
      state.currentTime += 0.1; // Increment time by 0.1 seconds
    },
    resetTime: (state) => {
      state.currentTime = 0;
    },
  },
});

export const { togglePlay, incrementTime, resetTime } = playerBarSlice.actions;
export default playerBarSlice.reducer;
