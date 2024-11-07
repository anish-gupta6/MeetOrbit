import React, { useState,useEffect } from 'react'
import { ImPhoneHangUp,ImExit  } from 'react-icons/im'
import { PiShieldCheckFill,PiSignOutBold ,PiPhoneXFill, PiRecordFill, PiStopCircleBold, PiShareNetworkFill, PiInfoFill } from 'react-icons/pi'
import { TbWindowMinimize } from 'react-icons/tb'
import {useRoomContext} from '../contexts/RoomContextPro'
import {useToast} from '../../ToastService'
import CryptoJS from 'crypto-js'

const RoomTopBar = () => {

  const {notifySuccess,notifyError} = useToast();

    const {roomStates,setRoomStates,roomHandlers} = useRoomContext();
    const {handleMeetingEnd,handleLeaveMeeting,startRecording} = roomHandlers;
    const {me,meetingId,isVisible,isChatOpen,isParticipantOpen,meetingDetails,isRecording,isHost} = roomStates;
    const {setIsHost} = setRoomStates;
    const [isMeetingEndActive,setIsMeetingEndActive] = useState(false);
    const [isMeetingInfo,setIsMeetingInfo] = useState(false);
    const [meetingPassword,setMeetingPassword] = useState('');
    // const [hosts,setHosts] = useState([]);
    // const [isHost,setIsHost] = useState(false);

    

    useEffect(()=>{
      if(meetingDetails){
        const secretKey = 'zoomClone'
        const encMeetingPassword = CryptoJS.AES.encrypt(meetingDetails.meetingPassword, secretKey).toString();
        setMeetingPassword(encMeetingPassword)
      }
    },[meetingDetails])

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

    
    const handleCopy = (data) =>{
      navigator.clipboard.writeText(data).then(
        () => {
          notifySuccess('Copied !!')
        },
        (err) => {
          console.error("Failed to copy text: ", err);
        }
      );
    }

    const formatMeetingId = (meetingId) =>{
      const formattedMeetingId =  meetingId.slice(0, 3) + ' '+ meetingId.slice(3, 6) + ' '+ meetingId.slice(6);
      return formattedMeetingId
  }

  // useEffect(()=>{
  //   if(meetingDetails){
  //     setHosts(meetingDetails.host)
  //   }
  //   if(hosts && hosts.includes(me)){
  //     setIsHost(true)
  //   }
  //   console.log(hosts?hosts.includes(me):'')
  // },[meetingDetails])

  return (
    <div>
      <div className={`top-bar-main-container ${isVisible || isMeetingInfo || isChatOpen || isParticipantOpen? 'visible' : 'hidden'}`}>
          <div className="top-bar-logo-cntnr" onClick={()=>console.log(meetingDetails)}>
            <span className="logo-1">MeetOrbit</span>
            <span className="logo-2">Meetings</span>
          </div>

          <div className="top-bar-option-cntnr">
            <div className="meeting-info-icon top-options"  onClick={()=>setIsMeetingInfo((prev)=>!prev)}>
              <div className="top-icon" title='meeting info'><PiInfoFill style={{fontSize:'22px',color:'#03fc5e',marginRight:'6px'}}/> Info</div>
              {<div className={`meeting-info-dropdown-cntnr ${isMeetingInfo ? 'info-active' : ''}`} onClick={(e) => e.stopPropagation()}>
                <div className="meeting-info-header">{meetingDetails.title}</div>
                <div className="meeting-info-content-cntnr">
                  <div className="meeting-info-row">
                    <div className="meeting-info-row-title">Host</div>
                    <div className="meeting-info-row-content name-content">{meetingDetails.createdBy?.userName || 'not'}</div>
                  </div>
                  <div className="meeting-info-row">
                    <div className="meeting-info-row-title">Meeting ID</div>
                    <div className="meeting-info-row-content" onClick={()=>handleCopy(meetingId)}>{formatMeetingId(meetingId)}</div>
                  </div>
                  <div className="meeting-info-row">
                    <div className="meeting-info-row-title">Password</div>
                    <div className="meeting-info-row-content" onClick={()=>handleCopy(meetingDetails.meetingPassword)}>{meetingDetails.meetingPassword}</div>
                  </div>
                  <div className="meeting-info-row">
                    <div className="meeting-info-row-title">Invite Link</div>
                    <div className="meeting-info-row-content" onClick={()=>handleCopy(`http://localhost:3000/meeting/room/wr?id=${meetingId}&pwd=${encodeURIComponent(meetingPassword)}`)}>
                      {`http://localhost:3000/meeting/room/wr?id=${meetingId}&pwd=${encodeURIComponent(meetingPassword)}`}</div>
                  </div>

                    <div className="meeting-info-row-desc"><PiShareNetworkFill style={{fontSize:'20px'}}/> Click the details to copy</div>

                </div>
              </div>}
            </div>
            <div className="top-bar-vert-line top-options"></div>
            <div className="meeting-record-option top-options" title='Record' onClick={startRecording}>Rec<div className="top-icon"><PiRecordFill /></div></div>
            <div className="meeting-end-icon top-options" onClick={()=>setIsMeetingEndActive((prev)=>!prev)}><div className="top-icon"><ImPhoneHangUp /></div>
              <div className={`meeting-end-dropdown-cntnr ${isMeetingEndActive?'end-active':''}`} onClick={(e) => e.stopPropagation()}>
                <div className="meeting-leave-option meeting-end-option" onClick={handleLeaveMeeting}>Leave Meeting <div className="end-option-icon"><PiSignOutBold /></div></div>
                {/* <button className="meeting-all-end-option meeting-end-option" onClick={handleMeetingEnd} disabled={!isHost}>End for All <div className="end-option-icon"><PiPhoneXFill /></div></button> */}
                <div className={`meeting-all-end-option meeting-end-option ${!isHost ? 'disabled':''}`} onClick={handleMeetingEnd} >End for All <div className="end-option-icon"><PiPhoneXFill /></div></div>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default RoomTopBar
