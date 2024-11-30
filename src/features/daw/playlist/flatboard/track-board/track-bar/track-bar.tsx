import { Bar } from '../../../../../../model/bar/bar';
import { Track } from '../../../../../../model/track/track';
import { useDispatch } from 'react-redux';
import { TICK_WIDTH_PIXEL } from '../../../constants'; // Ensure this file exists
import { selectSubProcedure } from '../../../store/playlist-slice';

export const TrackBar = ({
  bar,
  track,
  onBarDetails,
}: {
  bar: Bar;
  track: Track;
  onBarDetails: () => void;
}) => {
  const dispatch = useDispatch();

  const handleSelectBar = () => {
    dispatch(selectSubProcedure({ trackId: track.id, barId: bar.id, title: bar.title })); // Now includes the title
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
    </div>
  );
};
