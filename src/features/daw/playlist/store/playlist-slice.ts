import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { Track } from '../../../../model/track/track'
import { Bar } from '../../../../model/bar/bar'
import { TrackColor } from '../../../../model/track/track-color' // Import TrackColor

export interface PlaylistSlice {
  tracks: Track[]
  selectedTrackId: string | null
  selectedBarId: string | null
  flatboardScroll: number
  toCopyBar: Bar | null
}

const initialState: PlaylistSlice = {
  tracks: [
    {
      id: '1',
      title: 'Reactor 1',
      color: 'grey',
      procedurePreset: { 
        id: 'reactor_1', 
        operation: 'REACTOR', 
        name: 'Reactor 1', 
        color: 'grey', 
        category: 'chemical' 
      },
      bars: [],  // Will now hold sub-procedures as bars
      muted: false,
      soloed: false,
      areThereAnyOtherTrackSoloed: false,
      volume: 100,
    },
    {
      id: '2',
      title: 'Reactor 2',
      color: 'grey',
      procedurePreset: { 
        id: 'reactor_2', 
        operation: 'REACTOR', 
        name: 'Reactor 2', 
        color: 'grey', 
        category: 'chemical' 
      },
      bars: [],  // Will now hold sub-procedures as bars
      muted: false,
      soloed: false,
      areThereAnyOtherTrackSoloed: false,
      volume: 100,
    },
    {
      id: '3',
      title: 'Reactor 3',
      color: 'grey',
      procedurePreset: { 
        id: 'reactor_3', 
        operation: 'REACTOR', 
        name: 'Reactor 3', 
        color: 'grey', 
        category: 'chemical' 
      },
      bars: [],  // Will now hold sub-procedures as bars
      muted: false,
      soloed: false,
      areThereAnyOtherTrackSoloed: false,
      volume: 100,
    },
  ],
  selectedTrackId: null,
  selectedBarId: null,
  flatboardScroll: 0,
  toCopyBar: null,
}

export const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    // Adds a sub-procedure (as a bar) to an existing reactor track
    addSubProcedure: (state, action: PayloadAction<{ trackId: string; subProcedure: Bar }>) => {
      const { trackId, subProcedure } = action.payload
      const track = state.tracks.find((t) => t.id === trackId)
      if (track) {
        track.bars.push(subProcedure)  // Add the sub-procedure to the track's bars
      }
    },

    removeTrack: (state, action: PayloadAction<string>) => {
      state.tracks = state.tracks.filter((track) => track.id !== action.payload)
    },

    selectTrack: (state, action: PayloadAction<Track>) => {
      state.selectedTrackId = action.payload.id
    },

    selectBar: (state, action: PayloadAction<{ trackId: string; barId: string }>) => {
      state.selectedBarId = action.payload.barId
      state.selectedTrackId = action.payload.trackId
    },

    moveBar: (state, action: PayloadAction<{ barId: string; fromTrackId: string; toTrackId: string; newStartAtTick: number }>) => {
      const fromTrack = state.tracks.find((t) => t.id === action.payload.fromTrackId)
      const toTrack = state.tracks.find((t) => t.id === action.payload.toTrackId)
      if (fromTrack && toTrack) {
        const barToMove = fromTrack.bars.find((bar) => bar.id === action.payload.barId)
        if (barToMove) {
          // Remove the bar from the original track
          fromTrack.bars = fromTrack.bars.filter((bar) => bar.id !== action.payload.barId)
          // Update the bar's start tick and push it into the new track
          barToMove.startAtTick = action.payload.newStartAtTick
          toTrack.bars.push(barToMove)
        }
      }
    },

    removeBar: (state, action: PayloadAction<{ trackId: string; barId: string }>) => {
      const track = state.tracks.find((t) => t.id === action.payload.trackId)
      if (track) {
        track.bars = track.bars.filter((bar) => bar.id !== action.payload.barId)
      }
    },

    renameBar: (state, action: PayloadAction<{ trackId: string; barId: string; newTitle: string }>) => {
      const track = state.tracks.find((t) => t.id === action.payload.trackId)
      if (track) {
        const bar = track.bars.find((bar) => bar.id === action.payload.barId)
        if (bar) {
          bar.title = action.payload.newTitle
        }
      }
    },

    setToCopyBar: (state, action: PayloadAction<Bar>) => {
      state.toCopyBar = action.payload
    },

    resizeBar: (state, action: PayloadAction<{ trackId: string; barId: string; newDurationTicks: number }>) => {
      const track = state.tracks.find((t) => t.id === action.payload.trackId)
      if (track) {
        const bar = track.bars.find((bar) => bar.id === action.payload.barId)
        if (bar) {
          bar.durationTicks = action.payload.newDurationTicks
        }
      }
    },

    setTrackColor: (state, action: PayloadAction<{ trackId: string; color: TrackColor }>) => {
      const track = state.tracks.find((t) => t.id === action.payload.trackId)
      if (track) {
        track.color = action.payload.color
      }
    },

    setFlatboardScroll: (state, action: PayloadAction<number>) => {
      state.flatboardScroll = action.payload
    },
  },
})

export const { addSubProcedure, removeTrack, selectTrack, removeBar, renameBar, setToCopyBar, resizeBar, moveBar, selectBar, setTrackColor, setFlatboardScroll } = playlistSlice.actions
export default playlistSlice.reducer
