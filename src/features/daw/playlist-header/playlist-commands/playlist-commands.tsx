import { FaPlus } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { useState } from 'react';
import { AddTrackMenu } from './add-track-menu/add-track-menu';
import { useSelector } from 'react-redux';
import { selectSelectedTrack } from '../../playlist/store/selectors';

export const PlaylistCommands = () => {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const selectedTrack = useSelector(selectSelectedTrack);

  // Calculate lastEndTick based on the selected track's bars (sub-procedures)
  const lastEndTick = selectedTrack?.bars.length
    ? Math.max(...selectedTrack.bars.map((bar) => bar.startAtTick + bar.durationTicks))
    : 0;

  return (
    <div className="flex flex-row">
      <div className="relative h-full w-full">
        <button
          onClick={() => {
            if (!showAddMenu) {
              setShowAddMenu(true);
            }
          }}
        >
          <div className="flex flex-row items-center justify-center gap-2">
            {showAddMenu ? (
              <IoMdClose className="animate-in spin-in" />
            ) : (
              <FaPlus className="animate-out spin-out" />
            )}
            <p>Add Sub-Procedure</p>
          </div>
        </button>

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
    </div>
  );
};
