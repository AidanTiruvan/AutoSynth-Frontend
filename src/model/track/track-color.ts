export const TRACK_COLORS = [
  'blue',
  'green',
  'red',
  'yellow',
  'pink',
  'cyan',
  'purple',
  'orange',
  'grey',
] as const;

export type TrackColor = (typeof TRACK_COLORS)[number];
