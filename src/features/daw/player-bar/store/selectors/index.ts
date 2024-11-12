import { RootState } from '../../../../../store';

export const selectIsPlaying = (state: RootState) => state.playerBar.isPlaying;
export const selectTime = (state: RootState) => state.playerBar.currentTime;
