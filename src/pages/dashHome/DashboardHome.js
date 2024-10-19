import React, { useContext, useEffect, useRef, useState } from 'react'
import User from '../../assets/profile-circle.png'
import './DashboardHome.css'
import { PiCalendarDotsFill, PiChatsFill, PiCheck, PiCopyFill, PiCopyLight, PiNoteFill, PiPlus, PiSealCheckFill, PiVideoCameraFill } from 'react-icons/pi'
import { TbSquareRoundedPlusFilled } from "react-icons/tb";
import CryptoJS from 'crypto-js'
import { BiSolidMoviePlay } from "react-icons/bi";
import { useNavigate,Link } from 'react-router-dom';
import {ReactComponent as StarSVG} from '../../assets/star-ai-svg.svg'
import {userContext} from '../../App'
import RecentActivity from './RecentActivity';
import {useToast} from '../../ToastService'

const DashboardHome = () => {

    const navigate = useNavigate();
    const {userInfo} = useContext(userContext)
    const [user,setUser] = useState({})
    const [userDetail,setUserDetail] = useState({})
    const [recentMeetings,setRecentMeetings] = useState([])
    const [copied,setCopied] = useState(false)
    const dashboardRef = useRef()
    const num = '1234567890'
    const {notifySuccess,notifyError} = useToast();

    useEffect(()=>{
        if(userInfo){
            setUser(userInfo)
        }
        dashboardRef.current.click();
    },[userInfo])

    useEffect(()=>{
        const fetchUserDetails = async () =>{
            try{
                
            const response = await fetch(`http://localhost:5000/api/auth/getUser/${userInfo.userId}`)
            if(response.ok){
                const data = await response.json();
                console.log(data.userData)
                setUserDetail(data.userData)
                setRecentMeetings(data.userData.recentMeetings)
            }
        } catch(err){
            console.log(err)
        }
    }
        if(userInfo){
            fetchUserDetails();
        }
    },[userInfo])

    const formatMeetingId = (meetingId) =>{
        const formattedMeetingId =  meetingId.slice(0, 3) + ' '+ meetingId.slice(3, 6) + ' '+ meetingId.slice(6);
        return formattedMeetingId
    }

    const handleCopy = (data) =>{
        navigator.clipboard.writeText(data).then(
          () => {
            setCopied(true);
            notifySuccess('Meeting Link Copied !!')
            setTimeout(() => setCopied(false), 3000); 
          },
          (err) => {
            console.error("Failed to copy text: ", err);
          }
        );
      }


      const handleCreateMeeting = () =>{
        console.log('hi')
        const secretKey = 'zoomClone'
        const meetingId = userDetail.meetingId
        const meetingPassword = userDetail.meetingPassword
        const encMeetingPassword = CryptoJS.AES.encrypt(meetingPassword, secretKey).toString();
        navigate(`/meeting/room/start/j?id=${meetingId}&pwd=${encodeURIComponent(encMeetingPassword)}`);
      }



  return (
    <div>
      <div className="dashboard-home-main-cntnr" ref={dashboardRef}>

        <div className="dashboard-home-first-wrapper">

            <div className="home-user-profile-cntnr">
                <div className="user-profile-details-wrapper">
                    <div className="user-profile-user-info">
                        <Link to='/home/profile' className="user-profile-img-cntnr"><img src={userDetail.profileImg} alt="p" className='user-profile-img' onError={(e)=>{e.onError=null;e.target.src=User}}/></Link>
                        <div className="user-profile-desc">
                            <Link to='/home/profile' className="user-profile-user-name">{userDetail.userName}</Link>
                            <div className="user-profile-user-plan">Basic Free Plan</div>
                        </div>
                    </div>
                    <Link to='/plan-pricing' className="user-profile-plan-btn">Manage Plan</Link>
                </div>
                <div className="user-profile-plan-wrapper">
                    <div className="user-profile-plan-title">Included in your plan:</div>
                    <div className="user-profile-plan-list">
                        <div className="user-plan-items"><div className="plan-items-icon"><PiVideoCameraFill/></div>Meetings</div>
                        <div className="user-plan-items"><div className="plan-items-icon"><PiChatsFill/></div>Team Chat</div>
                        <div className="user-plan-items"><div className="plan-items-icon"><BiSolidMoviePlay/></div>Recording</div>
                        <div className="user-plan-items"><div className="plan-items-icon"><PiNoteFill/></div>Notes</div>
                        <div className="user-plan-items"><div className="plan-items-icon"><PiCalendarDotsFill/></div>Meeting Schedule</div>
                    </div>
                    <div className="user-profile-plan-view-details">View Plan Details</div>
                </div>
            </div>

            <div className="dashboard-home-meeting-details-options-wrapper mobile">
                <div className="dashboard-home-meeting-options-cntnr">
                    <div onClick={handleCreateMeeting} className="dashboard-home-meeting-option"><div className="dashboard-home-meeting-option-icon new-meeting-icon"><PiVideoCameraFill/></div><div className="dashboard-home-meeting-option-title">Host</div></div>
                    <div onClick={()=>navigate('/join-meeting')} className="dashboard-home-meeting-option"><div className="dashboard-home-meeting-option-icon join-meeting-icon"><TbSquareRoundedPlusFilled/></div><div className="dashboard-home-meeting-option-title">Join</div></div>
                    <div className="dashboard-home-meeting-option"><div className="dashboard-home-meeting-option-icon schedule-meeting-icon"><PiCalendarDotsFill/></div><div className="dashboard-home-meeting-option-title">Schedule</div></div>
                </div>
                <div className="dashboard-home-personal-meeting-details">
                    <div className="personal-meeting-detail-heading">Personal Meeting ID</div>
                    <div className="personal-meeting-meetingId">{formatMeetingId(userDetail.meetingId || ' ')} <div className="meetingId-copy-btn" onClick={()=>handleCopy(userDetail.meetingId)}>{copied ? <PiCheck color='#0e72ed'/> :<PiCopyFill/>}</div></div>
                </div>
            </div>

            <div className="dashboard-home-user-activity-cntnr">
                <div className="user-activity-header-cntnr">Your Activity</div>
                {recentMeetings.length>0 ? <div className="user-activity-items-cntnr"><RecentActivity recentActivity={recentMeetings}/></div>
                :<div className="user-activity-items-cntnr"><div className="no-activity">No Recent Activities</div></div>}
            </div>
        </div>

        <div className="dashboard-home-second-wrapper">

            <div className="dashboard-home-meeting-details-options-wrapper desktop">
                <div className="dashboard-home-meeting-options-cntnr">
                    <div onClick={handleCreateMeeting} className="dashboard-home-meeting-option"><div className="dashboard-home-meeting-option-icon new-meeting-icon" onClick={()=>''}><PiVideoCameraFill/></div><div className="dashboard-home-meeting-option-title">Host</div></div>
                    <div onClick={()=>navigate('/join-meeting')} className="dashboard-home-meeting-option"><div className="dashboard-home-meeting-option-icon join-meeting-icon"><TbSquareRoundedPlusFilled/></div><div className="dashboard-home-meeting-option-title">Join</div></div>
                    <div className="dashboard-home-meeting-option"><div className="dashboard-home-meeting-option-icon schedule-meeting-icon"><PiCalendarDotsFill/></div><div className="dashboard-home-meeting-option-title">Schedule</div></div>
                </div>
                <div className="dashboard-home-personal-meeting-details">
                    <div className="personal-meeting-detail-heading">Personal Meeting ID</div>
                    <div className="personal-meeting-meetingId">{formatMeetingId(userDetail.meetingId || ' ')} <div className="meetingId-copy-btn" onClick={()=>handleCopy(userDetail.meetingId)}>{copied ? <PiCheck color='#0e72ed'/> :<PiCopyFill/>}</div></div>
                </div>
            </div>

            <div className="dashboard-home-meeting-session-cntnr">
                <div className="meeting-session-header-cntnr">
                    <div className="meeting-session-heading">Meetings</div>
                    <Link to='/home/meeting/upcoming-meetings' className="meeting-session-link-heading">View All</Link>
                </div>
                <div className="meeting-session-upcoming-meetings-cntnr">
                    No Upcoming Meetings
                </div>
                <button className="meeting-session-media-test">Test Audio and Video</button>
            </div>

            <div className="dashboard-home-plan-features-cntnr">
                <div className="plan-feature-header-cntnr">Do more with MeetOrbit Pro Subscription</div>
                
                <div className="plan-feature-items-cntnr">
                    <div className="plan-feature-items"><div className="plan-feature-item-icon"><PiSealCheckFill/></div>No 40-minute limit</div>
                    <div className="plan-feature-items"><div className="plan-feature-item-icon"><PiSealCheckFill/></div>Unlimited number of meetings</div>
                    <div className="plan-feature-items"><div className="plan-feature-item-icon"><PiSealCheckFill/></div>More customizations for meetings</div>
                    <div className="plan-feature-items"><div className="plan-feature-item-icon"><PiSealCheckFill/></div>Exclusive access to whiteboards <StarSVG/></div>
                </div>

                <Link to='/plan-pricing' className="plan-upgrade-btn">Upgrade Now</Link>
                <div className="user-profile-plan-view-details plan-feature-view-all">View all plans</div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardHome
