import { Player } from './player/player'

export const PlayerBar = () => {
  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex-3 flex-grow">
        <Player />
      </div>
    </div>
  )
}
