import {getStatus} from '@/shared/api/anison-status.api';
import {createEffect, createEvent, createStore, sample} from 'effector';
import {reset, spread} from 'patronum';
import {statusMapper} from '../lib/status-mapper';
import {setDuration} from './duration';

export {$duration} from './duration';

export interface Status {
  duration: number;
  anime: string;
  song: string;
  animeUrl: string;
  posterUrl: string;
}

export const $song = createStore<string>('');
export const $anime = createStore<string>('');
export const $animeImageUrl = createStore<string>('');
export const $animeUrl = createStore<string>('');
export const $trackInfoReceived = createStore<boolean>(false);

export const resetInfo = createEvent();
export const getTrackInfo = createEvent();

const getStatusFx = createEffect(async () => {
  const response = await getStatus();

  const status = statusMapper(response);

  return status;
});

reset({
  clock: resetInfo,
  target: [$song, $anime, $animeImageUrl, $animeUrl, $trackInfoReceived],
});

sample({
  clock: resetInfo,
  fn: () => 0,
  target: setDuration,
});

sample({
  clock: getTrackInfo,
  target: getStatusFx,
});

sample({
  clock: getStatusFx.doneData,
  fn: () => true,
  target: $trackInfoReceived,
});

spread({
  source: getStatusFx.doneData,
  targets: {
    duration: setDuration,
    song: $song,
    anime: $anime,
    posterUrl: $animeImageUrl,
    animeUrl: $animeUrl,
  },
});
