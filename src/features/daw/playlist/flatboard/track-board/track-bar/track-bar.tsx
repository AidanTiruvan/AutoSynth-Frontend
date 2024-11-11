import { PopupMenu } from '../../../../common/components/popup-menu/popup-menu';
import { FLATBOARD_BAR_HEADER_HEIGHT, TRACK_HEIGHT } from '../../../constants';
import { TrackBarProps } from './types';
import { useTrackBarData } from './use-track-bar-data';

export const TrackBar = (props: TrackBarProps) => {
  const {
    bar,
    style: {
      barLengthPixel,
      barOffsetStyle,
    },
    onSelectBar,
    onBarDetails,
    onDragStart,
    onResizeMouseDown,
    onContextMenu,
    renameInput,
    menu,
  } = useTrackBarData(props);

  return (
    <div
      key={bar.id}
      className="absolute"
      style={{
        width: barLengthPixel,
        left: barOffsetStyle,
        height: `${TRACK_HEIGHT}px`,
        backgroundColor: bar.color || 'grey',
        zIndex: 1, // Ensure TrackBar has a lower z-index than AddTrackMenu
      }}
      onContextMenu={onContextMenu}
    >
      <div className="relative w-full h-full">
        <div
          className={`absolute flex flex-col opacity-80 rounded-md cursor-grab h-full w-full`}
          onClick={() => onSelectBar(bar)}
          onDoubleClick={() => onBarDetails(bar)}
          draggable
          onDragStart={onDragStart}
        >
          <div
            className="flex flex-row pl-2 rounded-t-md text-sm font-bold select-none"
            style={{
              height: `${FLATBOARD_BAR_HEADER_HEIGHT}px`,
              color: 'white',
            }}
          >
            {renameInput.isEnabled ? (
              <input
                type="text"
                className="w-full p-1 mt-1 bg-zinc-300 dark:bg-zinc-800"
                value={renameInput.value}
                autoFocus
                onBlur={renameInput.onInputBlur}
                onChange={renameInput.onInputChange}
              />
            ) : (
              <span className="select-none font-bold text-white text-sm">
                {bar.title}
              </span>
            )}
          </div>
        </div>
        <div
          className="absolute z-20 right-0 h-full w-2 cursor-ew-resize"
          onMouseDown={onResizeMouseDown}
        />

        {menu.isOpen && (
          <div className="fixed mt-4 ml-4 z-50 h-fit w-fit">
            <PopupMenu {...menu} />
          </div>
        )}
      </div>
    </div>
  );
};
