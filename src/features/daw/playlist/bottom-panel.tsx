import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { deselectSubProcedure } from '../playlist/store/playlist-slice';

export const BottomPanel = () => {
    const dispatch = useDispatch();
    const selectedSubProcedure = useSelector(
      (state: RootState) => state.playlist.selectedSubProcedure
    );
  
    console.log('BottomPanel Rendered. Selected Sub-Procedure:', selectedSubProcedure);
  
    if (!selectedSubProcedure) return null;
  
    const handleClose = () => {
      console.log('Closing BottomPanel');
      dispatch(deselectSubProcedure());
    };
  
    return (
      <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-white p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">Sub-Procedure Details</h3>
          <button
            className="text-red-500 hover:text-red-700"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
        <p className="mt-2">Track ID: {selectedSubProcedure.trackId}</p>
        <p>Sub-Procedure ID: {selectedSubProcedure.barId}</p>
      </div>
    );
  };
  