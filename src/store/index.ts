import { configureStore } from '@reduxjs/toolkit';
import playerBarReducer from '../features/daw/player-bar/store/playerBarSlice';
import playlistSlice from '../features/daw/playlist/store/playlist-slice';
import playlistHeaderSlice from '../features/daw/playlist-header/store/playlist-header-slice';
import menuSlice from '../features/daw/menu/store/menu-slice';
import dialogSlice from '../features/daw/dialog/store/dialog-slice';

export const store = configureStore({
  reducer: {
    playerBar: playerBarReducer,
    playlist: playlistSlice,
    playlistHeader: playlistHeaderSlice,
    menu: menuSlice,
    dialog: dialogSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['dialog/pushDialog'],
        ignoredPaths: ['dialog.queue'],
      },
    }),
});

export type RootStore = typeof store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
