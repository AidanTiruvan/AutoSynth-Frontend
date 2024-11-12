import * as Tone from 'tone';
import { RootStore } from '../../../store';
import { TimeUtils } from '../utils/time-utils';
import { setCurrentTickFromSequencer } from '../../../features/daw/playlist-header/store/playlist-header-slice';
import { resetTime } from '../../../features/daw/player-bar/store/playerBarSlice';
import { observeStore } from '../../../store/observers';
import { selectRequestedNewTickPosition } from '../../../features/daw/playlist-header/store/selectors';

export class Clock {
  currentTick: number;
  private _store: RootStore;

  constructor(store: RootStore) {
    this._store = store;
    this.currentTick = 0;

    Tone.Transport.scheduleRepeat(() => {
      this.handleTick();
    }, '16n');

    this.registerStoreListeners();
  }

  requestNewTickPosition(newTick: number | null) {
    if (newTick === null) return;

    Tone.Transport.position = TimeUtils.tickToToneTime(newTick);
    this.getTickAndTimeFromToneTransport();

    if (Tone.Transport.state !== 'started') {
      this.notifyStore();
    }
  }

  private registerStoreListeners() {
    observeStore(
      this._store,
      selectRequestedNewTickPosition,
      this.requestNewTickPosition.bind(this)
    );
  }

  private handleTick() {
    this.getTickAndTimeFromToneTransport();
    this.notifyStore();
  }

  private getTickAndTimeFromToneTransport() {
    this.currentTick = TimeUtils.toneTimeToTicks(Tone.Transport.position);
  }

  private notifyStore() {
    this._store.dispatch(resetTime());
    this._store.dispatch(setCurrentTickFromSequencer(this.currentTick));
  }
}
