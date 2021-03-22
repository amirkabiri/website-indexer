import { emit } from "../events/new-url-to-index";
import addURLToQueue from "../libs/addURLToQueue";

export const ROUTE = 'index';

export default socket => async startPoint => {
  await addURLToQueue(startPoint);
  emit(startPoint);
};