import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Track } from '../../../../model/track/track';
import { Bar } from '../../../../model/bar/bar';
import { TrackColor } from '../../../../model/track/track-color';

export interface PlaylistSlice {
  tracks: Track[];
  selectedTrackId: string | null;
  selectedSubProcedure: { trackId: string; barId: string; title: string } | null;
  flatboardScroll: number;
  toCopyBar: Bar | null;
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
        category: 'chemical',
      },
      bars: [],
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
      state.tracks = state.tracks.map((track) =>
        track.id === trackId
          ? { ...track, bars: [...track.bars, subProcedure] }
          : track
      );
    },

    removeTrack: (state, action: PayloadAction<string>) => {
      state.tracks = state.tracks.filter((track) => track.id !== action.payload);
    },

    selectTrack: (state, action: PayloadAction<string>) => {
      state.selectedTrackId = action.payload;
    },

    selectSubProcedure: (
      state,
      action: PayloadAction<{ trackId: string; barId: string; title: string }>
    ) => {
      state.selectedSubProcedure = action.payload;
    },

    deselectSubProcedure: (state) => {
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
          const updatedFromBars = fromTrack.bars.filter(
            (bar) => bar.id !== barId
          );
          const updatedToBars = [
            ...toTrack.bars,
            { ...barToMove, startAtTick: newStartAtTick },
          ];
          state.tracks = state.tracks.map((track) =>
            track.id === fromTrackId
              ? { ...track, bars: updatedFromBars }
              : track.id === toTrackId
              ? { ...track, bars: updatedToBars }
              : track
          );
        }
      }
    },

    removeBar: (
      state,
      action: PayloadAction<{ trackId: string; barId: string }>
    ) => {
      state.tracks = state.tracks.map((track) =>
        track.id === action.payload.trackId
          ? {
              ...track,
              bars: track.bars.filter(
                (bar) => bar.id !== action.payload.barId
              ),
            }
          : track
      );
    },

    renameBar: (
      state,
      action: PayloadAction<{ trackId: string; barId: string; newTitle: string }>
    ) => {
      state.tracks = state.tracks.map((track) =>
        track.id === action.payload.trackId
          ? {
              ...track,
              bars: track.bars.map((bar) =>
                bar.id === action.payload.barId
                  ? { ...bar, title: action.payload.newTitle }
                  : bar
              ),
            }
          : track
      );
    },

    resizeBar: (
      state,
      action: PayloadAction<{ trackId: string; barId: string; newDurationTicks: number }>
    ) => {
      state.tracks = state.tracks.map((track) =>
        track.id === action.payload.trackId
          ? {
              ...track,
              bars: track.bars.map((bar) =>
                bar.id === action.payload.barId
                  ? { ...bar, durationTicks: action.payload.newDurationTicks }
                  : bar
              ),
            }
          : track
      );
    },

    setTrackColor: (
      state,
      action: PayloadAction<{ trackId: string; color: TrackColor }>
    ) => {
      state.tracks = state.tracks.map((track) =>
        track.id === action.payload.trackId
          ? { ...track, color: action.payload.color }
          : track
      );
    },

    setFlatboardScroll: (state, action: PayloadAction<number>) => {
      state.flatboardScroll = action.payload;
    },

    moveBarLeft: (
      state,
      action: PayloadAction<{ trackId: string; barId: string }>
    ) => {
      state.tracks = state.tracks.map((track) => {
        if (track.id !== action.payload.trackId) return track;
        const index = track.bars.findIndex((bar) => bar.id === action.payload.barId);
        if (index > 0) {
          const updatedBars = [...track.bars];
          [updatedBars[index - 1], updatedBars[index]] = [
            updatedBars[index],
            updatedBars[index - 1],
          ];
          // Swap startAtTick values
          const tempTick = updatedBars[index - 1].startAtTick;
          updatedBars[index - 1].startAtTick = updatedBars[index].startAtTick;
          updatedBars[index].startAtTick = tempTick;

          return { ...track, bars: updatedBars };
        }
        return track;
      });
    },

    moveBarRight: (
      state,
      action: PayloadAction<{ trackId: string; barId: string }>
    ) => {
      state.tracks = state.tracks.map((track) => {
        if (track.id !== action.payload.trackId) return track;
        const index = track.bars.findIndex((bar) => bar.id === action.payload.barId);
        if (index < track.bars.length - 1) {
          const updatedBars = [...track.bars];
          [updatedBars[index + 1], updatedBars[index]] = [
            updatedBars[index],
            updatedBars[index + 1],
          ];
          // Swap startAtTick values
          const tempTick = updatedBars[index + 1].startAtTick;
          updatedBars[index + 1].startAtTick = updatedBars[index].startAtTick;
          updatedBars[index].startAtTick = tempTick;

          return { ...track, bars: updatedBars };
        }
        return track;
      });
    },
  },
});

export const {
  addSubProcedure,
  removeTrack,
  selectTrack,
  selectSubProcedure,
  deselectSubProcedure,
  moveBarLeft,
  moveBarRight,
  removeBar,
  renameBar,
  resizeBar,
  moveBar,
  setTrackColor,
  setFlatboardScroll,
} = playlistSlice.actions;

export default playlistSlice.reducer;
