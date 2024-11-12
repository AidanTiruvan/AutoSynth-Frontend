import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { setRulerScrollPosition } from '../../playlist-header/store/playlist-header-slice';
import { useEffect } from 'react';

export const useRulerScroll = (ref: React.RefObject<HTMLDivElement>) => {
  const rulerScroll = useSelector(
    (state: RootState) => state.playlistHeader.rulerScrollPosition
  );
  const isPlaying = useSelector(
    (state: RootState) => state.playerBar.isPlaying
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isPlaying && ref.current && ref.current.scrollLeft !== rulerScroll) {
      ref.current.scrollLeft = rulerScroll;
    }
  }, [rulerScroll, ref, isPlaying]);

  const handleRulerScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!isPlaying) {
      dispatch(setRulerScrollPosition(e.currentTarget.scrollLeft));
    }
  };

  return handleRulerScroll;
};
