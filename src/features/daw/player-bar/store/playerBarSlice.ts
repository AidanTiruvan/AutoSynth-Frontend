import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { DEFAULT_BPM } from '../constants/player-bar-constants' // Removed DEFAULT_VOLUME

export interface PlayerState {
  isPlaying: boolean
  bpm: number
  time: number
  // Removed volume
}

const initialState: PlayerState = {
  isPlaying: false,
  bpm: DEFAULT_BPM,
  time: 0,
  // Removed volume from initialState
}

export const playerBarSlice = createSlice({
  name: 'playerBar',
  initialState,
  reducers: {
    togglePlay: (state) => {
      state.isPlaying = !state.isPlaying
    },
    stop: (state) => {
      state.isPlaying = false
    },
    setBpm: (state, action: PayloadAction<number>) => {
      state.bpm = action.payload
    },
    setTime(state, action: PayloadAction<number>) {
      state.time = action.payload
    },
    // Removed setVolume reducer
  },
})

export const {
  togglePlay,
  setTime,
  stop,
  setBpm,
} = playerBarSlice.actions // Removed setVolume action

export default playerBarSlice.reducer
