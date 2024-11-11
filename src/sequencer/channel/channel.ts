import { Bar } from '../../model/bar/bar';
import { Track } from '../../model/track/track';
import * as Tone from 'tone';
import { TimeUtils } from '../time/utils/time-utils';

export class Channel {
  trackId: string;

  private _parts: Tone.Part<any>[] = [];
  private _previewLoopPart: Tone.Part<any> | null = null;
  private _muted: boolean;

  private _otherTrackIsPreviewing: boolean = false;
  private _isPreviewingLoop: boolean = false;

  constructor(track: Track) {
    this.trackId = track.id;
    this._muted = false;
    this.updateFromTrack(track);
  }

  updateFromTrack(track: Track) {
    if (!this.hasChanged(track)) {
      return;
    }
    this.clear();
    this.setMuted(
      track.muted || (track.areThereAnyOtherTrackSoloed && !track.soloed)
    );
    this.generatePartsFromBars(track.bars);
  }

  setMuted(muted: boolean) {
    this._muted = muted;
  }

  setOtherTrackIsPreviewing(otherTrackIsPreviewing: boolean) {
    this._otherTrackIsPreviewing = otherTrackIsPreviewing;
  }

  clear() {
    this._parts.forEach((part) => part.dispose());
    this._parts = [];
  }

  generatePartsFromBars(trackBars: Readonly<Bar[]>) {
    this._parts = trackBars.map((bar) => this.partFromBar(bar));
  }

  // Adjusted the types here to resolve callback issues
  partFromBar(bar: Bar, isPreviewLoopBar: boolean = false): Tone.Part<any> {
    const part = new Tone.Part<any>(
      (_time: any, _value: any) => {  // Suppress time and value types for now
        if (!this._canPlayPart(isPreviewLoopBar)) return;
        // Logic to handle sequences will be integrated here
      },
      [] // Empty sequence since we're removing note-related logic
    );
    part.start(TimeUtils.tickToToneTime(bar.startAtTick));
    return part;
  }

  _canPlayPart(isPreviewLoop: boolean) {
    if (isPreviewLoop) {
      return this._isPreviewingLoop;
    } else {
      return !this._muted && !this._otherTrackIsPreviewing;
    }
  }

  setPreviewLoopBar(loopBar: Bar) {
    if (this._previewLoopPart) {
      this._previewLoopPart.dispose();
    }
    this._previewLoopPart = this.partFromBar(loopBar, true);
  }

  stopPreviewLoop() {
    this._isPreviewingLoop = false;
  }

  startPreviewLoop() {
    this._isPreviewingLoop = true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hasChanged(_newTrack: Track) {
    // TODO compare new track with the current settings (maybe using a hash of the track?)
    return true;
  }
}
