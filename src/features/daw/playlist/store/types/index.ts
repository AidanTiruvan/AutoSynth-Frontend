import { TrackColor } from '../../../../../model/track/track-color'

export type SetTrackVolumePayload = {
  trackId: string
  volume: number
}

export type MoveBarPayload = {
  fromTrackId: string
  toTrackId: string
  barId: string
  newStartAtTick: number
}

export type ResizeBarPayload = {
  trackId: string
  barId: string
  newDurationTicks: number
}

export type SetTrackColorPayload = {
  trackId: string
  color: TrackColor
}

export type RenameTrackPayload = {
  trackId: string
  newTitle: string
}

export type TrackBarIdentifier = {
  trackId: string
  barId: string
}
