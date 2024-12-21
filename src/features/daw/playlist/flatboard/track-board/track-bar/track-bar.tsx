import { Bar } from '../../../../../../model/bar/bar';
import { Track } from '../../../../../../model/track/track';
import { useDispatch } from 'react-redux';
import { TICK_WIDTH_PIXEL } from '../../../constants';
import { selectSubProcedure } from '../../../store/playlist-slice';

// Utility function to darken a color
const darkenColor = (color: string, amount: number) => {
  const colorValue = color.startsWith('#') ? color.slice(1) : color;
  const num = parseInt(colorValue, 16);
  const r = Math.max((num >> 16) - amount, 0);
  const g = Math.max(((num >> 8) & 0x00ff) - amount, 0);
  const b = Math.max((num & 0x0000ff) - amount, 0);
  return `rgb(${r}, ${g}, ${b})`;
};

export const TrackBar = ({
  bar,
  track,
  onMoveLeft,
  onMoveRight,
  onBarDetails,
}: {
  bar: Bar;
  track: Track;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onBarDetails: () => void;
}) => {
  const dispatch = useDispatch();
  const buttonColor = bar.color ? darkenColor(bar.color, 50) : 'grey';

  const handleSelectBar = () => {
    dispatch(selectSubProcedure({ trackId: track.id, barId: bar.id, title: bar.title }));
  };

  return (
    <div
      key={bar.id}
      className="absolute rounded-md cursor-pointer"
      style={{
        left: `${bar.startAtTick * TICK_WIDTH_PIXEL}px`,
        width: `${bar.durationTicks * TICK_WIDTH_PIXEL}px`,
        height: '100%',
        backgroundColor: bar.color || 'grey',
      }}
      onClick={handleSelectBar}
      onDoubleClick={onBarDetails}
    >
      <div className="flex items-center justify-center h-full text-white font-bold">
        {bar.title}
      </div>
      <div className="absolute top-0 right-0 flex gap-1">
        <button
          className="text-white px-1 py-0.5 rounded text-sm"
          style={{ backgroundColor: buttonColor }}
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the parent onClick
            onMoveLeft();
          }}
        >
          ←
        </button>
        <button
          className="text-white px-1 py-0.5 rounded text-sm"
          style={{ backgroundColor: buttonColor }}
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the parent onClick
            onMoveRight();
          }}
        >
          →
        </button>
      </div>
    </div>
  );
};
