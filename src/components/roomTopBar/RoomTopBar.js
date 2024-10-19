import React, { useState,useEffect } from 'react'
import { ImPhoneHangUp,ImExit  } from 'react-icons/im'
import { PiShieldCheckFill,PiSignOutBold ,PiPhoneXFill } from 'react-icons/pi'
import { TbWindowMinimize } from 'react-icons/tb'
import {useRoomContext} from '../contexts/RoomContextPro'
import { BsDoorOpenFill } from "react-icons/bs";
import { BiSolidDoorOpen } from "react-icons/bi";
import { useLocation } from 'react-router-dom'

const RoomTopBar = () => {
    const {roomStates,roomHandlers} = useRoomContext();
    const {handleMeetingEnd,handleLeaveMeeting} = roomHandlers;
    const {me,meetingId,isVisible,isChatOpen,isParticipantOpen,meetingDetails} = roomStates;
    const [isMeetingEndActive,setIsMeetingEndActive] = useState(false);
    const [isMeetingInfo,setIsMeetingInfo] = useState(false);
    // const [meetingInfo,setMeetingInfo] = useState({});

    const queryParams = new URLSearchParams(useLocation().search);
    const meetingPassword = queryParams.get('pwd');

    // const handleMeetingEndDropdown = () =>{
    //   setIsMeetingEndActive((prev)=>!prev)
    // }

    useEffect(() => {
      const handleOutsideClick = (event) => {
        if (isMeetingEndActive && !event.target.closest('.meeting-end-icon')) {
          setIsMeetingEndActive((prev)=>!prev)
        }
        if (isMeetingInfo && !event.target.closest('.meeting-info-icon')) {
          setIsMeetingInfo((prev)=>!prev)
        }
      };
  
      document.body.addEventListener('click', handleOutsideClick);
  
      return () => {
        document.body.removeEventListener('click', handleOutsideClick);
      };
    }, [isMeetingEndActive,isMeetingInfo]);

    // useEffect(()=>{
    //   const fetchMeetingInfo = async () =>{
    //     try{
    //     const response = await fetch(`http://localhost:3001/getMeetingInfo/${meetingId}`)
    //     if(response.ok){
    //       const data = await response.json();
    //       console.log(data.meetingInfo)
    //       setMeetingInfo(data.meetingInfo)
    //     }
    //   }catch(err){
    //     console.log(err)
    //   }
    //   }
    //   if(me && meetingId){
    //     fetchMeetingInfo();
    //   }
      
    // },[])
  return (
    <div>
      <div className={`top-bar-main-container ${isVisible || isMeetingInfo || isChatOpen || isParticipantOpen? 'visible' : 'hidden'}`}>
          <div className="top-bar-logo-cntnr">
            <span className="logo-1">MeetOrbit</span>
            <span className="logo-2">Meetings</span>
          </div>

          <div className="top-bar-option-cntnr">
            <div className="meeting-info-icon top-options"  onClick={()=>setIsMeetingInfo((prev)=>!prev)}>
              <div className="top-icon" title='meeting info'><PiShieldCheckFill /></div>
              {isMeetingInfo && <div className={`meeting-info-dropdown-cntnr ${isMeetingInfo ? 'info-active' : ''}`} onClick={(e) => e.stopPropagation()}>
                <div className="meeting-info-header">{meetingDetails.title}</div>
                <div className="meeting-info-content-cntnr">
                  <div className="meeting-info-row">
                    <div className="meeting-info-row-title">Host</div>
                    <div className="meeting-info-row-content">{meetingDetails.createdBy?.userName || 'not'}</div>
                  </div>
                  <div className="meeting-info-row">
                    <div className="meeting-info-row-title">Meeting ID</div>
                    <div className="meeting-info-row-content">{meetingId}</div>
                  </div>
                  <div className="meeting-info-row">
                    <div className="meeting-info-row-title">Password</div>
                    <div className="meeting-info-row-content">{meetingDetails.meetingPassword.toUpperCase() || 'not'}</div>
                  </div>
                  <div className="meeting-info-row">
                    <div className="meeting-info-row-title">Invite Link</div>
                    <div className="meeting-info-row-content">{`http://localhost:3000/meeting/room/s?id=${meetingId}&pwd=${encodeURIComponent(meetingPassword)}`}</div>
                  </div>
                </div>
              </div>}
            </div>
            <div className="top-bar-vert-line top-options"></div>
            <div className="meeting-minimize-option top-options" title='minimize'><div className="top-icon"><TbWindowMinimize /></div></div>
            <div className="meeting-end-icon top-options" onClick={()=>setIsMeetingEndActive((prev)=>!prev)}><div className="top-icon"><ImPhoneHangUp /></div>
              <div className={`meeting-end-dropdown-cntnr ${isMeetingEndActive?'end-active':''}`} onClick={(e) => e.stopPropagation()}>
                <div className="meeting-leave-option meeting-end-option" onClick={handleLeaveMeeting}>Leave Meeting <div className="end-option-icon"><PiSignOutBold /></div></div>
                <div className="meeting-all-end-option meeting-end-option" onClick={handleMeetingEnd}>End for All <div className="end-option-icon"><PiPhoneXFill /></div></div>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default RoomTopBar
