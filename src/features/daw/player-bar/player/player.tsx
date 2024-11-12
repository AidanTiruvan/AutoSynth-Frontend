import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { togglePlay, incrementTime } from '../store/playerBarSlice';
import { selectIsPlaying, selectTime } from '../store/selectors';
import { FaPlay, FaPause } from 'react-icons/fa';

export const Player = () => {
  const dispatch = useDispatch();
  const isPlaying = useSelector(selectIsPlaying);
  const currentTime = useSelector(selectTime);

  const minutes = Math.floor(currentTime / 60);
  const seconds = Math.floor(currentTime % 60);
  const milliseconds = Math.floor((currentTime * 100) % 100);
  const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(2, '0')}`;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null; // Adjusted type here
    if (isPlaying) {
      interval = setInterval(() => {
        dispatch(incrementTime());
      }, 100); // Update every 100ms
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, dispatch]);

  return (
    <div className="flex flex-row gap-1 items-center justify-center">
      <button onClick={() => dispatch(togglePlay())}>
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>
      <span className="select-none font-bold text-lg">{timeString}</span>
    </div>
  );
};
