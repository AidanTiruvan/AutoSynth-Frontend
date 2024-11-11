import { useDispatch } from 'react-redux'
import { BottomUpPanel } from '../types/bottom-up-panel'
import { closeAllBottomUpPanels, selectBottomUpPanel } from '../store/bottom-bar-slice'
import { Track } from '../../../../model/track/track'

export type BottomBarItemProps = {
  label: string
  bottomUpPanel: BottomUpPanel
  selectedTrack?: Track // Ensure this is optional (Track | undefined)
  selectedBottomUpPanel: BottomUpPanel | null
}

export const BottomBarItem = ({
  selectedTrack,
  selectedBottomUpPanel,
  bottomUpPanel,
  label,
}: BottomBarItemProps) => {
  const dispatch = useDispatch()
  const isSelected = selectedBottomUpPanel === bottomUpPanel

  const handleSelection = () => {
    if (isSelected) {
      dispatch(closeAllBottomUpPanels())
    } else {
      dispatch(selectBottomUpPanel(bottomUpPanel))
    }
  }

  return (
    <div className="flex">
      <button
        disabled={!selectedTrack}
        onClick={handleSelection}
        className={`text-xs font-bold  ${
          !selectedTrack && 'bg-gray-300 dark:bg-gray-600'
        } ${isSelected && 'bg-black text-black dark:bg-black dark:text-black'}`}
      >
        {label}
      </button>
    </div>
  )
}
