import { RootStore } from '../store'
import { observeStore } from '../store/observers'
import { selectTracks } from '../features/daw/playlist/store/selectors'
import { selectIsPlaying } from '../features/daw/player-bar/store/selectors'
import { Track } from '../model/track/track'
import { Channel } from './channel/channel'
import { Volume } from './volume/volume' // Import the updated Volume class
import * as Tone from 'tone' // Import Tone.js here

export default class Sequencer {
  private _store: RootStore
  private _channelsByTrackID: Map<string, Channel> = new Map()

  constructor(store: RootStore) {
    this._store = store
    new Volume() // No need to pass this._store anymore

    this.registerStoreListeners()
  }

  registerStoreListeners() {
    observeStore(this._store, selectIsPlaying, async (newState) => {
      if (newState) {
        await this.startProcedures()
      } else {
        this.pause()
      }
    })

    observeStore(this._store, selectTracks, (newState, oldState) => {
      if (oldState === newState) return
      this.generateProcedures(newState)
    })
  }

  async startProcedures() {
    await Tone.start() // Use Tone.js here
    Tone.Transport.start() // Start Tone.js transport for audio playback
  }

  generateProcedures(newTracks: Readonly<Track[]>) {
    newTracks.forEach((track) => {
      if (this._channelsByTrackID.has(track.id)) {
        this._channelsByTrackID.get(track.id)?.updateFromTrack(track)
      } else {
        const channel = new Channel(track)
        this._channelsByTrackID.set(track.id, channel)
      }
    })
  }

  stop() {
    Tone.getTransport().stop(); // Updated to use getTransport()
  }

  pause() {
    Tone.getTransport().pause(); // Updated to use getTransport()
  }
}
