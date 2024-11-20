import { useSelector } from 'react-redux';
import { selectSelectedTrack } from '../../playlist/store/selectors';
import { AddTrackMenu } from './add-track-menu/add-track-menu';
import { useState } from 'react';

export const PlaylistCommands = () => {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const selectedTrack = useSelector(selectSelectedTrack);

  // Calculate lastEndTick based on the selected track's bars (sub-procedures)
  const lastEndTick = selectedTrack?.bars?.length
    ? Math.max(...selectedTrack.bars.map((bar) => bar.startAtTick + bar.durationTicks))
    : 0;

  // Reactors should open the AddTrackMenu when clicked, no button needed
  return (
    <div className="relative h-full w-full">
      {showAddMenu && selectedTrack && (
        <div className="fixed mt-2 z-50 h-fit w-fit">
          <AddTrackMenu
            onClose={() => setShowAddMenu(false)}
            trackId={selectedTrack.id}
            lastEndTick={lastEndTick} // Pass lastEndTick to AddTrackMenu
          />
        </div>
      )}
    </div>
  );
};
