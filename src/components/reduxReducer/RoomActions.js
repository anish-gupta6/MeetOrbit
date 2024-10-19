// roomActions.js

import { actionTypes } from './RoomReducer';

export const addPeer = (peer, userId) => ({
  type: actionTypes.ADD_PEER,
  payload: { peer, userId },
});

export const removePeer = (userId) => ({
  type: actionTypes.REMOVE_PEER,
  payload: { userId },
});

export const addStream = (stream, userId) => ({
  type: actionTypes.ADD_STREAM,
  payload: { userId, stream },
});

export const removeStream = (userId) => ({
  type: actionTypes.REMOVE_STREAM,
  payload: { userId },
});

