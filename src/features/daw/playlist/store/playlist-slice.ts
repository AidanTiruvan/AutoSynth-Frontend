import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Track } from '../../../../model/track/track';
import { Bar } from '../../../../model/bar/bar';
import { TrackColor } from '../../../../model/track/track-color';

export interface PlaylistSlice {
  tracks: Track[]; // List of all tracks in the playlist
  selectedTrackId: string | null; // ID of the currently selected track
  selectedSubProcedure: { trackId: string; barId: string } | null; // Selected sub-procedure (track + bar IDs)
  flatboardScroll: number; // Scroll position of the flatboard
  toCopyBar: Bar | null; // Bar to copy during drag-and-drop
}

// Initial playlist state
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
        category: 'chemical',
      },
      bars: [], // Sub-procedures associated with this track
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
        category: 'chemical',
      },
      bars: [],
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
        category: 'chemical',
      },
      bars: [],
      muted: false,
      soloed: false,
      areThereAnyOtherTrackSoloed: false,
      volume: 100,
    },
  ],
  selectedTrackId: null,
  selectedSubProcedure: null,
  flatboardScroll: 0,
  toCopyBar: null,
};

export const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    addSubProcedure: (
      state,
      action: PayloadAction<{ trackId: string; subProcedure: Bar }>
    ) => {
      const { trackId, subProcedure } = action.payload;
      const track = state.tracks.find((t) => t.id === trackId);
      if (track) {
        track.bars.push(subProcedure);
      }
    },

    removeTrack: (state, action: PayloadAction<string>) => {
      state.tracks = state.tracks.filter((track) => track.id !== action.payload);
    },

    selectTrack: (state, action: PayloadAction<string>) => {
      console.log('Track selected:', action.payload);
      state.selectedTrackId = action.payload;
    },

    selectSubProcedure: (
      state,
      action: PayloadAction<{ trackId: string; barId: string }>
    ) => {
      console.log('Sub-procedure selected:', action.payload);
      state.selectedSubProcedure = action.payload;
    },

    deselectSubProcedure: (state) => {
      console.log('Sub-procedure deselected.');
      state.selectedSubProcedure = null;
    },

    moveBar: (
      state,
      action: PayloadAction<{
        barId: string;
        fromTrackId: string;
        toTrackId: string;
        newStartAtTick: number;
      }>
    ) => {
      const { barId, fromTrackId, toTrackId, newStartAtTick } = action.payload;
      const fromTrack = state.tracks.find((t) => t.id === fromTrackId);
      const toTrack = state.tracks.find((t) => t.id === toTrackId);

      if (fromTrack && toTrack) {
        const barToMove = fromTrack.bars.find((bar) => bar.id === barId);
        if (barToMove) {
          fromTrack.bars = fromTrack.bars.filter((bar) => bar.id !== barId);
          barToMove.startAtTick = newStartAtTick;
          toTrack.bars.push(barToMove);
        }
      }
    },

    removeBar: (
      state,
      action: PayloadAction<{ trackId: string; barId: string }>
    ) => {
      const track = state.tracks.find((t) => t.id === action.payload.trackId);
      if (track) {
        track.bars = track.bars.filter((bar) => bar.id !== action.payload.barId);
      }
    },

    renameBar: (
      state,
      action: PayloadAction<{ trackId: string; barId: string; newTitle: string }>
    ) => {
      const track = state.tracks.find((t) => t.id === action.payload.trackId);
      if (track) {
        const bar = track.bars.find((bar) => bar.id === action.payload.barId);
        if (bar) {
          bar.title = action.payload.newTitle;
        }
      }
    },

    resizeBar: (
      state,
      action: PayloadAction<{ trackId: string; barId: string; newDurationTicks: number }>
    ) => {
      const track = state.tracks.find((t) => t.id === action.payload.trackId);
      if (track) {
        const bar = track.bars.find((bar) => bar.id === action.payload.barId);
        if (bar) {
          bar.durationTicks = action.payload.newDurationTicks;
        }
      }
    },

    setTrackColor: (
      state,
      action: PayloadAction<{ trackId: string; color: TrackColor }>
    ) => {
      const track = state.tracks.find((t) => t.id === action.payload.trackId);
      if (track) {
        track.color = action.payload.color;
      }
    },

    setFlatboardScroll: (state, action: PayloadAction<number>) => {
      state.flatboardScroll = action.payload;
    },
  },
});

export const {
  addSubProcedure,
  removeTrack,
  selectTrack,
  selectSubProcedure,
  deselectSubProcedure,
  removeBar,
  renameBar,
  resizeBar,
  moveBar,
  setTrackColor,
  setFlatboardScroll,
} = playlistSlice.actions;

export default playlistSlice.reducer;
