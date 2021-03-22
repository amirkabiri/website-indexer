import { EventEmitter } from 'events'
const event = new EventEmitter;

export default event;
export const KEY = 'new-url-to-index';
export const emit = (...args) => event.emit(KEY, ...args);
export const subscribe = fn => {
  event.addListener(KEY, fn);

  return () => event.removeListener(KEY, fn);
}