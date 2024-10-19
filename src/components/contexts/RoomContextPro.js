import React,{useContext,createContext, useEffect, useState, useRef, useCallback} from 'react';
import { useSocket } from './SocketProvider'
import Peer from 'peerjs';
import {useToast} from '../../ToastService'
import { useNavigate } from 'react-router-dom';

const MeetingContext = createContext(null);

const RoomContextPro = ({children}) => {

  const { socket } = useSocket();
  const navigate = useNavigate();
  const mediaStreamRef = useRef(null);
  const peersRef = useRef([]);
  // const peerRef = useRef(null);
  const [streams, setStreams] = useState([]);
  const [isMicOn, setIsMicOn] = useState(true); 
  const [isVideoOn, setIsVideoOn] = useState(true); 
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [meetingDetails, setMeetingDetails] = useState({});
  const [userInfo, setUserInfo] = useState({});
  const [userName, setUserName] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantOpen, setIsParticipantOpen] = useState(false);
  const [meetingId, setMeetingId] = useState('');
  const [meetingPassword, setMeetingPassword] = useState('');
  const [me, setMe] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  // const [screenShareStream, setScreenShareStream] = useState(null);
  const screenShareRef = useRef(null);
  const currentStreamRef = useRef(null);
  const [isConnected,setIsConnected] = useState(false);
  // const [pinnedStream, setPinnedStream] = useState({}); // Add this state



  const {notifyWarning,notifyError} = useToast()



  const handleOpenChat = () => {
    if (isParticipantOpen) setIsParticipantOpen(prev => !prev);
    setIsChatOpen(prev => !prev);
  };

  const handleOpenParticipant = () => {
    if (isChatOpen) setIsChatOpen(prev => !prev);
    setIsParticipantOpen(prev => !prev);
  };

  const handleVideoClick = () => {
    const newVideoStatus = !isVideoOn;
  setIsVideoOn(newVideoStatus);
    setStreams(prevStreams =>
      prevStreams.map(stream => 
        stream.userId === me ? { ...stream, videoStatus: newVideoStatus } : stream
      )
    );

    socket.emit('video-status-change', { meetingId, userId: me, videoStatus: newVideoStatus });
    
  };
  
  const handleMicClick = () => {
    const newMicStatus = !isMicOn;
    setIsMicOn(newMicStatus);
    setStreams(prevStreams =>
      prevStreams.map(stream => 
        stream.userId === me ? { ...stream, micStatus: newMicStatus } : stream
      )
    );

    socket.emit('mic-status-change', { meetingId, userId: me, micStatus: newMicStatus });
  };

  const handleMeetingEnd = () =>{
    console.log('123')
    socket.emit('end-meeting',{meetingId,userId:me});
  }

  
  // const stopMediaAndNavigate = (path) => {
  //   if (mediaStreamRef.current) {
  //     mediaStreamRef.current.getTracks().forEach(track => track.stop());
  //   }
  //   navigate(path);
  // };
  const stopMedia = () => {
    if (mediaStreamRef.current && currentStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current=null;
      currentStreamRef.current=null;
      return true
    }
    return false
  };


  const handleLeaveMeeting = () =>{
    socket.disconnect();
    notifyWarning('You left the Meeting !!!');
    // stopMediaAndNavigate('/')
    const mediaStopped = stopMedia();
    if(mediaStopped){
      navigate('/')
    }
  }

  

  const handleSendMessage = (message) => {
    if (message.trim()) {
      socket.emit('send-message', { meetingId, userId:me, userName, message });
    }
  };







  // handle add stream
  const handleAddStream = useCallback((stream,userId,userName,colorId,micStatus,videoStatus) =>{
    setStreams(prevStreams => {
      if (prevStreams.some(stream => stream.userId === userId)) return prevStreams;
        return [...prevStreams, { userId,userName,colorId,micStatus,videoStatus,stream}];
      });
      return
  },[])

  // handle peer open
  const handlePeerOpen = useCallback((id,stream) =>{
    console.log('Peer ID:', id);
    setMe(id);
    socket.emit('join-room', { meetingId, meetingPassword, userId: id, userName, colorId:userInfo.colorId,micStatus:isMicOn,videoStatus:isVideoOn, isHost: true });
    handleAddStream(stream,id,userName,userInfo.colorId,isMicOn,isVideoOn)
  },[socket, meetingId, meetingPassword]);

  
  const handleSocketDisconnect = (userId) =>{
    const peerObj = peersRef.current.find(({ userId: id }) => id === userId);
        if (peerObj) {
          peerObj.peer.close();
          peersRef.current = peersRef.current.filter(({ userId: id }) => id !== userId);
          setStreams(prevStreams => prevStreams.filter(stream => stream.userId !== userId));
        }
        
  }

// Start screen sharing
const handleStartScreenShare = async () => {
  try {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    screenShareRef.current = screenStream;
    setIsScreenSharing(true);
    currentStreamRef.current = screenStream;

    // // Set the screen sharing stream as pinned
    // setPinnedStream(screenStream);
    socket.emit('screen-share-start',{meetingId,userId:me})

    // Replace video track with screen share track in all peer connections
    peersRef.current.forEach(({ peer }) => {
      const sender = peer.peerConnection.getSenders().find(sender => sender.track.kind === 'video');
      if (sender) sender.replaceTrack(screenStream.getVideoTracks()[0]);
    });

    screenStream.getVideoTracks()[0].onended = () => {
      handleStopScreenShare();
    };

  } catch (err) {
    console.error('Error sharing screen:', err);
  }
};

