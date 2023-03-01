import { attach, combine, createEvent, createStore, sample } from 'effector';
import { Howl } from 'howler';
import { interval } from 'patronum';
import {
  $animeImageUrl,
  $anime,
  $animeUrl,
  $song,
  getTrackInfo,
  resetInfo,
  $trackInfoReceived,
  $duration,
} from './track-info';
import { $volume, changeVolume } from './volume';

const $player = createStore<Howl | null>(null);
const $ready = $player.map((p) => p != null);
const $isPlaying = createStore<boolean>(false);

const initPlayer = createEvent();
const destroyPlayer = createEvent();
const play = createEvent();
const stop = createEvent();
const playStarted = createEvent();
const playStopped = createEvent();

const timerTick = interval({
  start: playStarted,
  stop: playStopped,
  leading: true,
  timeout: 5000,
}).tick;

navigator.mediaSession.setActionHandler('play', () => play());
navigator.mediaSession.setActionHandler('pause', () => stop());
navigator.mediaSession.setActionHandler('stop', () => stop());

const createPlayerFx = attach({
  source: combine({ player: $player, volume: $volume }),
  effect: ({ player, volume }) => {
    if (player == null) {
      const howl: Howl = new Howl({
        src: 'https://pool.anison.fm/AniSonFM(320)',
        html5: true,
        preload: false,
        volume,
        pool: 1,
        format: ['mpeg'],
      });

      howl.on('play', () => playStarted());
      howl.on('pause', () => playStopped());
      howl.on('stop', () => playStopped());

      return howl;
    }
  },
});

const destroyPlayerFx = attach({
  source: $player,
  effect: (player) => {
    if (player != null) {
      player.unload();
    }
  },
});

const playPlayerFx = attach({
  source: $player,
  effect: (player) => {
    if (player != null) {
      player.play();
    }
  },
});

const stopPlayerFx = attach({
  source: $player,
  effect: (player) => {
    if (player != null) {
      player.stop();
    }
  },
});

const changeVolumeInPlayerFx = attach({
  source: $player,
  effect: (player, volume: number) => {
    if (player != null) {
      player.volume(volume);
    }
  },
});

$player.on(createPlayerFx.doneData, (_, player) => player);
$player.reset(destroyPlayerFx.done);

sample({
  source: initPlayer,
  target: createPlayerFx,
});

sample({
  source: destroyPlayer,
  target: destroyPlayerFx,
});

sample({
  source: $volume,
  target: changeVolumeInPlayerFx,
});

sample({
  clock: play,
  target: playPlayerFx,
});

sample({
  clock: play,
  fn: () => true,
  target: $isPlaying,
});

sample({
  clock: stop,
  target: stopPlayerFx,
});

sample({
  clock: playStopped,
  fn: () => false,
  target: $isPlaying,
});

sample({
  clock: timerTick,
  target: getTrackInfo,
});

sample({
  clock: playStopped,
  target: resetInfo,
});

export const stores = {
  $isPlaying,
  $ready,
  $volume,
  $song,
  $anime,
  $animeImageUrl,
  $animeUrl,
  $trackInfoReceived,
  $duration,
};

export const events = {
  play,
  stop,
  initPlayer,
  destroyPlayer,
  changeVolume,
};
