import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProjectTitle } from '../../store/menu-slice';
import { selectTracks } from '../../../playlist/store/selectors';
import { TrackColor } from '../../../../../model/track/track-color';  // Import TrackColor type

// Simplified readJSONFile utility if needed
const readJSONFile = (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = JSON.parse(event.target?.result as string);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
};

// Define ExportData type if it doesn't exist
export type ExportData = {
  project_title: string;
  version: string;
  tracks: { id: string; title?: string; color?: string; volume?: number; bars?: any[] }[]; // Adjust based on actual track structure
};

const importVersion1 = (data: ExportData) => {
  return data;
};

const importByVersion = {
  'auto_synth/1.0.0': importVersion1,
};

const parseData = (json: unknown) => {
  if (!json) {
    throw new Error('Invalid project file');
  }

  const data = json as ExportData;
  const allowedVersions = Object.keys(importByVersion);
  if (!allowedVersions.includes(data.version)) {  // Fixed includes syntax
    throw new Error(
      `Invalid version of the project file, it should be one of ${allowedVersions
        .map((v) => `"${v}"`)
        .join(', ')}`
    );
  }

  const dataVersion = data.version as keyof typeof importByVersion;
  return importByVersion[dataVersion](data);
};

// Function to check if a color is valid
const isValidColor = (color: string): color is TrackColor => {
  const validColors: TrackColor[] = ['blue', 'green', 'red', 'yellow', 'pink', 'cyan', 'purple', 'orange', 'grey'];
  return validColors.includes(color as TrackColor);
};

export const useImport = () => {
  const dispatch = useDispatch();
  const tracks = useSelector(selectTracks);  // This will hold your 3 existing reactors

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [exportData, setExportData] = useState<ExportData | null>(null);

  const executeImportProject = useCallback(
    async (file: File) => {
      setIsLoading(true);

      try {
        const fileContent = await readJSONFile(file);
        const data = parseData(fileContent);
        setExportData(data);

        dispatch(setProjectTitle(data.project_title));

        // Assuming you only want to update existing reactors, match the imported tracks to the current reactors:
        data.tracks.forEach((importedTrack) => {
          const reactorToUpdate = tracks.find((reactor) => reactor.id === importedTrack.id);

          if (reactorToUpdate) {
            // Update existing reactor with imported data
            reactorToUpdate.title = importedTrack.title || reactorToUpdate.title;

            // Validate color before assigning it
            if (importedTrack.color && isValidColor(importedTrack.color)) {
              reactorToUpdate.color = importedTrack.color as TrackColor;
            }

            reactorToUpdate.volume = importedTrack.volume || reactorToUpdate.volume;
            reactorToUpdate.bars = importedTrack.bars || reactorToUpdate.bars;
          }
        });
      } catch (error) {
        setIsError(true);
        if (error instanceof Error) {
          setErrorMessage(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, tracks]
  );

  return {
    isLoading,
    executeImportProject,
    exportData,
    isError,
    errorMessage,
  };
};
