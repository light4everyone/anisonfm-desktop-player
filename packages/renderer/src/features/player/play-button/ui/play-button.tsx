import {Play} from './play-icon';
import {Stop} from './stop-icon';
import {playerModel} from '@/entities/player';

import styles from './play-button.module.scss';
import {useUnit} from 'effector-react';

export const PlayButton = () => {
  const [isPlaying, stop, play] = useUnit([
    playerModel.player.stores.$isPlaying,
    playerModel.player.events.stop,
    playerModel.player.events.play,
  ]);

  const toggle = () => {
    if (isPlaying) {
      stop();
    } else {
      play();
    }
  };

  return (
    <div
      className={styles['play-button']}
      onClick={toggle}
    >
      <div className={styles.background}></div>

      <div className={styles['icon-container']}>
        {isPlaying ? (
          <Stop></Stop>
        ) : (
          <div className={styles['play-icon']}>
            <Play></Play>
          </div>
        )}
      </div>
    </div>
  );
};
