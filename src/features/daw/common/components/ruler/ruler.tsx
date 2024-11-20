import { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RULER_BAR_WIDTH, SUB_BAR_NUM } from './constants';
import { selectMaxBars } from '../../../playlist-header/store/selectors';
import { selectTime } from '../../../player-bar/store/selectors';

const TICK_WIDTH_PIXEL = 5.35; // Adjust this value up or down until each bar represents exactly 15 seconds
const START_OFFSET = -8; // Adjust this value to control the starting position

const RulerThumb = ({ currentTime }: { currentTime: number }) => {
  const leftOffset = currentTime * TICK_WIDTH_PIXEL + START_OFFSET;

  return (
    <div
      className="absolute bottom-0 w-0 h-0 
      border-l-[8px] border-l-transparent
      border-t-[17px] dark:border-t-gray-400 border-t-gray-800
      border-r-[8px] border-r-transparent"
      style={{ left: `${leftOffset}px`, transition: 'left 0.1s linear' }}
    />
  );
};


const RulerBar = ({ barIndex }: { barIndex: number }) => {
  return (
    <div
      key={barIndex}
      className={`flex flex-col justify-end gap-4 w-[${RULER_BAR_WIDTH}px] border-l border-slate-700 dark:border-slate-400`}
    >
      <div className="px-2 text-slate-700 dark:text-slate-400 select-none">
        {barIndex + 1}
      </div>
      <div className="flex flex-row h-[40%]">
        {Array.from({ length: SUB_BAR_NUM }).map((_, j) => (
          <div key={j} className="w-full border-slate-400"></div>
        ))}
      </div>
    </div>
  );
};

export const Ruler = () => {
  const maxBars = useSelector(selectMaxBars);
  const currentTime = useSelector(selectTime) as number;
  const rulerContainerRef = useRef<HTMLDivElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);

  // Synchronize scroll positions
  const syncScroll = () => {
    if (rulerContainerRef.current && timelineContainerRef.current) {
      rulerContainerRef.current.scrollLeft = timelineContainerRef.current.scrollLeft;
    }
  };

  useEffect(() => {
    const scrollOffset = (currentTime / 15) * TICK_WIDTH_PIXEL - (rulerContainerRef.current?.clientWidth || 0) / 2;
    if (rulerContainerRef.current) {
      rulerContainerRef.current.scrollLeft = scrollOffset > 0 ? scrollOffset : 0;
    }
  }, [currentTime]);

  useEffect(() => {
    // Attach scroll event listener to synchronize ruler and timeline
    const timeline = timelineContainerRef.current;
    if (timeline) {
      timeline.addEventListener('scroll', syncScroll);
    }

    return () => {
      if (timeline) {
        timeline.removeEventListener('scroll', syncScroll);
      }
    };
  }, []);

  return (
    <div className="relative">
      <div ref={rulerContainerRef} className="h-full flex flex-row bg-slate-100 dark:bg-slate-900 overflow-x-auto">
        {Array.from({ length: maxBars }).map((_, i) => (
          <RulerBar key={i} barIndex={i} />
        ))}
      </div>
      <RulerThumb currentTime={currentTime} />
      <div ref={timelineContainerRef} className="h-full flex flex-row overflow-x-auto">
        {/* Timeline content can go here */}
      </div>
    </div>
  );
};
