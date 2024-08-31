import React, { useState, useEffect, useRef } from 'react';
import { PiGridNineFill, PiMicrophone, PiMicrophoneSlash, PiVideoCamera, PiVideoCameraSlash, PiUsersThree, PiChats, PiDotsThreeCircle, PiMonitorArrowUpFill, PiShieldCheckFill } from "react-icons/pi";
import { TbWindowMinimize } from "react-icons/tb";
import { ImPhoneHangUp } from "react-icons/im";
import { useLocation } from 'react-router-dom';
import './Room.css';
import { useSocket } from '../../components/contexts/SocketProvider';
import Peer from 'peerjs';
import ChatBox from '../../components/chatBox/ChatBox';
import ParticipantBox from '../../components/participantsBox/ParticipantBox';

const Room = () => {
  const { socket } = useSocket();
  const [isMicOn, setIsMicOn] = useState(false); // Start with mic muted
  const [isVideoOn, setIsVideoOn] = useState(true); // Video initially on
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [meetingDetails, setMeetingDetails] = useState({});
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const meetingId = queryParams.get('id');
  // const { roomId, meetingPassword } = location.state;
  const roomId = '08883738030';
  const meetingPassword='a983ko'

  const myVideoRef = useRef();
  const userVideoRefs = useRef({});
  const peersRef = useRef([]);
  const mediaStreamRef = useRef(null);

  // useEffect(() => {
  //   setMeetingDetails(location.state.meetingDetails);
  // }, [location.state.meetingDetails]);

  const handleVideoClick = () => {
    setIsVideoOn(prev => !prev);
    // const videoTrack = mediaStreamRef.current.getVideoTracks()[0];
    // videoTrack.enabled = !videoTrack.enabled;
    // setIsVideoOn(videoTrack.enabled);
  };
  
  const handleMicClick = () => {
    // setIsMicOn(prev => !prev);
    setIsMicOn(!isMicOn);
    // mediaStreamRef.current.getAudioTracks().forEach(track => track.enabled = isMicOn);
    
  };
  

  useEffect(() => {
    let timeOut;
    if (isHovered) {
      setIsVisible(true);
      if (timeOut) clearTimeout(timeOut);
    } else {
      timeOut = setTimeout(() => {
        setIsHovered(false);
        setIsVisible(false);
      }, 3500);
    }
    return () => clearTimeout(timeOut);
  }, [isHovered]);

  const handleMouseMove = () => {
    setIsHovered(true);
    setTimeout(() => setIsHovered(false), 2000);
  };

  const sendMessage = () => socket.emit('message', { message: 'hello users', roomId });

  useEffect(() => {
    socket.on('alert', (data) => {
      alert(data.message);
    });
  }, [socket]);

  useEffect(() => {
    const peer = new Peer();

    
    navigator.mediaDevices.getUserMedia({ video: isVideoOn, audio: isMicOn }).then((stream) => {
      mediaStreamRef.current = stream;
      myVideoRef.current.srcObject = stream;

      peer.on('open', (id) => {
        console.log('Peer ID:', id);
        socket.emit('join-room', { roomId: meetingId, password: meetingPassword, userId: id });
      });

      socket.on('user-connected', (userId) => {
        console.log('User connected:', userId);

        if (userId === peer.id) {
          console.log('Ignoring self-call');
          return; // Avoid calling yourself
        }

        const call = peer.call(userId, stream);

        if (!call) {
          console.error('Failed to establish call with user:', userId);
          return;
        }

        call.on('stream', (userStream) => {
          if (!userVideoRefs.current[userId]) {
            userVideoRefs.current[userId] = document.createElement('video');
            userVideoRefs.current[userId].autoPlay = true;
            userVideoRefs.current[userId].playsInline = true;
            userVideoRefs.current[userId].muted = true;
            document.querySelector('.video-container').append(userVideoRefs.current[userId]);
          }

          userVideoRefs.current[userId].srcObject = userStream;
          setTimeout(() => {
            userVideoRefs.current[userId].play().catch((err) => {
              console.error('Video play failed:', err);
            });
          }, 100);
        });

        call.on('close', () => {
          if (userVideoRefs.current[userId]) {
            userVideoRefs.current[userId].remove();
            delete userVideoRefs.current[userId];
          }
        });

        peersRef.current.push({ peer: call, userId });
      });

      peer.on('call', (call) => {
        if (call.peer === peer.id) {
          console.log('Ignoring self-call');
          return; // Avoid answering your own call
        }
        call.answer(stream);

        call.on('stream', (userStream) => {
          if (!userVideoRefs.current[call.peer]) {
            userVideoRefs.current[call.peer] = document.createElement('video');
            userVideoRefs.current[call.peer].autoPlay = true;
            userVideoRefs.current[call.peer].playsInline = true;
            userVideoRefs.current[call.peer].muted = true;
            document.querySelector('.video-container').append(userVideoRefs.current[call.peer]);
          }

          userVideoRefs.current[call.peer].srcObject = userStream;
          setTimeout(() => {
            userVideoRefs.current[call.peer].play().catch((err) => {
              console.error('Video play failed:', err);
            });
          }, 100);
        });

        call.on('close', () => {
          if (userVideoRefs.current[call.peer]) {
            userVideoRefs.current[call.peer].remove();
            delete userVideoRefs.current[call.peer];
          }
        });

        peersRef.current.push({ peer: call, userId: call.peer });
      });

      socket.on('user-disconnected', (userId) => {
        const peerObj = peersRef.current.find(({ userId: id }) => id === userId);
        if (peerObj) {
          peerObj.peer.close();
          peersRef.current = peersRef.current.filter(({ userId: id }) => id !== userId);

          if (userVideoRefs.current[userId]) {
            userVideoRefs.current[userId].remove();
            delete userVideoRefs.current[userId];
          }
        }
      });
    }).catch((err) => {
      console.error('Error accessing media devices:', err);
    });

    return () => {
      peer.destroy();
      peersRef.current.forEach(({ peer }) => peer.close());
      peersRef.current = [];
      socket.off('joined-room');
      socket.off('user-connected');
      socket.off('user-disconnected');
    };
  }, [meetingId, meetingPassword, socket]);

  // useEffect(() => {
  //   if (mediaStreamRef.current) {
  //     mediaStreamRef.current.getAudioTracks().forEach(track => track.enabled = isMicOn);
  //     mediaStreamRef.current.getVideoTracks().forEach(track => track.enabled = isVideoOn);
  //   }
  // }, [isMicOn, isVideoOn]);
  const [isChatOpen,setIsChatOpen] = useState(false)
  const [isParticipantOpen,setIsParticipantOpen] = useState(false)

  const handleOpenChat= () =>{
    if(isParticipantOpen)
      {
        setIsParticipantOpen(prev => !prev)
      }
      setIsChatOpen(prev => !prev)

  }
  const handleOpenParticipant= () =>{
    if(isChatOpen)
      {
        setIsChatOpen(prev => !prev)
      }
      setIsParticipantOpen(prev => !prev)
  }

  return (
    <div>
      <div className="zoom-container" onMouseMove={handleMouseMove}>
        <div className={`top-bar-main-container ${isVisible ? 'visible' : 'hidden'}`}>
          <div className="top-bar-logo-cntnr">
            <span className="logo-1">zoom</span>
            <span className="logo-2">Meetings</span>
          </div>

          <div className="top-bar-option-cntnr">
            <div className="meeting-info-icon top-options" title='meeting info' onClick={() => console.log(meetingDetails)}><div className="top-icon"><PiShieldCheckFill /></div></div>
            <div className="top-bar-vert-line top-options"></div>
            {/* <div className="meeting-view-option top-options"><div className="top-icon"><PiGridNineFill /> View</div></div> */}
            <div className="meeting-minimize-option top-options" title='minimize'><div className="top-icon"><TbWindowMinimize /></div></div>
            <div className="meeting-end-icon top-options"><div className="top-icon"><ImPhoneHangUp /></div></div>
          </div>
        </div>

        <div className="video-container">
          

          <video ref={myVideoRef} autoPlay playsInline/>
        </div>

        <div className={`bottom-bar-main-container ${isVisible ? 'visible' : 'hidden'}`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          <div className="bottom-bar">
            <button className="bottom-bar-button all-btn" onClick={handleMicClick}>{isMicOn ? <><div className="bottom-bar-icon"><PiMicrophone /> </div> Mute</> : <><div className="bottom-bar-icon icon-off"><PiMicrophoneSlash /></div> Unmute</>}</button>
            <button className="bottom-bar-button all-btn" onClick={handleVideoClick}>{isVideoOn ? <><div className="bottom-bar-icon"><PiVideoCamera /> </div> Close Video </> : <><div className="bottom-bar-icon icon-off"><PiVideoCameraSlash /></div> Start Video</>}</button>
            <button className="bottom-bar-button all-btn"><div className="bottom-bar-icon icon-color"><PiMonitorArrowUpFill /> </div> Share Screen</button>
            <button className="bottom-bar-button all-btn" onClick={handleOpenParticipant}><div className="bottom-bar-icon"><PiUsersThree /> </div> Participants</button>
            <button className="bottom-bar-button chat-btn" onClick={handleOpenChat}><div className="bottom-bar-icon"><PiChats /> </div> Chat</button>
            <button className="bottom-bar-button all-btn" ><div className="bottom-bar-icon"><PiDotsThreeCircle /> </div> More</button>
          </div>
        </div>
      </div>
      <div className={`chatBox ${isChatOpen ? 'open' : ''}`}><ChatBox handleOpenChat={handleOpenChat}/></div>
      <div className={`participantBox ${isParticipantOpen ? 'open' : ''}`}><ParticipantBox handleOpenParticipant={handleOpenParticipant}/></div>
    </div>
  );
};

export default Room;
