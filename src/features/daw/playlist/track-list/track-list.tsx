import { TrackItem } from './track-item/track-item';
import { useDispatch, useSelector } from 'react-redux';
import { selectSelectedTrack, selectTracks } from '../store/selectors';
import { selectTrack } from '../store/playlist-slice';
import { Track } from '../../../../model/track/track'; // Ensure Track type is imported

export const TrackList = () => {
  const tracks: Track[] = useSelector(selectTracks); // Explicitly type tracks as Track[]
  const selectedTrack = useSelector(selectSelectedTrack);
  const dispatch = useDispatch();

  const handleSelectTrack = (trackId: string) => {
    dispatch(selectTrack(trackId)); // Pass track ID to the Redux action
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      {tracks.map((track) => (
        <TrackItem
          key={track.id}
          track={track}
          selectedTrack={selectedTrack}
          onSelectTrack={() => handleSelectTrack(track.id)} // Pass track ID
        />
      ))}
    </div>
  );
};
