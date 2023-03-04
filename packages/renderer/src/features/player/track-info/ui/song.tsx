import {playerModel} from '@/entities/player';
import {useUnit} from 'effector-react';
import styles from './track-info.module.scss';

export const Song = () => {
  const [trackInfoReceived, animeUrl, anime, song] = useUnit([
    playerModel.player.stores.$trackInfoReceived,
    playerModel.player.stores.$animeUrl,
    playerModel.player.stores.$anime,
    playerModel.player.stores.$song,
  ]);

  return (
    <>
      {trackInfoReceived && (
        <a
          href={animeUrl}
          target="_blank"
          className={styles['track-title']}
        >
          {anime}
          <br />
          {song}
        </a>
      )}
    </>
  );
};
