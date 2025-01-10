export type Bar = {
  id: string;
  title: string;
  startAtTick: number;
  durationTicks: number;
  color?: string;

  // New optional properties:
  chemical?: string;
  volume?: number;
  dripTime?: number;
  destinationVial?: string;
};
