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

// ---------------------------------
// Chemical Configuration
// ---------------------------------
// We'll keep the same baseTime = 30 seconds for each chemical,
// but now 30 seconds = 32 ticks.
const CHEMICAL_CONFIG: Record<
  string,
  { baseTime: number; additionalTimePer10: number; density: number }
> = {
  Water: { density: 1.0, baseTime: 30, additionalTimePer10: 10 },
  Ethanol: { density: 0.789, baseTime: 30, additionalTimePer10: 8 },
  Acetone: { density: 0.791, baseTime: 30, additionalTimePer10: 8 },
  SodiumChloride: { density: 2.17, baseTime: 30, additionalTimePer10: 15 },
  GlucoseSolution: { density: 1.2, baseTime: 30, additionalTimePer10: 12 },
  SulfuricAcid: { density: 1.84, baseTime: 30, additionalTimePer10: 20 },
  HydrogenPeroxide: { density: 1.1, baseTime: 30, additionalTimePer10: 12 },
  Glycerol: { density: 1.26, baseTime: 30, additionalTimePer10: 18 },
  Methanol: { density: 0.791, baseTime: 30, additionalTimePer10: 8 },
  Chloroform: { density: 1.49, baseTime: 30, additionalTimePer10: 18 },
};

// ---------------------------------
// Helper Constants & Functions
// ---------------------------------

// If 30 seconds = 32 ticks, then 1 tick = 0.9375 seconds
const SECONDS_PER_TICK = 30 / 32; // 0.9375
// We'll also define a min of 32 ticks (i.e., 30 seconds).
const MIN_TICKS = 32;

/**
 * Calculates total time in seconds based on the chemical config:
 * time = baseTime + (volume / 10) * additionalTimePer10
 */
function calculateDispenseTimeSeconds(chemical: string, volume: number): number {
  const config = CHEMICAL_CONFIG[chemical];
  if (!config) {
    // If chemical is unknown, default to 30 seconds
    return 30;
  }
  const { baseTime, additionalTimePer10 } = config;
  return baseTime + (volume / 10) * additionalTimePer10;
}

// ---------------------------------
// Slice Definition
// ---------------------------------
export const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    // ---------------------------------
    // Add a new sub-procedure
    // ---------------------------------
    addSubProcedure: (
      state,
      action: PayloadAction<{ trackId: string; subProcedure: Bar }>
    ) => {
      const { trackId, subProcedure } = action.payload;

      // If no duration is specified, default to 32 ticks (30 seconds).
      const updatedSubProcedure: Bar = {
        ...subProcedure,
        durationTicks: subProcedure.durationTicks ?? MIN_TICKS,
      };

      state.tracks = state.tracks.map((track) =>
        track.id === trackId
          ? { ...track, bars: [...track.bars, updatedSubProcedure] }
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
          const updatedFromBars = fromTrack.bars.filter((b) => b.id !== barId);
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
              bars: track.bars.filter((bar) => bar.id !== action.payload.barId),
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
      action: PayloadAction<{
        trackId: string;
        barId: string;
        newDurationTicks: number;
      }>
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

        const barIndex = track.bars.findIndex(
          (bar) => bar.id === action.payload.barId
        );
        if (barIndex > -1) {
          const currentBar = track.bars[barIndex];
          const targetStartAtTick = currentBar.startAtTick - 4; // Move left 4 ticks
          // Check if no overlap
          const isSpaceEmpty = !track.bars.some(
            (b) =>
              b.id !== currentBar.id &&
              b.startAtTick < targetStartAtTick + currentBar.durationTicks &&
              b.startAtTick + b.durationTicks > targetStartAtTick
          );

          if (isSpaceEmpty && targetStartAtTick >= 0) {
            const updatedBars = [...track.bars];
            updatedBars[barIndex] = {
              ...currentBar,
              startAtTick: targetStartAtTick,
            };
            return { ...track, bars: updatedBars };
          }
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

          // Swap startAtTick
          const tempTick = updatedBars[index + 1].startAtTick;
          updatedBars[index + 1].startAtTick = updatedBars[index].startAtTick;
          updatedBars[index].startAtTick = tempTick;

          return { ...track, bars: updatedBars };
        }
        return track;
      });
    },

    // ---------------------------------
    // NEW ACTION: Update Dispense Params
    // ---------------------------------
    updateDispenseParams: (
      state,
      action: PayloadAction<{
        trackId: string;
        barId: string;
        chemical: string;
        volume: number;
      }>
    ) => {
      const { trackId, barId, chemical, volume } = action.payload;

      state.tracks = state.tracks.map((track) => {
        if (track.id !== trackId) return track;

        const updatedBars = track.bars.map((bar) => {
          if (bar.id !== barId) return bar;

          // 1) Ensure volume is non-negative
          const safeVolume = volume < 0 ? 0 : volume;

          // 2) time in seconds
          const totalTimeSec = calculateDispenseTimeSeconds(chemical, safeVolume);
          // 3) convert to ticks with 1 tick = 0.9375s
          let newDurationTicks = totalTimeSec / SECONDS_PER_TICK;

          // 4) never go below 32 ticks (30s)
          if (newDurationTicks < MIN_TICKS) {
            newDurationTicks = MIN_TICKS;
          }

          return {
            ...bar,
            chemical,
            volume: safeVolume,
            durationTicks: newDurationTicks,
          };
        });

        return { ...track, bars: updatedBars };
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
  updateDispenseParams,
} = playlistSlice.actions;

export default playlistSlice.reducer;
