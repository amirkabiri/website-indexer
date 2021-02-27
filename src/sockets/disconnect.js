export const ROUTE = 'disconnect';

export default socket => reason => {
  console.log('socket disconnected', socket.id, reason)
}