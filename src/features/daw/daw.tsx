import { Dialog } from './dialog/dialog';
import { Menu } from './menu/menu';
import { PlayerBar } from './player-bar/player-bar';
import { PlaylistHeader } from './playlist-header/playlist-header';
import { Playlist } from './playlist/playlist';
import { BottomPanel } from './playlist/bottom-panel'; // New component

export const DAW = () => {
  return (
    <main
      className="flex flex-col h-screen bg-white text-black dark:bg-black dark:text-white py-2"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="px-2 pb-1">
        <Menu />
      </div>

      <div className="px-2 pb-2">
        <PlayerBar />
      </div>

      <div className="px-2">
        <PlaylistHeader />
      </div>

      <div className="flex flex-grow overflow-y-auto px-2">
        <Playlist />
      </div>

      {/* Render the bottom panel */}
      <BottomPanel />

      <Dialog />
    </main>
  );
};
