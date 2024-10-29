import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link,useLocation,useNavigate } from 'react-router-dom';
import './MeetingLobby.css'
import { PiMicrophone, PiMicrophoneSlash, PiVideoCamera, PiVideoCameraSlash} from 'react-icons/pi';
import videoThumbnail from '../../assets/videoThumbnail.png'
import MidNavbar from '../midNav/MidNavbar';
import CryptoJS from 'crypto-js'
import {useToast} from '../../ToastService'
import {userContext} from '../../App'

const MeetingLobby = () => {
  const {userInfo} = useContext(userContext)
  const [userName,setUserName] = useState(userInfo?.userName || ' ');
  const [isMicOn,setIsMicOn] = useState(true);
  const [isVideoOn,setIsVideoOn] = useState(true);
  const userStreamRef = useRef(null);
  const streamRef = useRef(null); 
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const roomId = queryParams.get('id');
  const roomPassword = decodeURIComponent(queryParams.get('pwd'));
  const {notifyWarning} = useToast();

  const handleToggleMic = () => {
    setIsMicOn((prev) => !prev);
  };

  const handleToggleVideo = () => {
    setIsVideoOn((prev) => !prev);
  };

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      streamRef.current = stream;
      userStreamRef.current.srcObject = stream;
    });
  }, []);

  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => track.enabled = isMicOn);
      streamRef.current.getVideoTracks().forEach(track => track.enabled = isVideoOn);
    }
  }, [isMicOn,isVideoOn]);

  const handleJoinRoom = (e) =>{
    e.preventDefault();
    console.log(isMicOn,isVideoOn)
    if(!userName){
      notifyWarning('Enter you name !!');
      return
    }
    navigate(`/meeting/room/join/j?id=${roomId}&pwd=${encodeURIComponent(roomPassword)}`,{state:{isMicOn,isVideoOn,userName}});
  }

  return (
    <div>
      <div className="midnavbar-cntnr">
            <MidNavbar/>
        </div>
      <div className="lobby-main-container">
        <div className="lobby-user-audio-video-preview">
          <div className="user-video-cntnr">
            {!isVideoOn && <img src={videoThumbnail} alt="thumbnail" className='user-video-poster'/>}
            <video ref={userStreamRef} className='user-video-box' autoPlay playsInline disablePictureInPicture />
            </div>
          <div className="user-audio-video-controls">
            <button className="lobby-control-btn" onClick={handleToggleMic}>{isMicOn ? <><div className="lobby-control-icon"><PiMicrophone /> </div> Mute</> : <><div className="lobby-control-icon icon-off"><PiMicrophoneSlash /></div> Unmute</>}</button>
            <button className="lobby-control-btn" onClick={handleToggleVideo}>{isVideoOn ? <><div className="lobby-control-icon"><PiVideoCamera /> </div> Close Video </> : <><div className="lobby-control-icon icon-off"><PiVideoCameraSlash /></div> Start Video</>}</button>
          </div>
        </div>

        <div className="lobby-meeting-info-wrapper">
          <h1 className="lobby-meeting-heading">Enter Meeting Info</h1>
        <form className='join-meeting-form-cntnr' onSubmit={handleJoinRoom}>
                <div className="join-input-label-cntnr">
                    <label htmlFor="userName" className='join-meeting-label'>Your Name</label>
                    <input type="text" name='userName' id='userName' className='join-meeting-input' placeholder='Enter Your Name' value={userName} onChange={(e)=>setUserName(e.target.value)}/>
                </div>
                <div className="join-form-desc">By clicking "Join", you agree to our <Link to='' className='join-form-links'> Terms of Services</Link> and <Link to='' className='join-form-links'>Privacy Statement</Link></div>
                <button type="submit" className='join-form-submit-btn active'>Join</button>
            </form>
        </div>
      </div>
    </div>
  )
}

export default MeetingLobby
