import React, { useContext, useEffect,useState } from 'react'
import { PiCalendarDotsFill, PiCaretDown, PiPlus, PiVideoCameraFill, PiXBold } from 'react-icons/pi'
// import './Recording.css'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import CryptoJS from 'crypto-js'
import PersonalRoom from './AllRecording'
import {ReactComponent as StarSVG} from '../../assets/star-ai-svg.svg'
import {TopLoaderSkeleton,ContentLoaderSkeleton} from '../userMeeting/LoaderSkeleton'
import {userContext} from '../../App'

const Recording = () => {
  const {isLoading} = useContext(userContext)
    const [loading,setLoading] = useState(true)
    const navigate = useNavigate();
    const [hostData,setHostData] = useState({});
    const [isNotificationActive,setIsNotificationActive] = useState(true);
    
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
      const secretKey = 'zoomClone'
      const meetingId = hostData.meetingId;
      const meetingPassword = hostData.meetingPassword;
      const encMeetingPassword = CryptoJS.AES.encrypt(meetingPassword, secretKey).toString();
      navigate(`/meeting/room/start/j?id=${meetingId}&pwd=${encodeURIComponent(encMeetingPassword)}`);
    }

  useEffect(()=>{
    if(!isNotificationActive){
      setTimeout(()=>{
        setIsNotificationActive((prev)=>!prev);
      },2*60*1000)
    }
  },[isNotificationActive])

  useEffect(()=>{
    if(!isLoading){
    setTimeout(()=>{
      setLoading(false)
    },400)
  }
  },[isLoading])

  return (
    <div>
      {/* <div className="meeting-page-main-cntnr">
        <div className="meeting-page-option"><div className="meeting-option-icon new-icon" onClick={handleCreateMeeting}><PiVideoCameraFill/></div><div className="meeting-option-title">New Meeting <PiCaretDown style={{fontSize:'12px'}}/></div></div>
        <div onClick={()=>navigate('/join-meeting')} className="meeting-page-option"><div className="meeting-option-icon join-icon"><PiPlus className="plus-icon"/></div><div className="meeting-option-title">Join</div></div>
        <div className="meeting-page-option"><div className="meeting-option-icon schedule-icon"><PiCalendarDotsFill/></div><div className="meeting-option-title">Schedule</div></div>
      </div> */}


        <div className="user-meeting-page-main-container">
        {loading ? <TopLoaderSkeleton/>:(<>
          <div className="user-meeting-page-top-wrapper">
          <div className="user-meeting-page-main-header">Recordings</div>
          <div className="user-meeting-page-top-bar-wrapper">
            <NavLink to='/home/recording' end className={({ isActive }) =>`${isActive ? 'tab-active' : ''} user-meeting-top-bar-tab`}>All Recordings</NavLink>
            <NavLink to='/home/recording/favourite-recordings' className={({ isActive }) =>`${isActive ? 'tab-active' : ''} user-meeting-top-bar-tab`}>My Favourites</NavLink>
            <NavLink to='/home/recording/trash-recordings' className={({ isActive }) =>`${isActive ? 'tab-active' : ''} user-meeting-top-bar-tab`}>Trash</NavLink>
          </div>
          </div>

          {isNotificationActive && <div className="upgrade-user-subscription-notification meeting-notification">
            <div className="upgrade-notification-content ">You are on basic plan</div>
            <Link to='/plan-pricing' className="upgrade-notification-upgrade-link">Upgrade for more features <StarSVG/></Link>
            <div className="upgrade-notification-close-btn" onClick={()=>setIsNotificationActive((prev)=>!prev)}><PiXBold/></div>
          </div>}
          </>)}

          <div className="user-meeting-tab-preview">
            <Outlet/>
            {/* {activeTab === 'personal-room'? <PersonalRoom/> : ''}
            {activeTab === 'upcoming'? <PersonalRoom/> : ''}
            {activeTab === 'recent'? <PersonalRoom/> : ''} */}
          </div>
        </div>

    </div>
  )
}

export default Recording
