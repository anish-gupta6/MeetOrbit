import React, { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import CryptoJS from 'crypto-js'
import "./UserProfile.css";
import {ReactComponent as DisclaimerSVG} from '../../assets/user-disclaimer-svg.svg'
import {ReactComponent as StarSVG} from '../../assets/star-ai-svg.svg'
import { PiNotePencilBold, PiPencilSimpleLine, PiXBold } from "react-icons/pi";
import User from '../../assets/profile-circle.png'
import {userContext} from '../../App'

const UserProfile = () => {
  const navigate = useNavigate();
  const [isNotificationActive,setIsNotificationActive] = useState(true);
  const {userInfo,backend,isLoading} = useContext(userContext)
  const [userDetail,setUserDetail] = useState({})

  useEffect(()=>{
    if(!isNotificationActive){
      setTimeout(()=>{
        setIsNotificationActive((prev)=>!prev);
      },0.5*60*1000)
    }
  },[isNotificationActive])


  useEffect(()=>{
    const fetchUserDetails = async () =>{
        try{
        const response = await fetch(`${backend}/api/auth/getUser/${userInfo.userId}`)
        if(response.ok){
            const data = await response.json();
            setUserDetail(data.userData)
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
  if(meetingId){
  const formattedMeetingId =  meetingId.slice(0, 3) + ' '+ meetingId.slice(3, 6) + ' '+ meetingId.slice(6);
  return formattedMeetingId
  }
}

  const getQuickLink = (meetingId,meetingPassword) =>{
    const secretKey = 'zoomClone'
    const encMeetingPassword = CryptoJS.AES.encrypt(meetingPassword, secretKey).toString();
    return `/meeting/room/start/j?id=${meetingId}&pwd=${encodeURIComponent(encMeetingPassword)}`
  }

  return (
    <div>
      {/* {loading ? (
        <UserProfileSkeleton/> // Render skeleton animation while loading
      ) : ( */}

      <div className="user-profile-main-container">
        <div className="user-profile-view-container">
          <div className="user-profile-disclaimer-info" title="privacy policy"><div className="disclaimer-svg"><DisclaimerSVG height={20} width={20}/></div> <div className="disclaimer-content">When you join meetings, webinars, chats or channels hosted on <span style={{color:'#0e72ed',fontWeight:'600'}}>MeetOrbit</span>, your profile information, including your name and profile picture, may be visible to other participants or members. Your name and email address will also be visible to the <Link to='/privacy-statements' className="disclaimer-link">account owner</Link> and host when you join meetings, webinars, chats or channels on their account while you’re signed in. The account owner and others in the meeting, webinar, chat or channel can share this information with apps and others.</div></div>
          {isNotificationActive && <div className="upgrade-user-subscription-notification">
            <div className="upgrade-notification-content">You are on basic plan</div>
            <Link to='/plan-pricing' className="upgrade-notification-upgrade-link">Upgrade for more features <StarSVG/></Link>
            <div className="upgrade-notification-close-btn" onClick={()=>setIsNotificationActive((prev)=>!prev)}><PiXBold/></div>
          </div>}
          <div className="user-profile-wrapper">

              <div className="user-profile-edit-btn">Edit Profile <div className="profile-edit-btn-icon"><PiNotePencilBold/></div></div>
            <div className="user-profile-info-container">
              <div className="user-profile-image-container"><img src={userDetail.profileImg} alt="profile" onError={(e)=>{e.onError=null;e.target.src=User}}/></div>

              <div className="user-profile-data-container">
                <div className="user-name-cntnr"><div className="user-name">{userDetail.userName}</div></div>
                <div className="user-nick-name-cntnr"><div className="user-nick-name">{userDetail.meetingName}<div className="nick-name-edit-icon"><PiPencilSimpleLine/></div></div>{'( This is used for meetings you join !! )'}</div>
              </div>

            </div>

            <div className="user-profile-personal-details-cntnr">
              <div className="personal-details-header-cntnr">Personal</div>
              <div className="personal-details-content">
                <table className="profile-details-table">
                <tr>
                  <td className="detail-table-column column-1">Phone</td>
                  <td className="detail-table-column column-2">Not Set</td>
                </tr>
                <tr>
                  <td className="detail-table-column column-1">Language</td>
                  <td className="detail-table-column column-2">English</td>
                </tr>
                <tr>
                  <td className="detail-table-column column-1">Time Zone</td>
                  <td className="detail-table-column column-2">{new Date().toString().match(/([A-Z]+[\+-][0-9]+.*)/)[1]}</td>
                </tr>
                </table>
              </div>
            </div>
          </div>

          <div className="user-profile-meeting-details-wrapper">
              <div className="meeting-details-header-cntnr">Meeting</div>
              <div className="meeting-details-content">
                <table className="profile-details-table">
                <tr>
                  <td className="detail-table-column column-1">Personal Meeting ID</td>
                  <td className="detail-table-column column-2">{formatMeetingId(userDetail.meetingId)}</td>
                </tr>
                <tr>
                  <td className="detail-table-column column-1">Quick Link</td>
                  <td className="detail-table-column column-2 column-link" onClick={()=>navigate(getQuickLink(userDetail.meetingId,userDetail.meetingPassword))}>{`http://localhost:3000${getQuickLink(userDetail.meetingId,userDetail.meetingPassword)}`}</td>
                </tr>
                <tr>
                  <td className="detail-table-column column-1">Meeting Key</td>
                  <td className="detail-table-column column-2">{userDetail.meetingPassword}</td>
                </tr>
                <tr>
                  <td className="detail-table-column column-1">Meeting Duration</td>
                  <td className="detail-table-column column-2">You can host up to <i>25 minutes</i> per meeting</td>
                </tr>
                <tr>
                  <td className="detail-table-column column-1">Meeting Chat</td>
                  <td className="detail-table-column column-2">Enabled</td>
                </tr>
                </table>
              </div>
          </div>



        </div>

      </div>
    </div>
  );
};

export default UserProfile;
