import {playerModel} from '@/entities/player';
import {useUnit} from 'effector-react';
import styles from './track-info.module.scss';

export const Duration = () => {
  const {minutes, seconds, total} = useUnit(playerModel.player.stores.$duration);

  return (
    <span className={styles.duration}>
      {total > 0 && (
        <>
          {minutes} : {seconds / 10 >= 1 ? seconds : <>0{seconds}</>}
        </>
      )}
    </span>
  );
};
