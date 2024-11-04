import React, { createContext, useMemo, useContext, useEffect } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);


let socket;
export const getSocket = () => {
  if (!socket) {
    socket = io.connect("http://localhost:5000");
  }
  return socket;
};


export const SocketProvider = (props) => {
  const endPoint = 'http://localhost:5000';
  // const endPoint = 'meetorbit.chendurph.com';

  const socket = useMemo(() => getSocket(), []);
  console.log(socket)
  // const socket = useMemo(() => io.connect("http://localhost:3001"), []);
  // useEffect(() => {
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [socket]);

  return (
    <SocketContext.Provider value={{socket,endPoint}}>
      {props.children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
