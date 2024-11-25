import { Bar } from '../../../../../../model/bar/bar'
import { Track } from '../../../../../../model/track/track' // Keep Track for now until we transition to Reactor

export interface TrackBarProps {
  track: Track;
  bar: Bar;
  onSelectBar: () => void;
  onBarDetails: () => void;
}

