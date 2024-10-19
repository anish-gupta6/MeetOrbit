// roomReducer.js

export const initialState = {
    peers: [],
    streams: []
  };
  
  export const actionTypes = {
    ADD_PEER: 'ADD_PEER',
    REMOVE_PEER: 'REMOVE_PEER',
    ADD_STREAM: 'ADD_STREAM',
    REMOVE_STREAM: 'REMOVE_STREAM',
  };
  
  export const reducer = (state, action) => {
    switch (action.type) {

      case actionTypes.ADD_PEER:
        return { ...state, peers: [...state.peers, action.payload] };

      case actionTypes.REMOVE_PEER:
        return { ...state, peers: state.peers.filter(peer => peer.userId !== action.payload.userId) };

      case actionTypes.ADD_STREAM:
        if (state.streams.some(stream => stream.userId === action.payload.userId)) return state;
        return { ...state, streams: [...state.streams, action.payload] };

      case actionTypes.REMOVE_STREAM:
        return { ...state, streams: state.streams.filter(stream => stream.userId !== action.payload.userId) };

      default:
        return state;
    }
  };
  