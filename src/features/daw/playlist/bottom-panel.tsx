import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { deselectSubProcedure } from '../playlist/store/playlist-slice';

export const BottomPanel = () => {
  const dispatch = useDispatch();
  const selectedSubProcedure = useSelector(
    (state: RootState) => state.playlist.selectedSubProcedure
  );

  if (!selectedSubProcedure) return null; // Render nothing if no sub-procedure is selected

  const handleClose = () => {
    dispatch(deselectSubProcedure());
  };

  return (
    <div
      className="fixed bottom-0 left-0 w-full bg-gray-900 text-white p-6 shadow-lg"
      style={{ height: '45vh' }} // Adjust the height of the panel
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Sub-Procedure Details</h3>
        <button
          className="text-red-500 hover:text-red-700"
          onClick={handleClose}
        >
          Close
        </button>
      </div>
      <div className="mt-4">
        <p>
          <span className="font-semibold">Track ID:</span>{' '}
          {selectedSubProcedure.trackId}
        </p>
        <p>
          <span className="font-semibold">Sub-Procedure ID:</span>{' '}
          {selectedSubProcedure.barId}
        </p>
        <p>
          <span className="font-semibold">Title:</span>{' '}
          {selectedSubProcedure.title || 'Untitled'}
        </p>
      </div>
    </div>
  );
};
