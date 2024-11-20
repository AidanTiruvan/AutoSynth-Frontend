import { Track } from '../../../../../model/track/track';
import { TRACK_HEIGHT } from '../../constants';
import { useState } from 'react';
import { TrackPopupMenu } from '../track-popup-menu/track-popup-menu';
import { IoMdSettings } from 'react-icons/io';
import { TrackItemSoloMuted } from './track-item-solo-mute/track-item-solo-muted';
import { TrackItemNameVolume } from './track-item-name-volume/track-item-name-volume';

export type TrackItemProps = {
  track: Track;
  selectedTrack?: Track | null;
  onSelectTrack: (track: Track) => void;
};

export const TrackItem = ({
  track,
  selectedTrack,
  onSelectTrack,
}: TrackItemProps) => {
  const isSelected = selectedTrack?.id === track.id;

  const [showTrackMenu, setShowTrackMenu] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);

  const effectivelyMuted =
    track.muted || (track.areThereAnyOtherTrackSoloed && !track.soloed);

  const selectedHighlightColor = effectivelyMuted
    ? 'bg-gray-800 dark:bg-gray-500'
    : `bg-${track.color}-500`;

  return (
    <div
      className={`flex flex-row justify-between w-full ${
        isSelected
          ? 'bg-zinc-300 dark:bg-zinc-800'
          : 'bg-zinc-100 dark:bg-zinc-900'
      }`}
      style={{ height: `${TRACK_HEIGHT}px`, minHeight: `${TRACK_HEIGHT}px` }}
      onDoubleClick={(e) => {
        e.preventDefault();
        onSelectTrack(track); // Select the track on double-click
        if (!showTrackMenu) {
          setShowTrackMenu(true); // Open the popup menu on double-click
        }
      }}
    >
      <TrackItemSoloMuted /> {/* No props passed here anymore */}

      <TrackItemNameVolume
        track={track}
        isRenaming={isRenaming}
        setIsRenaming={setIsRenaming}
      />

      <div className="relative h-full w-8">
        <div
          className="mt-4 cursor-pointer self-center"
          onClick={() => {
            if (!showTrackMenu) {
              setShowTrackMenu(true);
            }
          }}
        >
          <IoMdSettings />
        </div>
        {showTrackMenu && (
          <div className="fixed mt-2 z-50 h-fit w-fit">
            <TrackPopupMenu
              track={track}
              onClose={() => setShowTrackMenu(false)}
              onRename={() => {
                setShowTrackMenu(false);
                setIsRenaming(true);
              }}
            />
          </div>
        )}
      </div>

      <div className={`h-full w-1 ${isSelected && selectedHighlightColor}`} />
    </div>
  );
};
