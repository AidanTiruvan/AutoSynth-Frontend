import { useDispatch } from 'react-redux';
import { TrackBarProps } from './types';
import { useState } from 'react';
import { renameBar } from '../../../store/playlist-slice';

export const useTrackBarData = ({
  track,
  bar,
  onSelectBar,
  onBarDetails,
}: TrackBarProps) => {
  const dispatch = useDispatch();
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameInput, setRenameInput] = useState(bar.title);

  const onContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    onSelectBar();
  };

  return {
    bar,
    isSelected: false, // Adjust logic if needed
    style: {
      barLengthPixel: bar.durationTicks * 10, // Example calculation
      barOffsetStyle: `${bar.startAtTick * 10}px`, // Example calculation
    },
    onSelectBar,
    onBarDetails,
    onContextMenu,

    renameInput: {
      isEnabled: isRenaming,
      value: renameInput,
      onInputChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setRenameInput(e.target.value),
      onInputBlur: () => {
        setIsRenaming(false);
        dispatch(
          renameBar({
            trackId: track.id, // Include the track ID
            barId: bar.id,
            newTitle: renameInput,
          })
        );
      },
    },
  };
};
