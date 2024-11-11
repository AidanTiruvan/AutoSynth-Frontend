import { Track } from '../../../../../../model/track/track'
import { useState } from 'react'

export type TrackItemNameVolumeProps = {
  track: Track
  isRenaming: boolean
  setIsRenaming: (isRenaming: boolean) => void
}

export const TrackItemNameVolume = ({
  track,
  isRenaming,
  setIsRenaming,
}: TrackItemNameVolumeProps) => {
  const [trackName, setTrackName] = useState(track.title)

  return (
    <div className="flex-grow flex flex-col px-4 py-2">
      <div className="h-[50%]">
        {isRenaming ? (
          <input
            type="text"
            className="w-full p-1 mt-1 bg-zinc-200 dark:bg-zinc-800"
            value={trackName}
            autoFocus
            onBlur={() => {
              setIsRenaming(false)
            }}
            onChange={(e) => setTrackName(e.target.value)}
          />
        ) : (
          <span className="select-none font-bold text-sm">{track.title}</span>
        )}
      </div>
    </div>
  )
}