// Stop screen sharing and revert to camera
const handleStopScreenShare = () => {
  if (!screenShareRef.current) return;

  setIsScreenSharing(false);
  currentStreamRef.current = mediaStreamRef.current;

  // Reset the pinned stream when screen sharing stops
  // setPinnedStream(null);
  socket.emit('screen-share-stop',{meetingId,userId:me})

  // Replace screen share track with user's video track in all peer connections
  peersRef.current.forEach(({ peer }) => {
    const sender = peer.peerConnection.getSenders().find(sender => sender.track.kind === 'video');
    if (sender && mediaStreamRef.current) {
      sender.replaceTrack(mediaStreamRef.current.getVideoTracks()[0]);
    }
  });

  screenShareRef.current.getTracks().forEach(track => track.stop());
  screenShareRef.current = null;
};





useEffect(()=>{
  if(screenShareRef.current){
  screenShareRef.current.getVideoTracks()[0].onended = () => {
    handleStopScreenShare();
  };
}
},[screenShareRef.current])

  // useEffect(()=>{
  //   const peer = new Peer();
  //   peerRef.current=peer;
  // },[])
  
  useEffect(() => {
      const peer = new Peer();
      
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      mediaStreamRef.current = stream;
      currentStreamRef.current = stream;
      // setCurrentVideoStream(stream);

      peer.on('open', (id) => handlePeerOpen(id,currentStreamRef.current));

      socket.on('user-connected', (data) => {
        console.log('User connected:', data.userId);

        if (data.userId === peer.id) return; 

        const call = peer.call(data.userId, currentStreamRef.current,{
          metadata: {
            userId: peer.id,
            userName,
            colorId: userInfo.colorId,
            micStatus: isMicOn,
            videoStatus: isVideoOn
          }
        });

        if (!call) {
          console.error('Failed to establish call with user:', data.userId);
          return;
        }

        call.on('stream', (userStream) => handleAddStream(userStream, data.userId, data.userName, data.colorId, data.micStatus, data.videoStatus));

        call.on('close', () => {
          setStreams(prevStreams => prevStreams.filter(stream => stream.userId !== data.userId));
        });

        peersRef.current.push({ peer: call, userId:data.userId });
      });

      peer.on('call', (call) => {
        
        if (call.peer === peer.id) return
    
        call.answer(currentStreamRef.current);
        const { userId, userName, colorId, micStatus, videoStatus } = call.metadata || {};

        call.on('stream', (userStream) => handleAddStream(userStream, userId, userName, colorId, micStatus, videoStatus));

        call.on('close', () => {
          setStreams(prevStreams => prevStreams.filter(stream => stream.userId !== call.peer));
        });

        peersRef.current.push({ peer: call, userId: call.peer });
      });

      
      socket.off('meeting-ended');
      socket.on('meeting-ended',()=>{
        notifyError('Meeting Ended !!');
        const mediaStopped = stopMedia();
        if(mediaStopped){
          navigate('/')
        }
      });

      socket.on('video-status-changed', ({ userId, videoStatus }) => {
        setStreams(prevStreams =>
          prevStreams.map(stream => 
            stream.userId === userId ? { ...stream, videoStatus } : stream
          )
        );
      });
      socket.on('mic-status-changed', ({ userId, micStatus }) => {
        setStreams(prevStreams =>
          prevStreams.map(stream => 
            stream.userId === userId ? { ...stream, micStatus } : stream
          )
        );
      });

      socket.on('user-disconnected', (userId) => handleSocketDisconnect(userId));

    }).catch((err) => {
      console.error('Error accessing media devices:', err);
    });
    

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      peer.destroy();
      peersRef.current.forEach(({ peer }) => peer.close());
      peersRef.current = [];
      socket.off('joined-room');
      socket.off('user-connected');
      socket.off('user-disconnected');
      socket.off('meeting ended');
      socket.off('video-status-changed');
      socket.off('mic-status-changed');
    };
  // }
  }, [meetingId, meetingPassword, socket]);


  useEffect(() => {
    if (mediaStreamRef.current) {
      const stream = mediaStreamRef.current;
      stream.getAudioTracks().forEach(track => track.enabled = isMicOn);
      stream.getVideoTracks().forEach(track => track.enabled = isVideoOn);
    }
  }, [isMicOn,isVideoOn]);
  useEffect(() => {
    if (mediaStreamRef.current) {
      const stream = mediaStreamRef.current;
      stream.getAudioTracks().forEach(track => track.enabled = isMicOn);
      // stream.getVideoTracks().forEach(track => track.enabled = isVideoOn);
    }
  }, []);



  const roomStates = {
    socket,
    me,
    streams,
    isMicOn,
    isVideoOn,
    isHovered,
    isVisible,
    meetingDetails,
    userInfo,
    userName,
    isChatOpen,
    isParticipantOpen,
    meetingId,
    meetingPassword,
    chatHistory,
    participants,
    isScreenSharing
  }

  const setRoomStates = {
    setStreams,
    setIsMicOn,
    setIsVideoOn,
    setIsHovered,
    setIsVisible,
    setMeetingDetails,
    setUserInfo,
    setUserName,
    setIsChatOpen,
    setIsParticipantOpen,
    setMeetingId,
    setMeetingPassword,
    setChatHistory,
    setParticipants
  }

  const roomHandlers = {
    handlePeerOpen,
    handleMeetingEnd,
    handleLeaveMeeting,
    handleAddStream,
    handleSocketDisconnect,
    handleOpenChat,
    handleOpenParticipant,
    handleMicClick,
    handleVideoClick,
    handleSendMessage,
    handleStartScreenShare,
    handleStopScreenShare,
    stopMedia
  }


  return (
    <MeetingContext.Provider value={{roomHandlers,roomStates,setRoomStates}}>
      {children}
    </MeetingContext.Provider>
  )
}

export default RoomContextPro

export const useRoomContext=()=>{
  return useContext(MeetingContext)
}