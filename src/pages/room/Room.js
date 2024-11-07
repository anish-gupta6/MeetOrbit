import React, {useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';
import './Room.css';
import { useRoomContext } from '../../components/contexts/RoomContextPro';
import { useSocket } from '../../components/contexts/SocketProvider';
import ChatBox from '../../components/chatBox/ChatBox';
import ParticipantBox from '../../components/participantsBox/ParticipantBox';
import VideoGrid from '../../components/videoStream/VideoGrid';
import RoomTopBar from '../../components/roomTopBar/RoomTopBar';
import RoomBottomBar from '../../components/roomBottomBar/RoomBottomBar';
import {ReactComponent as RoomConnecting} from '../../assets/roomConnecting-svg.svg'
import CryptoJS from 'crypto-js'

const Room = () => {
  const { endPoint } = useSocket();
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const meetingId = queryParams.get('id');
  const meetingPassword = queryParams.get('pwd');
  const { userInfo,isMicOn,isVideoOn,userName } = location.state;

  const {roomStates,setRoomStates} = useRoomContext();
  const {me,isHovered,isChatOpen,isParticipantOpen,hosts} = roomStates;
  const {setIsMicOn,setIsVideoOn,setIsHovered,setIsVisible,setMeetingDetails,setColorId,setUserInfo,setUserName,setMeetingId,setMeetingPassword,setHosts} = setRoomStates;
  // const [isLoading,setIsLoading] = useState(true);
  
  
  const getColorId = () =>{
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
  useEffect(() => {
    if(userInfo){
      setColorId(userInfo.colorId);
      setUserInfo(userInfo)
    }
    else{
      setColorId(getColorId)
      setUserInfo(undefined)
    }
        
    setIsMicOn(isMicOn?? false)
    setIsVideoOn(isVideoOn?? true)
    setUserName(userName?userName:userInfo.meetingName)
    // setUserInfo(userInfo)
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
      const response = await fetch(`${endPoint}/getMeetingInfo/${meetingId}`)
      if(response.ok){
        const data = await response.json();
        console.log(data.meetingInfo)
        setMeetingDetails(data.meetingInfo)
        const res = data.meetingInfo
        setHosts(res.host)
        // setTimeout(()=>{
        //   setIsLoading(false)
        // },3000)
      }
    }catch(err){
      console.log(err)
    }
    }
      fetchMeetingInfo();
    
  },[meetingId])

  return (
    
    <div>
      {/* {isLoading?<><div className="middleware-loader"></div><div className="middleware-loading-caption"></div></>:<> */}
      <div className="zoom-container" onMouseMove={handleMouseMove}>

        <div className="room-top-bar"><RoomTopBar/></div>

        <div className="video-grid"><VideoGrid/></div>

        <div className="room-bottom-bar"><RoomBottomBar /></div>

      </div>

      <div className={`chatBox ${isChatOpen ? 'open' : ''}`}><ChatBox/></div>
      <div className={`participantBox ${isParticipantOpen ? 'open' : ''}`}><ParticipantBox/></div>
    {/* </>} */}
    </div>
  );
};

export default Room;
