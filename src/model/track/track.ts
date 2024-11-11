import { Bar } from '../bar/bar';
import { ProcedurePreset } from '../instrument/preset/preset'; // Correct import path
import { TrackColor } from './track-color';

export interface Track {
  id: string;
  title: string;
  color: TrackColor;
  procedurePreset?: ProcedurePreset;  // Made optional with ?
  bars: Bar[];
  volume: number;
  muted: boolean;
  soloed: boolean;
  areThereAnyOtherTrackSoloed: boolean;
}

export class TrackUtils {
  static isTrackEffectivelyMuted(track: Track) {
    return track.muted || (track.areThereAnyOtherTrackSoloed && !track.soloed);
  }
}
