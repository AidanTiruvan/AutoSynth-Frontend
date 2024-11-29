import { RootState } from '../../../../../store';
import { Track } from '../../../../../model/track/track';
import { Bar } from '../../../../../model/bar/bar';

// Selector to get all tracks
export const selectTracks = (state: RootState): Track[] => state.playlist.tracks;

// Selector to get the currently selected track
export const selectSelectedTrack = (state: RootState): Track | undefined =>
  state.playlist.tracks.find(
    (t) => t.id === state.playlist.selectedTrackId
  );

// Selector to get the currently selected bar (sub-procedure)
export const selectSelectedBar = (state: RootState): Bar | undefined => {
  const selectedTrack = state.playlist.tracks.find(
    (track) => track.id === state.playlist.selectedSubProcedure?.trackId
  );
  return selectedTrack?.bars.find(
    (bar) => bar.id === state.playlist.selectedSubProcedure?.barId
  );
};
