import { createEvent, createStore, sample } from 'effector';
import { interval, condition, debounce } from 'patronum';


const total = createStore(0);

export const setDuration = createEvent<number>();
const startTimer = createEvent();
const stopTimer = createEvent();

const timer = interval({
  start: startTimer,
  stop: stopTimer,
  timeout: 1000,
});

total.on(setDuration, (_, total) => total);

condition({
  source: debounce({source: total, timeout: 500}),
  if: total => total > 0,
  then: startTimer,
  else: stopTimer,
});

sample({
  clock: timer.tick,
  source: total,
  fn: (total) => total - 1,
  target: setDuration
});

export const $duration = sample({
  source: total,
  fn: (total) => ({
    total,
    seconds: total % 60,
    minutes: (total - (total % 60)) / 60
  })
});
