import {VolumeOff} from './volume-off-icon';
import {VolumeUp} from './volume-up-icon';

import styles from './mute-button.module.scss';
import clsx from 'clsx';

import {playerModel} from '@/entities/player';
import {useUnit} from 'effector-react';

export const MuteButton = () => {
  const [isMuted, mute, unmute] = useUnit([
    playerModel.player.stores.$mute,
    playerModel.player.events.mute,
    playerModel.player.events.unmute,
  ]);

  const toggle = () => {
    if (isMuted) {
      unmute();
    } else {
      mute();
    }
  };

  return (
    <div
      className={clsx(styles['mute-button'], {[styles.muted]: isMuted})}
      onClick={toggle}
    >
      {isMuted ? <VolumeOff /> : <VolumeUp />}
    </div>
  );
};
