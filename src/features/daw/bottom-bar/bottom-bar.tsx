import { useDispatch, useSelector } from 'react-redux'
import { selectSelectedBottomUpPanel } from './store/selectors'
import { selectSelectedTrack } from '../playlist/store/selectors'
import { BottomUpPanel } from './types/bottom-up-panel'
import { BottomBarItem } from './bottom-bar-item/bottom-bar-item'
import { useEffect } from 'react'
import { selectBottomUpPanel } from './store/bottom-bar-slice'
import { Track } from '../../../model/track/track'

const bottomUpPanelItems: { label: string; bottomUpPanel: BottomUpPanel }[] = [
  {
    label: 'Reactor Control',
    bottomUpPanel: 'reactor',
  },
  {
    label: 'Sub Procedures',
    bottomUpPanel: 'subProcedure',
  },
  {
    label: 'Run Reaction',
    bottomUpPanel: 'runProcedure',
  },
]

const getAllowedBottomUpPanelForTrack = (selectedTrack?: Track) => {
  const selectedTrackCategory = selectedTrack?.procedurePreset?.category
  if (selectedTrackCategory && selectedTrackCategory !== 'SUB_PROCEDURE') {
    return ['reactor', 'subProcedure']
  }

  if (selectedTrackCategory && selectedTrackCategory === 'SUB_PROCEDURE') {
    return ['runProcedure']
  }

  return []
}

export const BottomBar = () => {
  const selectedBottomUpPanel = useSelector(selectSelectedBottomUpPanel)
  const dispatch = useDispatch()
  const selectedTrack = useSelector(selectSelectedTrack)
  const items = getAllowedBottomUpPanelForTrack(selectedTrack)
    .map((panel) => {
      return bottomUpPanelItems.find((item) => item.bottomUpPanel === panel)
    })
    .filter(Boolean) as { label: string; bottomUpPanel: BottomUpPanel }[]

  useEffect(() => {
    const allowedBottomUpPanels = getAllowedBottomUpPanelForTrack(selectedTrack)
    if (
      selectedBottomUpPanel &&
      !allowedBottomUpPanels.includes(selectedBottomUpPanel)
    ) {
      if (allowedBottomUpPanels.length === 0) {
        dispatch(selectBottomUpPanel(null))
      } else {
        dispatch(selectBottomUpPanel(allowedBottomUpPanels[0] as BottomUpPanel))
      }
    }
  }, [dispatch, selectedBottomUpPanel, selectedTrack])

  return (
    <div className="flex flex-row py-1 px-2 gap-2">
      {items.map((item) => (
        <BottomBarItem
          key={item.label}
          label={item.label}
          bottomUpPanel={item.bottomUpPanel}
          selectedTrack={selectedTrack}
          selectedBottomUpPanel={selectedBottomUpPanel}
        />
      ))}
    </div>
  )
}
