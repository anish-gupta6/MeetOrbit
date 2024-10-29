import React, { useContext, useState } from 'react'
import MidNavbar from '../midNav/MidNavbar'
import {userContext} from '../../App'
import { useLocation, useNavigate } from 'react-router-dom';

const LaunchLobby = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const {userInfo} = useContext(userContext);
  const [meetingTitle,setMeetingTitle] = useState(`${userInfo.userName}'s Personal Meeting Room`);

  const queryParams = new URLSearchParams(location.search);
  const roomId = queryParams.get('id');
  const roomPassword = decodeURIComponent(queryParams.get('pwd'));

  const handleLaunch = () =>{
    navigate(`/meeting/room/start/j?id=${roomId}&pwd=${encodeURIComponent(roomPassword)}`,{state:{meetingTitle}});
  }

  return (
    <div>
      <section className="midnavbar-cntnr">
        <MidNavbar/>
      </section>

      <section className="launch-lobby-main-cntnr">
        <div className="launch-lobby-wrapper">
          <div className="launch-lobby-desc" style={{fontSize:'24px',fontWeight:'600'}}>You are on the way to launch your meeting</div>
          <div className="launch-lobby-desc">Want to change meeting title?</div>
          <div className="launch-lobby-input-cntnr">
            <label htmlFor="title" className="launch-input-label">Meeting Title</label>
            <input type="text" id='title' className="launch-input" value={meetingTitle} onChange={(e)=>setMeetingTitle(e.target.value)} autoFocus/>
          </div>
          <button className="launch-button" onClick={handleLaunch}>Launch Meeting</button>
        </div>
        <div className="launch-lobby-bottom">
          <div className="launch-bottom-desc">©2024 MeetOrbit Web Communications, Inc. All rights reserved.</div>
        </div>

      </section>

    </div>
  )
}

export default LaunchLobby
