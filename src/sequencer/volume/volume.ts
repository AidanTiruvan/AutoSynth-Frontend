import * as Tone from 'tone'

export class Volume {
  constructor() {
    // The constructor is now empty since we're not using _store anymore.
  }

  // You can still keep this static method if it’s used elsewhere in the project.
  static transformVolumeToToneVolume(volume: number) {
    return Tone.gainToDb(volume / 100)
  }
}
