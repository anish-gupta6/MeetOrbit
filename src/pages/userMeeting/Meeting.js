import React, { useEffect,useState } from 'react'
import { PiCalendarDotsFill, PiCaretDown, PiPlus, PiVideoCameraFill } from 'react-icons/pi'
import './Meeting.css'
import { Link, useNavigate } from 'react-router-dom'
import CryptoJS from 'crypto-js'

const Meeting = () => {
    const navigate = useNavigate();
    // const meetingId = 123;
    const [hostData,setHostData] = useState({});
    
    useEffect(()=>{
      const secretKey = "zoomClone"
      const userInfo = localStorage.getItem('userData');
      if(userInfo){
          const bytes = CryptoJS.AES.decrypt(userInfo, secretKey);
          const userData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          setHostData(userData)
      }
      
  },[]);
    

    const handleCreateMeeting = () =>{
      console.log(hostData) 
      const secretKey = 'zoomClone'
      const meetingId = hostData.meetingId;
      const meetingPassword = hostData.meetingPassword;
      const encMeetingPassword = CryptoJS.AES.encrypt(meetingPassword, secretKey).toString();
      navigate(`/meeting/room/start/j?id=${meetingId}&pwd=${encMeetingPassword}`,{state:{hostData:hostData,meetingId:meetingId,meetingPassword:meetingPassword}});
      // navigate(`/meeting/room/start/j?id=1234&pwd=123`,{state:hostData});
    }
  return (
    <div>
      <div className="meeting-page-main-cntnr">
        <div className="meeting-page-option"><div className="meeting-option-icon new-icon" onClick={handleCreateMeeting}><PiVideoCameraFill/></div><div className="meeting-option-title">New Meeting <PiCaretDown style={{fontSize:'12px'}}/></div></div>
        <div onClick={()=>navigate('/join-meeting')} className="meeting-page-option"><div className="meeting-option-icon join-icon"><PiPlus className="plus-icon"/></div><div className="meeting-option-title">Join</div></div>
        <div className="meeting-page-option"><div className="meeting-option-icon schedule-icon"><PiCalendarDotsFill/></div><div className="meeting-option-title">Schedule</div></div>
      </div>
    </div>
  )
}

export default Meeting
