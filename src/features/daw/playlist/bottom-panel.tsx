import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import {
  deselectSubProcedure,
  removeBar,
  updateDispenseParams, // <-- Import our new action
} from '../playlist/store/playlist-slice';

const darkenColor = (color: string, amount: number) => {
  const colorValue = color.startsWith('#') ? color.slice(1) : color;
  const num = parseInt(colorValue, 16);
  const r = Math.max((num >> 16) - amount, 0);
  const g = Math.max(((num >> 8) & 0x00ff) - amount, 0);
  const b = Math.max((num & 0x0000ff) - amount, 0);
  return `rgba(${r}, ${g}, ${b}, 0.8)`; // Add opacity for translucency
};

// Optional: chemicals for dropdown
const CHEMICAL_OPTIONS = [
  { label: 'Water', value: 'Water' },
  { label: 'Ethanol', value: 'Ethanol' },
  { label: 'Acetone', value: 'Acetone' },
  { label: 'Sodium Chloride', value: 'SodiumChloride' },
  { label: 'Glucose Solution', value: 'GlucoseSolution' },
  { label: 'Sulfuric Acid', value: 'SulfuricAcid' },
  { label: 'Hydrogen Peroxide', value: 'HydrogenPeroxide' },
  { label: 'Glycerol', value: 'Glycerol' },
  { label: 'Methanol', value: 'Methanol' },
  { label: 'Chloroform', value: 'Chloroform' },
];

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

  // -------------------------------
  // Handlers
  // -------------------------------
  const handleDelete = () => {
    dispatch(removeBar({ trackId: track.id, barId: selectedSubProcedure.barId }));
    dispatch(deselectSubProcedure());
  };

  const handleClose = () => {
    dispatch(deselectSubProcedure());
  };

  // Update chemical in Redux
  const handleChemicalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(
      updateDispenseParams({
        trackId: track.id,
        barId: bar.id,
        chemical: e.target.value,
        volume: bar.volume || 0,
      })
    );
  };

  // Update volume in Redux (prevent negatives)
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseFloat(e.target.value) || 0;
    dispatch(
      updateDispenseParams({
        trackId: track.id,
        barId: bar.id,
        chemical: bar.chemical || 'Water',
        volume: inputValue < 0 ? 0 : inputValue,
      })
    );
  };

  // Calculate total time in seconds (durationTicks * 3.75)
  const totalTimeSeconds = (bar.durationTicks || 0) * 3.75;

  // Darken the bar’s color if available, otherwise default
  const panelColor = bar.color
    ? darkenColor(bar.color, 50)
    : 'rgba(128, 128, 128, 0.8)';

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
      {/* Top Section */}
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

      {/* Middle Section: Chemical & Volume Inputs */}
      {selectedSubProcedure.title === 'Dispense Chemicals' && (
        <div className="mt-2 flex flex-col items-start" style={{ marginLeft: '20rem', marginTop: '-7rem' }}>
          <div className="mb-4 w-3/4">
            <label className="block mb-1">Chemical Type</label>
            <select
              className="text-black px-4 py-2 rounded w-full"
              value={bar.chemical || ''}
              onChange={handleChemicalChange}
            >
              <option value="">-- Select Chemical --</option>
              {CHEMICAL_OPTIONS.map((chem) => (
                <option key={chem.value} value={chem.value}>
                  {chem.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4 w-3/4">
            <label className="block mb-1">Volume (mL)</label>
            <input
              type="number"
              className="text-black px-4 py-2 rounded w-full"
              min="0"
              step="0.01"
              value={bar.volume ?? 0}
              onChange={handleVolumeChange}
            />
          </div>

          <div className="w-3/4">
            <label className="block mb-1">Total Time (seconds)</label>
            <p className="text-gray-200 text-center">
              {totalTimeSeconds.toFixed(2)} sec
            </p>
          </div>
        </div>
      )}

      {/* Bottom Section: Delete & ID */}
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
