import React, { useContext, useEffect,useState } from 'react'
import { PiCalendarDotsFill, PiCaretDown, PiPlus, PiVideoCameraFill, PiXBold } from 'react-icons/pi'
import './Meeting.css'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import CryptoJS from 'crypto-js'
import PersonalRoom from './PersonalRoom'
import {ReactComponent as StarSVG} from '../../assets/star-ai-svg.svg'
import {TopLoaderSkeleton,ContentLoaderSkeleton} from './LoaderSkeleton'
import {userContext} from '../../App'

const Meeting = () => {
    const {isLoading} = useContext(userContext)
    const [loading,setLoading] = useState(true)
    const navigate = useNavigate();
    const [hostData,setHostData] = useState({});
    const [isNotificationActive,setIsNotificationActive] = useState(true);
    
  //   useEffect(()=>{
  //     const secretKey = "zoomClone"
  //     const userInfo = localStorage.getItem('userData');
  //     if(userInfo){
  //         const bytes = CryptoJS.AES.decrypt(userInfo, secretKey);
  //         const userData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  //         setHostData(userData)
  //     }
      
  // },[]);
  useEffect(()=>{
    if(!isLoading){
    setTimeout(()=>{
      setLoading(false)
    },400)
  }
  },[isLoading])
    

    // const handleCreateMeeting = () =>{
    //   const secretKey = 'zoomClone'
    //   const meetingId = hostData.meetingId;
    //   const meetingPassword = hostData.meetingPassword;
    //   const encMeetingPassword = CryptoJS.AES.encrypt(meetingPassword, secretKey).toString();
    //   navigate(`/meeting/room/start/j?id=${meetingId}&pwd=${encodeURIComponent(encMeetingPassword)}`);
    // }

  useEffect(()=>{
    if(!isNotificationActive){
      setTimeout(()=>{
        setIsNotificationActive((prev)=>!prev);
      },2*60*1000)
    }
  },[isNotificationActive])
  return (
    <div>
        <div className="user-meeting-page-main-container">
      {loading ? <TopLoaderSkeleton/>:(<>
          <div className="user-meeting-page-top-wrapper">
          <div className="user-meeting-page-main-header">Meetings</div>
          <div className="user-meeting-page-top-bar-wrapper">
            <NavLink to='/home/meeting' end className={({ isActive }) =>`${isActive ? 'tab-active' : ''} user-meeting-top-bar-tab`}>Personal Room</NavLink>
            <NavLink to='/home/meeting/upcoming-meetings' className={({ isActive }) =>`${isActive ? 'tab-active' : ''} user-meeting-top-bar-tab`}>Upcoming</NavLink>
            <NavLink to='/home/meeting/recent-meetings' className={({ isActive }) =>`${isActive ? 'tab-active' : ''} user-meeting-top-bar-tab`}>Recent</NavLink>
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
          </div>
        </div>

    </div>
  )
}

export default Meeting
