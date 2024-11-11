import { BiRename } from 'react-icons/bi'
import { TrackSetColorMenu } from './track-set-color-menu/track-set-color-menu'
import { Track } from '../../../../../model/track/track'
import { useDispatch } from 'react-redux'
import { setTrackColor } from '../../store/playlist-slice'
import { useRef } from 'react'
import { useCallbackOnOutsideClick } from '../../../common/hooks/use-outside-click'

export type TrackPopupMenuProps = {
  track: Track
  onClose: () => void
  onRename: () => void
}

export const TrackPopupMenu = ({
  track,
  onClose,
  onRename,
}: TrackPopupMenuProps) => {
  const dispatch = useDispatch()
  const popupMenuRef = useRef<HTMLDivElement>(null)

  // Close the menu if clicked outside
  useCallbackOnOutsideClick(popupMenuRef, onClose)

  const menuItems = [
    {
      label: 'Rename',
      icon: <BiRename />,
      action: () => {
        onRename()
      },
    },
  ]

  return (
    <div
      className="w-52 flex flex-col bg-zinc-200 dark:bg-zinc-900 shadow-md shadow-zinc-600 rounded-xl overflow-hidden"
      ref={popupMenuRef}
    >
      {/* Track Color Menu */}
      <TrackSetColorMenu
        currentColor={track.color}
        onSetColor={(color) =>
          dispatch(setTrackColor({ trackId: track.id, color }))
        }
      />

      {/* Menu Items (only rename action) */}
      {menuItems.map((item, index) => (
        <div
          key={index}
          className="p-2 hover:bg-zinc-300 dark:hover:bg-zinc-600 select-none cursor-pointer flex flex-row gap-2 items-center"
          onClick={item.action}
        >
          {item.icon}
          <p className="font-bold text-sm">{item.label}</p>
        </div>
      ))}
    </div>
  )
}
