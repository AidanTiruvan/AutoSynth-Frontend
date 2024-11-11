import { useDispatch, useSelector } from 'react-redux';
import { selectIsPlaying } from '../store/selectors';
import { togglePlay } from '../store/playerBarSlice'; // No need for stop anymore
import { FaPlay, FaPause } from 'react-icons/fa'; // Only Play and Pause icons
import { usePreviewLoopSafeTransportPosition } from '../../common/hooks/use-preview-loop-safe-transport-position';

export const Player = () => {
  const { time } = usePreviewLoopSafeTransportPosition();

  const isPlaying = useSelector(selectIsPlaying);
  const dispatch = useDispatch();

  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time - minutes * 60);
  const milliseconds = Math.floor((time - seconds) * 10);
  const padTimePart = (timePart: number) => {
    return String(timePart).padStart(2, '0');
  };

  const timeString = `${padTimePart(minutes)}:${padTimePart(
    seconds
  )}:${milliseconds}`;

  return (
    <div className="flex flex-row gap-1 items-center justify-center">
      {/* Toggle between Play and Pause buttons */}
      {isPlaying ? (
        <button onClick={() => dispatch(togglePlay())}>
          <FaPause />
        </button>
      ) : (
        <button onClick={() => dispatch(togglePlay())}>
          <FaPlay />
        </button>
      )}

      {/* Time Tracker */}
      <span className="select-none font-bold text-lg">{timeString}</span>
    </div>
  );
};
