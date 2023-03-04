import type {ReactNode} from 'react';
import { useEffect, useRef, useState} from 'react';
import {PlayButton} from '@/features/player/play-button';
import styles from './player.module.scss';
import clsx from 'clsx';
import {createGate, useGate} from 'effector-react';
import {playerModel} from '@/entities/player';
import type {Event} from 'effector';
import { sample} from 'effector';
import {Volume} from '@/features/player/volume';
import {Duration, Image, Song} from '@/features/player/track-info';

const pageGate = createGate();

sample({
  clock: pageGate.open as Event<void>,
  target: playerModel.player.events.initPlayer,
});

sample({
  clock: pageGate.close as Event<void>,
  target: playerModel.player.events.destroyPlayer,
});

export const Player = () => {
  // TODO: useUnit doesn't work
  const isReady = useState(playerModel.player.stores.$ready);

  useGate(pageGate);

  return isReady ? (
    <PlayerContainer>
      <Image />
      <Song />
      <PlayButton />
      <Duration />
      <Volume />
    </PlayerContainer>
  ) : null;
};

const PlayerContainer = ({children}: {children: ReactNode}) => {
  const [hidePlayer, resetTimer] = useHidePlayerCountdownTimer(5000);

  return (
    <div
      className={clsx(styles.player, {[styles.hide]: hidePlayer})}
      onMouseOver={resetTimer}
    >
      {children}
    </div>
  );
};

const useHidePlayerCountdownTimer = (interval: number) => {
  const [hidePlayer, setHidePlayer] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>();

  const resetTimer = () => {
    setHidePlayer(false);

    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(() => {
      setHidePlayer(true);
    }, interval);
  };

  useEffect(() => {
    timer.current = setTimeout(() => {
      setHidePlayer(true);
    }, interval);

    return () => {
      resetTimer();
    };
  }, []);

  return [hidePlayer, resetTimer] as const;
};
