import React, { useEffect, useState } from 'react'
import MidNavbar from '../midNav/MidNavbar'
import './JoinMeeting.css'
import { Link,useNavigate } from 'react-router-dom'
import CryptoJS from 'crypto-js'


const JoinMeeting = () => {

    const [meetingId,setMeetingId] = useState('')
    const [meetingPassword,setMeetingPassword] = useState('')
    const [isBtnActive,setIsBtnActive] = useState(false)
    const navigate = useNavigate();

    useEffect(()=>{
        if(meetingPassword.length>5 & meetingId.length!=0){
            setIsBtnActive(true)
        }else{
            setIsBtnActive(false)
        }
    },[meetingPassword])

    const handleJoinMeeting =(e) =>{
        e.preventDefault();
        const secretKey = 'zoomClone'
      const encMeetingPassword = CryptoJS.AES.encrypt(meetingPassword, secretKey).toString();
      if(isBtnActive){
        navigate(`/meeting/room/wr?id=${meetingId}&pwd=${encodeURIComponent(encMeetingPassword)}`);
        // navigate(`/meeting/room/join/j?id=${meetingId}&pwd=${encMeetingPassword}`,{state:{meetingId:meetingId,meetingPassword:meetingPassword}});
      }
    }

  return (
    <div>
      <div className="meeting-join-main-cntnr">
        
        <div className="midnavbar-cntnr">
            <MidNavbar/>
        </div>

        <div className="meeting-join-form-cntnr">
            <div className="join-meeting-heading-cntnr">Join Meeting</div>
            <form className='join-meeting-form-cntnr' onSubmit={handleJoinMeeting}>
                <div className="join-input-label-cntnr">
                    <label htmlFor="meetingId" className='join-meeting-label'>Meeting ID</label>
                    <input type="text" name='meetingId' id='meetingId' className='join-meeting-input' placeholder='Enter Meeting ID' value={meetingId} onChange={(e)=>setMeetingId(e.target.value)}/>
                </div>
                <div className="join-input-label-cntnr">
                    <label htmlFor="meetingPassword" className='join-meeting-label'>Meeting Password</label>
                    <input type="text" name='meetingPassword' id='meetingPassword' className='join-meeting-input' placeholder='Enter Meeting Password' value={meetingPassword} onChange={(e)=>setMeetingPassword(e.target.value)}/>
                </div>
                <div className="join-form-desc">By clicking "Join", you agree to our <Link to='' className='join-form-links'> Terms of Services</Link> and <Link to='' className='join-form-links'>Privacy Statement</Link></div>
                <button type="submit" className={`${isBtnActive?'active':''} join-form-submit-btn`}>Join</button>
            </form>
        </div>

      </div>
    </div>
  )
}

export default JoinMeeting
