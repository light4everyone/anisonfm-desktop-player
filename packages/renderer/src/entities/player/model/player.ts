import {attach, combine, createEvent, createStore, sample} from 'effector';
import {Howl} from 'howler';
import {interval} from 'patronum';
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
import {$volume, changeVolume} from './volume';

const initPlayer = createEvent();
const destroyPlayer = createEvent();
const play = createEvent();
const stop = createEvent();
const pause = createEvent();
const playStarted = createEvent();
const playStopped = createEvent();
const playPaused = createEvent();
const mute = createEvent();
const unmute = createEvent();

const $player = createStore<Howl | null>(null);
const $ready = $player.map(p => p != null);

const $isPlaying = createStore<boolean>(false)
 .on([playPaused, playStopped], () => false)
 .on(play, () => true);

const $mute = createStore<boolean>(false)
  .on(mute, () => true)
  .on(unmute, () => false);

const timerTick = interval({
  start: playStarted,
  stop: playStopped,
  leading: true,
  timeout: 5000,
}).tick;

navigator.mediaSession.setActionHandler('play', () => play());
navigator.mediaSession.setActionHandler('pause', () => pause());
navigator.mediaSession.setActionHandler('stop', () => stop());

const createPlayerFx = attach({
  source: combine({player: $player, volume: $volume}),
  effect: ({player, volume}) => {
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
      howl.on('pause', () => playPaused());
      howl.on('stop', () => playStopped());

      return howl;
    }
  },
});

const destroyPlayerFx = attach({
  source: $player,
  effect: player => {
    if (player != null) {
      player.unload();
    }
  },
});

const playPlayerFx = attach({
  source: $player,
  effect: player => {
    if (player != null) {
      player.play();
    }
  },
});

const stopPlayerFx = attach({
  source: $player,
  effect: player => {
    if (player != null) {
      player.stop();
    }
  },
});

const pausePlayerFx = attach({
  source: $player,
  effect: player => {
    if (player != null) {
      player.pause();
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

const muteFx = attach({
  source: $player,
  effect: player => {
    if (player != null) {
      player.mute(true);
    }
  },
});

const unmuteFx = attach({
  source: $player,
  effect: player => {
    if (player != null) {
      player.mute(false);
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
  clock: stop,
  target: stopPlayerFx,
});

sample({
  clock: pause,
  target: pausePlayerFx,
});

sample({
  clock: timerTick,
  target: getTrackInfo,
});

sample({
  clock: playStopped,
  target: resetInfo,
});

sample({
  clock: mute,
  target: muteFx,
});

sample({
  clock: unmute,
  target: unmuteFx,
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
  $mute,
};

export const events = {
  play,
  stop,
  initPlayer,
  destroyPlayer,
  changeVolume,
  mute,
  unmute,
};
