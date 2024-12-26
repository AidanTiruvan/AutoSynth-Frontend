import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import {
  deselectSubProcedure,
  removeBar,
} from '../playlist/store/playlist-slice';

const darkenColor = (color: string, amount: number) => {
  const colorValue = color.startsWith('#') ? color.slice(1) : color;
  const num = parseInt(colorValue, 16);
  const r = Math.max((num >> 16) - amount, 0);
  const g = Math.max(((num >> 8) & 0x00ff) - amount, 0);
  const b = Math.max((num & 0x0000ff) - amount, 0);
  return `rgba(${r}, ${g}, ${b}, 0.8)`; // Add opacity for translucency
};

export const BottomPanel = () => {
  const dispatch = useDispatch();
  const selectedSubProcedure = useSelector(
    (state: RootState) => state.playlist.selectedSubProcedure
  );
  const track = useSelector((state: RootState) =>
    state.playlist.tracks.find((t) => t.id === selectedSubProcedure?.trackId)
  );
  const bar = track?.bars.find((b) => b.id === selectedSubProcedure?.barId);

  if (!selectedSubProcedure || !track || !bar) return null;

  const handleDelete = () => {
    dispatch(removeBar({ trackId: track.id, barId: selectedSubProcedure.barId }));
    dispatch(deselectSubProcedure());
  };

  const handleClose = () => {
    dispatch(deselectSubProcedure());
  };

  const panelColor = bar.color ? darkenColor(bar.color, 50) : 'rgba(128, 128, 128, 0.8)';

  return (
    <div
      className="fixed bottom-0 left-0 w-full text-white p-6 shadow-lg"
      style={{
        height: '45vh',
        backgroundColor: panelColor,
        backdropFilter: 'blur(18px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">Sub-Procedure Details</h3>
          <button
            className="text-red-500 hover:text-red-700"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
        <p className="mt-0 text-lg font-bold">{selectedSubProcedure.title}</p>
        <p className="mt-0 text-sm text-gray-300">Reactor: {track.title}</p>
      </div>

      <div className="relative">
        <p className="absolute bottom-6 left-1 text-sm text-gray-300">
          ID: {selectedSubProcedure.barId}
        </p>
        <button
          className="absolute bottom-6 right-1 bg-red-500 text-white px-4 py-2 rounded shadow-md hover:bg-red-600 active:bg-red-700 focus:outline-none"
          onClick={handleDelete}
          style={{
            backgroundColor: '#e53e3e', // Ensure consistent red color
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          Delete Sub-Procedure
        </button>
      </div>
    </div>
  );
};
