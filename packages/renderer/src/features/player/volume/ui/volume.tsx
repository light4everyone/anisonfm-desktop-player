import { playerModel } from '@/entities/player';
import { useUnit } from 'effector-react';
import styles from './volume.module.scss';

export const Volume = () => {
  const [volume, changeVolume] = useUnit([
    playerModel.player.stores.$volume,
    playerModel.player.events.changeVolume,
  ]);

  return (
    <input
      className={styles.volume}
      type="range"
      id="volume"
      name="volume"
      onChange={(event) => changeVolume(+event.target.value)}
      min="0.00"
      max="0.5"
      step="0.02"
      value={volume}
    />
  );
};
