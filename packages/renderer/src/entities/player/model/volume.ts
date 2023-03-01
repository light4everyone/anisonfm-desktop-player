import { createStore, createEvent, createEffect, sample } from 'effector';

export const $volume = createStore<number>(
  +(localStorage.getItem('volume') ?? 0)
);

export const changeVolume = createEvent<number>();

const saveVolumeFx = createEffect((volume: number) => {
  localStorage.setItem('volume', volume.toString());
});

$volume.on(changeVolume, (_, v) => v);

sample({
  source: $volume,
  target: saveVolumeFx,
});
