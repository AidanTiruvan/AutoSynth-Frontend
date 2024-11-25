import { Bar } from '../../../../model/bar/bar';
import { Track } from '../../../../model/track/track';
import { TICK_WIDTH_PIXEL } from '../../playlist/constants';

export type UseDragBarParams = {
  type: 'drag_bar';
  bar: Bar;
  track: Track;
};

export type UseDropBarParams = {
  type: 'drop_bar';
  onDropBar: (
    barId: string,
    fromTrackId: string,
    newStartAtTick: number
  ) => void;
  validateDropPosition: (barId: string, newStartAtTick: number) => boolean; // Add validation function
};

export type UseDragAndDropParams = UseDragBarParams | UseDropBarParams;

export const useDragAndDrop = (props: UseDragAndDropParams) => {
  const handleDragStart = (e: React.DragEvent) => {
    if (props.type === 'drop_bar') return;

    const xPositionWithinElement =
      e.clientX - e.currentTarget.getBoundingClientRect().left;
    const relativeTick = Math.floor(xPositionWithinElement / TICK_WIDTH_PIXEL);

    e.dataTransfer.effectAllowed = 'move';
    // These will be used to identify the bar when dropping over the timeline
    e.dataTransfer.setData('dragging/bar_id', props.bar.id);
    e.dataTransfer.setData('dragging/track_id', props.track.id);
    e.dataTransfer.setData('dragging/relative_tick', relativeTick.toString());
  };

  const handleOnDrop = (e: React.DragEvent) => {
    if (props.type === 'drag_bar') return;

    const barId = e.dataTransfer.getData('dragging/bar_id');
    const fromTrackId = e.dataTransfer.getData('dragging/track_id');
    const startDraggingTick = e.dataTransfer.getData('dragging/relative_tick');

    const mouseXPositionWithinTrack =
      e.clientX - e.currentTarget.getBoundingClientRect().left;
    const mouseSelectedTick = Math.floor(
      mouseXPositionWithinTrack / TICK_WIDTH_PIXEL
    );

    // Calculate the new start position
    const newStartAtTick = Math.max(
      mouseSelectedTick - parseInt(startDraggingTick, 10),
      0
    );

    // Check for collisions or invalid positions using `validateDropPosition`
    if (
      props.type === 'drop_bar' &&
      props.validateDropPosition(barId, newStartAtTick)
    ) {
      props.onDropBar(barId, fromTrackId, newStartAtTick);
    } else {
      console.warn('Invalid drop position, resetting.');
    }
  };

  return {
    handleDragStart,
    handleOnDrop,
  };
};
