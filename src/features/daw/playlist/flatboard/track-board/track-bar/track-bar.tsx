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
   * Handler to move the bar to the left by swapping it with the preceding bar if it's perfectly adjacent.
   * Otherwise, if there's a gap, it snaps to close the gap with the nearest bar on the left.
   */
  const handleMoveLeft = (e: React.MouseEvent) => {
    e.stopPropagation();

    // 1. Check if there's an immediately adjacent bar on the left
    const leftBar = track.bars.find(
      (b) => b.startAtTick + b.durationTicks === bar.startAtTick && b.id !== bar.id
    );

    if (leftBar) {
      // -- OLD GAP-FREE SWAP LOGIC (like your previous code) --
      const leftBarOldStart = leftBar.startAtTick;
      const currentBarDuration = bar.durationTicks;

      // Move the current bar to the left bar's old start
      dispatch(
        updateBarPosition({
          trackId: track.id,
          barId: bar.id,
          newStartAtTick: leftBarOldStart,
        })
      );

      // Move the left bar so that it starts right after the current bar ends
      dispatch(
        updateBarPosition({
          trackId: track.id,
          barId: leftBar.id,
          newStartAtTick: leftBarOldStart + currentBarDuration,
        })
      );

      return;
    }

    // 2. If no adjacent bar, look for ANY bar on the left to "snap" to
    const snapCandidate = track.bars
      .filter((b) => b.id !== bar.id && b.startAtTick + b.durationTicks < bar.startAtTick)
      // sort by who ends closest on the left
      .sort(
        (b1, b2) =>
          (b2.startAtTick + b2.durationTicks) - (b1.startAtTick + b1.durationTicks)
      )[0];

    if (!snapCandidate) return; // No bar to snap to

    // Snap the current bar so it starts exactly where snapCandidate ends
    const newStart = snapCandidate.startAtTick + snapCandidate.durationTicks;

    dispatch(
      updateBarPosition({
        trackId: track.id,
        barId: bar.id,
        newStartAtTick: newStart,
      })
    );
  };

  // Calculate CSS positioning based on ticks and pixel width
  const computedLeft = bar.startAtTick * TICK_WIDTH_PIXEL;
  const computedWidth = bar.durationTicks * TICK_WIDTH_PIXEL;

  // Determine if move buttons should be disabled
  // We relaxed hasLeftBar so it's true if there's ANY bar to the left, even if there's a gap.
  const hasRightBar = track.bars.some((b) => b.startAtTick === endTick && b.id !== bar.id);
  const hasLeftBar = track.bars.some(
    (b) =>
      b.id !== bar.id &&
      b.startAtTick + b.durationTicks <= bar.startAtTick
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
