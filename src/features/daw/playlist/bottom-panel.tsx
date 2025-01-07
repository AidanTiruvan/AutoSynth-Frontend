import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import {
  deselectSubProcedure,
  removeBar,
  updateDispenseParams,
} from '../playlist/store/playlist-slice';

const darkenColor = (color: string, amount: number) => {
  const colorValue = color.startsWith('#') ? color.slice(1) : color;
  const num = parseInt(colorValue, 16);
  const r = Math.max((num >> 16) - amount, 0);
  const g = Math.max(((num >> 8) & 0x00ff) - amount, 0);
  const b = Math.max((num & 0x0000ff) - amount, 0);
  return `rgba(${r}, ${g}, ${b}, 0.8)`;
};

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

// 1 tick = 0.9375 seconds, so 32 ticks = 30 seconds
const SECONDS_PER_TICK = 0.9375;

export const BottomPanel: React.FC = () => {
  const dispatch = useDispatch();

  // Local state for Run Reaction inputs and errors
  const [amplitude, setAmplitude] = useState<string>('');
  const [rpm, setRpm] = useState<string>('');
  const [temperature, setTemperature] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [amplitudeError, setAmplitudeError] = useState<string>('');
  const [rpmError, setRpmError] = useState<string>('');
  const [temperatureError, setTemperatureError] = useState<string>('');
  const [durationError, setDurationError] = useState<string>('');
  const [temperatureWarning, setTemperatureWarning] = useState<string>('');

  const selectedSubProcedure = useSelector(
    (state: RootState) => state.playlist.selectedSubProcedure
  );
  const track = useSelector((state: RootState) =>
    state.playlist.tracks.find((t) => t.id === selectedSubProcedure?.trackId)
  );
  const bar = track?.bars.find((b) => b.id === selectedSubProcedure?.barId);

  useEffect(() => {
    console.log('BottomPanel: selectedSubProcedure changed:', selectedSubProcedure);
  }, [selectedSubProcedure]);

  if (!selectedSubProcedure || !track || !bar) return null;

  // -------------------------------
  // Handlers
  // -------------------------------
  const handleDelete = () => {
    dispatch(removeBar({ trackId: track.id, barId: bar.id }));
    dispatch(deselectSubProcedure());
  };

  const handleClose = () => {
    dispatch(deselectSubProcedure());
  };

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

  // Validation Handlers for Run Reaction inputs
  const validateAmplitude = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num) || num < 0 || num > 10) {
      setAmplitudeError('Amplitude must be between 0 and 10 mm.');
    } else {
      setAmplitudeError('');
    }
    setAmplitude(value);
  };

  const validateRpm = (value: string) => {
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 0 || num > 300 || !Number.isInteger(num)) {
      setRpmError('RPM must be a whole number between 0 and 300.');
    } else {
      setRpmError('');
    }
    setRpm(value);
  };

  const validateTemperature = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num) || num < 0 || num > 150) {
      setTemperatureError('Temperature must be between 0°C and 150°C.');
    } else {
      setTemperatureError('');
      setTemperatureWarning('Please ensure the temperature is in Celsius.');
    }
    setTemperature(value);
  };

  const validateDuration = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num) || num < 10 || num > 300) {
      setDurationError('Duration must be between 10 seconds and 300 seconds.');
    } else {
      setDurationError('');
    }
    setDuration(value);
  };

  // ---------------------------------
  // Calculate total time in seconds
  // Now using 1 tick = 0.9375 seconds
  // ---------------------------------
  const totalTimeSeconds = bar.durationTicks * SECONDS_PER_TICK;

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
        zIndex: 9999,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Top Section */}
      <div>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">Sub-Procedure Details</h3>
          <button
            className="text-red-500 hover:text-red-700"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
          >
            Close
          </button>
        </div>
        <p className="mt-0 text-lg font-bold">{bar.title}</p>
        <p className="mt-0 text-sm text-gray-300">Reactor: {track.title}</p>
      </div>

      {/* Middle Section */}
      {bar.title === 'Dispense Chemicals' && (
        <div
          className="mt-2 flex flex-col items-start"
          style={{ marginLeft: '20rem', marginTop: '-7rem' }}
        >
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

          <div className="w-3/4 flex items-center">
            <label className="block mb-0 mr-1">Total Time (seconds):</label>
            <p className="text-gray-200 text-center">
              {totalTimeSeconds.toFixed(2)} sec
            </p>
          </div>
        </div>
      )}

      {bar.title === 'Run Reaction' && (
  <div
    className="mt-2 flex flex-wrap items-start"
    style={{ marginLeft: '20rem', marginTop: '-7rem' }}
  >
    {/* Shake Amplitude */}
    <div className="mb-4 w-1/2 pr-4">
      <label className="block mb-1">Shake Amplitude (0-10 mm)</label>
      <input
        type="number"
        className="text-black px-4 py-1 rounded"
        value={amplitude}
        onChange={(e) => validateAmplitude(e.target.value)}
      />
      {amplitudeError && (
        <p className="text-yellow-500 text-sm">{amplitudeError}</p>
      )}
    </div>

    {/* Shake Speed */}
    <div className="mb-4 w-1/2 pl-4">
      <label className="block mb-1">Shake Speed (RPM)</label>
      <input
        type="number"
        className="text-black px-4 py-1 rounded"
        value={rpm}
        onChange={(e) => validateRpm(e.target.value)}
      />
      {rpmError && <p className="text-yellow-500 text-sm">{rpmError}</p>}
    </div>

    {/* Temperature */}
    <div className="mb-4 w-1/2 pr-4">
      <label className="block mb-1">Temperature (°C)</label>
      <input
        type="number"
        className="text-black px-4 py-1 rounded"
        value={temperature}
        onChange={(e) => validateTemperature(e.target.value)}
        placeholder="Enter Temperature"
      />
      {temperatureError && (
        <p className="text-yellow-500 text-sm">{temperatureError}</p>
      )}
      {temperatureWarning && (
        <p className="text-yellow-500 text-sm">{temperatureWarning}</p>
      )}
    </div>

    {/* Reaction Duration */}
    <div className="mb-4 w-1/2 pl-4">
      <label className="block mb-1">Reaction Duration (seconds)</label>
      <input
        type="number"
        className="text-black px-4 py-1 rounded"
        value={duration}
        onChange={(e) => validateDuration(e.target.value)}
        placeholder="Duration in seconds"
      />
      {durationError && (
        <p className="text-yellow-500 text-sm">{durationError}</p>
      )}
    </div>
  </div>
)}


      {/* Bottom Section: Delete & ID */}
      <div className="relative">
        <p className="absolute bottom-6 left-1 text-sm text-gray-300">
          ID: {bar.id}
        </p>
        <button
          className="absolute bottom-6 right-1 bg-red-500 text-white px-4 py-2 rounded shadow-md hover:bg-red-600 active:bg-red-700 focus:outline-none"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          style={{
            backgroundColor: '#e53e3e',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          Delete Sub-Procedure
        </button>
      </div>
    </div>
  );
};
