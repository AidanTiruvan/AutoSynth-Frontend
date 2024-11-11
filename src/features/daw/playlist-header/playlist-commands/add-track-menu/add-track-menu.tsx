import { useDispatch } from 'react-redux';
import { addSubProcedure } from '../../../playlist/store/playlist-slice';

export type AddTrackMenuProps = {
  onClose: () => void;
  trackId: string;
  lastEndTick: number; // New prop to indicate the last end position of a sub-procedure
};

type MenuItem = {
  label: string;
  color: string;
};

export const AddTrackMenu = ({ onClose, trackId, lastEndTick }: AddTrackMenuProps) => {
  const dispatch = useDispatch();

  const menuItems: MenuItem[] = [
    { label: 'Dispense Chemicals', color: '#9b59b6' },
    { label: 'Transfer Liquid', color: '#f1c40f' },
    { label: 'Liquid Liquid Extraction', color: '#3498db' },
    { label: 'Move Vial', color: '#2ecc71' },
    { label: 'Run Reaction', color: '#e74c3c' },
  ];

  const handleAddSubProcedure = (item: MenuItem) => {
    const subProcedure = {
      id: Date.now().toString(),
      title: item.label,
      startAtTick: lastEndTick, // Set start position based on last end position
      durationTicks: 32,
      color: item.color,
    };

    dispatch(addSubProcedure({ trackId, subProcedure }));
    onClose();
  };

  return (
    <div
      className="w-52 flex flex-col bg-zinc-200 dark:bg-zinc-900 shadow-md shadow-zinc-600 rounded-xl overflow-hidden"
      style={{
        zIndex: 1000,
        position: 'relative',
      }}
    >
      {menuItems.map((item, index) => (
        <div
          key={index}
          className="p-2 hover:bg-opacity-75 cursor-pointer flex flex-row gap-2 items-center rounded-lg"
          style={{ backgroundColor: item.color }}
          onClick={() => handleAddSubProcedure(item)}
        >
          <p className="font-bold text-white text-xl">{item.label}</p>
        </div>
      ))}
    </div>
  );
};
