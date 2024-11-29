import { useDispatch, useSelector } from 'react-redux';
import { selectMaxBars } from '../../../playlist-header/store/selectors';
import { Track } from '../../../../../model/track/track';
import { Bar } from '../../../../../model/bar/bar';
import { TrackBar } from './track-bar/track-bar';
import { requestNewTickPosition } from '../../../playlist-header/store/playlist-header-slice';
import { selectTrack } from '../../store/playlist-slice';
import { MixGrid } from '../../../common/components/mix-grid/mix-grid';
import { TRACK_HEIGHT } from '../../constants';
import { useEffect, useRef, useState } from 'react';
import { AddTrackMenu } from '../../../playlist-header/playlist-commands/add-track-menu/add-track-menu';

export const TrackBoard = ({
  track,
  selectedTrack,
}: {
  track: Track;
  selectedTrack?: Track;
}) => {
  const maxBars = useSelector(selectMaxBars);
  const dispatch = useDispatch();
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const menuRef = useRef<HTMLDivElement | null>(null);
  const trackBoardRef = useRef<HTMLDivElement | null>(null);

  const handleSelectTick = (tick: number) => {
    dispatch(requestNewTickPosition(tick));
    dispatch(selectTrack(track.id));
  };

  const handleShowAddMenu = (e: React.MouseEvent) => {
    if (trackBoardRef.current) {
      const rect = trackBoardRef.current.getBoundingClientRect();
      setMenuPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
    setShowAddMenu(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowAddMenu(false);
      }
    };

    if (showAddMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAddMenu]);

  const lastEndTick = track.bars.length
    ? Math.max(...track.bars.map((bar) => bar.startAtTick + bar.durationTicks))
    : 0;

  return (
    <div
      ref={trackBoardRef}
      className={`relative ${
        selectedTrack?.id === track.id ? 'bg-highlight' : ''
      }`}
      onDragOver={(e) => e.preventDefault()}
      onDoubleClick={handleShowAddMenu}
    >
      <div className="flex flex-row" style={{ height: `${TRACK_HEIGHT}px` }}>
        <MixGrid
          maxBars={maxBars}
          onSelectTick={handleSelectTick}
          onCreateBar={() => {
            /* Add logic here for creating a bar */
          }}
          onPasteBar={() => {
            /* Add logic here for pasting a bar */
          }}
          evenColumnsColor={'bg-gray-500'}
          oddColumnsColor={'bg-gray-400'}
        />

        {track.bars.map((bar: Bar) => (
          <TrackBar
            key={bar.id}
            bar={bar}
            track={track} // Pass the track to the TrackBar
            onBarDetails={() => {
              /* Add logic for handling bar details */
            }}
          />
        ))}

        {showAddMenu && (
          <div
            ref={menuRef}
            style={{
              position: 'absolute',
              left: `${menuPosition.x}px`,
              top: `${menuPosition.y}px`,
              transform: 'translate(0, 0)',
            }}
          >
            <AddTrackMenu
              onClose={() => setShowAddMenu(false)}
              trackId={track.id}
              lastEndTick={lastEndTick}
            />
          </div>
        )}
      </div>
    </div>
  );
};
