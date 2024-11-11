import { Bar } from '../../../../../../model/bar/bar'
import { Track } from '../../../../../../model/track/track' // Keep Track for now until we transition to Reactor

export type TrackBarProps = {
  track: Track // This will eventually become reactor
  bar: Bar
  onSelectBar: (bar: Bar) => void
  onBarDetails: (bar: Bar) => void
}
