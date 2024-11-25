import { useState } from 'react';
import { Bar } from '../../../../model/bar/bar';

export const useHorizontalResize = (
  initialWidth: number,
  bars: Bar[],
  currentBar: Bar
) => {
  const [elementWidth, setElementWidth] = useState(initialWidth);

  const handleResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const xBeforeResize = e.clientX;

    const mouseMoveHandler = (e: MouseEvent) => {
      const dx = e.clientX - xBeforeResize;
      const newWidth = elementWidth + dx;

      // Prevent overlapping during resizing
      const maxAllowedWidth = calculateMaxAllowedWidth(bars, currentBar);
      if (newWidth <= maxAllowedWidth && newWidth > 0) {
        setElementWidth(newWidth);
      }
    };

    const mouseUpHandler = () => {
      document.removeEventListener('mouseup', mouseUpHandler);
      document.removeEventListener('mousemove', mouseMoveHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  const calculateMaxAllowedWidth = (bars: Bar[], currentBar: Bar): number => {
    const currentBarEndTick = currentBar.startAtTick + currentBar.durationTicks;

    // Find the nearest bar after the current one
    const nextBar = bars
      .filter((bar) => bar.startAtTick >= currentBarEndTick && bar.id !== currentBar.id)
      .sort((a, b) => a.startAtTick - b.startAtTick)[0];

    if (!nextBar) {
      return Infinity; // No bar after current one, no constraint
    }

    const maxTicks = nextBar.startAtTick - currentBar.startAtTick;
    return maxTicks * 10; // Convert ticks to pixels
  };

  return {
    elementWidth,
    setElementWidth,
    handleResizeMouseDown,
  };
};
