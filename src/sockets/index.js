import { emit } from "../events/new-url-to-index";
import addURLToQueue from "../libs/addURLToQueue";

export const ROUTE = 'index';

export default socket => async startPoint => {
  await addURLToQueue(startPoint, {
    priority: 2,
    depth: 2,
  });
  emit(startPoint);
};