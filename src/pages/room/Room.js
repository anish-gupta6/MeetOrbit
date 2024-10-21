import React, {useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import './Room.css';
import { useRoomContext } from '../../components/contexts/RoomContextPro';
import ChatBox from '../../components/chatBox/ChatBox';
import ParticipantBox from '../../components/participantsBox/ParticipantBox';
import VideoGrid from '../../components/videoStream/VideoGrid';
import RoomTopBar from '../../components/roomTopBar/RoomTopBar';
import RoomBottomBar from '../../components/roomBottomBar/RoomBottomBar';
import {ReactComponent as RoomConnecting} from '../../assets/roomConnecting-svg.svg'
import CryptoJS from 'crypto-js'

const Room = () => {
  // const { socket } = useSocket();
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const meetingId = queryParams.get('id');
  const meetingPassword = queryParams.get('pwd');
  const { userInfo,isMicOn,isVideoOn,userName } = location.state;

  const {roomStates,setRoomStates} = useRoomContext();
  const {me,isHovered,isChatOpen,isParticipantOpen} = roomStates;
  const {setIsMicOn,setIsVideoOn,setIsHovered,setIsVisible,setMeetingDetails,setUserInfo,setUserName,setMeetingId,setMeetingPassword} = setRoomStates;

  useEffect(() => {
    setUserInfo(userInfo)
    setIsMicOn(isMicOn)
    setIsVideoOn(isVideoOn)
    setUserName(userName || userInfo.meetingName)
    const secretKey = 'zoomClone'
    const bytes =  CryptoJS.AES.decrypt(meetingPassword, secretKey);
    const decMeetingPassword = bytes.toString(CryptoJS.enc.Utf8);
    setMeetingId(meetingId)
    setMeetingPassword(decMeetingPassword)
    // console.log(userInfo)
  }, []);
  
  useEffect(() => {
    let timeOut;
    if (isHovered || isParticipantOpen || isChatOpen) {
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
  // const isConnecting = true;

  useEffect(()=>{
    const fetchMeetingInfo = async () =>{
      try{
      const response = await fetch(`https://meetorbit-backend.onrender.com/getMeetingInfo/${meetingId}`)
      if(response.ok){
        const data = await response.json();
        console.log(data.meetingInfo)
        setMeetingDetails(data.meetingInfo)
      }
    }catch(err){
      console.log(err)
    }
    }
      fetchMeetingInfo();
    
  },[meetingId])

  return (
    
    <div>
      <div className="zoom-container" onMouseMove={handleMouseMove}>

        <div className="room-top-bar"><RoomTopBar/></div>

        <div className="video-grid"><VideoGrid/></div>

        <div className="room-bottom-bar"><RoomBottomBar /></div>

      </div>

      <div className={`chatBox ${isChatOpen ? 'open' : ''}`}><ChatBox/></div>
      <div className={`participantBox ${isParticipantOpen ? 'open' : ''}`}><ParticipantBox/></div>
    </div>
  );
};

export default Room;
