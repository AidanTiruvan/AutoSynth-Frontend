import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import {
  deselectSubProcedure,
  removeBar,
} from '../playlist/store/playlist-slice';

export const BottomPanel = () => {
  const dispatch = useDispatch();
  const selectedSubProcedure = useSelector(
    (state: RootState) => state.playlist.selectedSubProcedure
  );
  const track = useSelector((state: RootState) =>
    state.playlist.tracks.find((t) => t.id === selectedSubProcedure?.trackId)
  );

  if (!selectedSubProcedure || !track) return null;

  const handleDelete = () => {
    dispatch(removeBar({ trackId: track.id, barId: selectedSubProcedure.barId }));
    dispatch(deselectSubProcedure());
  };

  const handleClose = () => {
    dispatch(deselectSubProcedure());
  };

  return (
    <div
      className="fixed bottom-0 left-0 w-full bg-gray-900 text-white p-6 shadow-lg flex flex-col justify-between"
      style={{ height: '45vh' }}
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

      <p className="mt-auto text-sm text-gray-300">ID: {selectedSubProcedure.barId}</p>

      <div className="mt-4 flex justify-end gap-2">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={handleDelete}
        >
          Delete Sub-Procedure
        </button>
      </div>
    </div>
  );
};
