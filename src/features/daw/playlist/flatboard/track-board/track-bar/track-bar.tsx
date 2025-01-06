import { Bar } from '../../../../../../model/bar/bar';
import { Track } from '../../../../../../model/track/track';
import { useDispatch } from 'react-redux';
import { TICK_WIDTH_PIXEL } from '../../../constants';
import { selectSubProcedure, updateBarPosition } from '../../../store/playlist-slice';
import React from 'react';

// Utility function to darken a color
const darkenColor = (color: string, amount: number): string => {
  const colorValue = color.startsWith('#') ? color.slice(1) : color;
  const num = parseInt(colorValue, 16);
  const r = Math.max((num >> 16) - amount, 0);
  const g = Math.max(((num >> 8) & 0x00ff) - amount, 0);
  const b = Math.max((num & 0x0000ff) - amount, 0);
  return `rgb(${r}, ${g}, ${b})`;
};

interface TrackBarProps {
  bar: Bar;
  track: Track;
  onBarDetails: () => void;
}

export const TrackBar: React.FC<TrackBarProps> = ({ bar, track, onBarDetails }) => {
  const dispatch = useDispatch();

  // Darken the bar color for arrow buttons
  const buttonColor = bar.color ? darkenColor(bar.color, 50) : 'grey';

  // Handler for selecting the bar
  const handleSelectBar = () => {
    dispatch(selectSubProcedure({ trackId: track.id, barId: bar.id, title: bar.title }));
  };

  // Calculate the bar's end tick
  const endTick = bar.startAtTick + bar.durationTicks;

  /**
   * Handler to move the bar to the right by swapping it with the adjacent bar.
   * Ensures that no gaps are introduced by adjusting startAtTick based on adjacent bar's duration.
   */
  const handleMoveRight = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Find the bar that starts exactly at the end tick of the current bar
    const rightBar = track.bars.find((b) => b.startAtTick === endTick && b.id !== bar.id);
    if (!rightBar) return; // No adjacent bar to the right; do nothing

    const currentStart = bar.startAtTick;
    const rightDuration = rightBar.durationTicks;

    // Dispatch action to update the rightBar's startAtTick to current bar's startAtTick
    dispatch(
      updateBarPosition({
        trackId: track.id,
        barId: rightBar.id,
        newStartAtTick: currentStart,
      })
    );

    // Dispatch action to update the current bar's startAtTick to rightBar's original end tick
    dispatch(
      updateBarPosition({
        trackId: track.id,
        barId: bar.id,
        newStartAtTick: currentStart + rightDuration,
      })
    );
  };

  /**
   * Handler to move the bar to the left by swapping it with the preceding bar.
   * Ensures that no gaps are introduced by adjusting startAtTick based on adjacent bar's duration.
   *//**
 * Handler to move the bar to the left by swapping it with the preceding bar.
 * Ensures that no gaps or overlaps are introduced by adjusting startAtTick based on adjacent bar's duration.
 */const handleMoveLeft = (e: React.MouseEvent) => {
  e.stopPropagation();

  // Find the bar that ends exactly at the start tick of the current bar
  const leftBar = track.bars.find(
    (b) => b.startAtTick + b.durationTicks === bar.startAtTick && b.id !== bar.id
  );
  if (!leftBar) return; // No adjacent bar to the left; do nothing

  const originalLeftBarStart = leftBar.startAtTick;

  // Swap the startAtTick values
  dispatch(
    updateBarPosition({
      trackId: track.id,
      barId: bar.id,
      newStartAtTick: originalLeftBarStart,
    })
  );

  dispatch(
    updateBarPosition({
      trackId: track.id,
      barId: leftBar.id,
      newStartAtTick: bar.durationTicks,
    })
  );
};


  // Calculate CSS positioning based on ticks and pixel width
  const computedLeft = bar.startAtTick * TICK_WIDTH_PIXEL;
  const computedWidth = bar.durationTicks * TICK_WIDTH_PIXEL;

  // Determine if move buttons should be disabled (no adjacent bar in that direction)
  const hasRightBar = track.bars.some((b) => b.startAtTick === endTick && b.id !== bar.id);
  const hasLeftBar = track.bars.some(
    (b) => b.startAtTick + b.durationTicks === bar.startAtTick && b.id !== bar.id
  );

  return (
    <div
      key={bar.id}
      className="absolute rounded-md cursor-pointer"
      style={{
        left: `${computedLeft}px`,
        width: `${computedWidth}px`,
        height: '100%',
        backgroundColor: bar.color || 'grey',
      }}
      onClick={handleSelectBar}
      onDoubleClick={onBarDetails}
    >
      {/* Display the bar title centered */}
      <div className="flex items-center justify-center h-full text-white font-bold">
        {bar.title}
      </div>

      {/* Move buttons positioned at the top-right corner */}
      <div className="absolute top-0 right-0 flex gap-1">
        <button
          className="text-white px-1 py-0.5 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: buttonColor }}
          onClick={handleMoveLeft}
          disabled={!hasLeftBar}
          aria-label="Move Left"
        >
          ←
        </button>
        <button
          className="text-white px-1 py-0.5 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: buttonColor }}
          onClick={handleMoveRight}
          disabled={!hasRightBar}
          aria-label="Move Right"
        >
          →
        </button>
      </div>
    </div>
  );
};
