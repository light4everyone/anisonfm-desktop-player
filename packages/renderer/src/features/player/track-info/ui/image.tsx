import {playerModel} from '@/entities/player';
import {useUnit} from 'effector-react';
import styles from './track-info.module.scss';

export const Image = () => {
  const [trackInfoReceived, animeImageUrl] = useUnit([
    playerModel.player.stores.$trackInfoReceived,
    playerModel.player.stores.$animeImageUrl,
  ]);

  return (
    <>
      {trackInfoReceived && (
        <img
          className={styles.image}
          src={animeImageUrl}
        />
      )}
    </>
  );
};
