import { Bar } from '../../../../model/bar/bar'
import { Track } from '../../../../model/track/track'
import { TICK_WIDTH_PIXEL } from '../../playlist/constants'

export type UseDragBarParams = {
  type: 'drag_bar'
  bar: Bar
  track: Track
}

export type UseDropBarParams = {
  type: 'drop_bar'
  onDropBar: (
    barId: string,
    fromTrackId: string,
    newStartAtTick: number
  ) => void
}

export type UseDragAndDropParams =
  | UseDragBarParams
  | UseDropBarParams

export const useDragAndDrop = (props: UseDragAndDropParams) => {
  const handleDragStart = (e: React.DragEvent) => {
    if (props.type === 'drop_bar') return

    const xPositionWithinElement =
      e.clientX - e.currentTarget.getBoundingClientRect().left
    const relativeTick = Math.floor(xPositionWithinElement / TICK_WIDTH_PIXEL)

    e.dataTransfer.effectAllowed = 'move'
    // these will be used to identify the bar when dropping over the timeline
    e.dataTransfer.setData('dragging/bar_id', props.bar.id)
    e.dataTransfer.setData('dragging/track_id', props.track.id)
    e.dataTransfer.setData('dragging/relative_tick', relativeTick.toString())
  }

  const handleOnDrop = (e: React.DragEvent) => {
    if (props.type === 'drag_bar') return

    const barId = e.dataTransfer.getData('dragging/bar_id')
    const fromTrackId = e.dataTransfer.getData('dragging/track_id')
    const startDraggingTick = e.dataTransfer.getData('dragging/relative_tick')

    const mouseXPositionWithinTrack =
      e.clientX - e.currentTarget.getBoundingClientRect().left
    const mouseSelectedTick = Math.floor(
      mouseXPositionWithinTrack / TICK_WIDTH_PIXEL
    )
    // the new startAtTick will be the tick selected by mouse taking into consideration the relative tick where the bar was grabbed
    const newStartAtTick = Math.max(
      mouseSelectedTick - parseInt(startDraggingTick),
      0
    )

    if (props.type === 'drop_bar') {
      props.onDropBar(barId, fromTrackId, newStartAtTick)
    }
  }

  return {
    handleDragStart,
    handleOnDrop,
  }
}
