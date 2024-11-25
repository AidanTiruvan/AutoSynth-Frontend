import { TrackBarProps } from './types';
import { TICK_WIDTH_PIXEL } from '../../../constants'; // Ensure this file exists and exports TICK_WIDTH_PIXEL

export const TrackBar = ({ bar, onSelectBar, onBarDetails }: TrackBarProps) => {
  const barOffsetStyle = `${bar.startAtTick * TICK_WIDTH_PIXEL}px`;
  const barLengthStyle = `${bar.durationTicks * TICK_WIDTH_PIXEL}px`;

  return (
    <div
      key={bar.id}
      className="absolute rounded-md cursor-pointer"
      style={{
        left: barOffsetStyle,
        width: barLengthStyle,
        height: '100%',
        backgroundColor: bar.color || 'grey',
      }}
      onClick={onSelectBar} // Ensure this works without passing arguments
      onDoubleClick={onBarDetails} // Ensure this works without passing arguments
    >
      <div className="flex items-center justify-center h-full text-white font-bold">
        {bar.title}
      </div>
    </div>
  );
};
