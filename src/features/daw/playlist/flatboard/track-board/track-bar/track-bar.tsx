import { Bar } from '../../../../../../model/bar/bar';
import { Track } from '../../../../../../model/track/track';
import { useDispatch } from 'react-redux';
import { TICK_WIDTH_PIXEL } from '../../../constants';
import { selectSubProcedure } from '../../../store/playlist-slice';

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
          className="bg-blue-500 text-white px-1 py-0.5 rounded text-sm"
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the parent onClick
            onMoveLeft();
          }}
        >
          ←
        </button>
        <button
          className="bg-green-500 text-white px-1 py-0.5 rounded text-sm"
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
