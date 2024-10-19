import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./UserProfile.css";
import {ReactComponent as DisclaimerSVG} from '../../assets/user-disclaimer-svg.svg'
import {ReactComponent as StarSVG} from '../../assets/star-ai-svg.svg'
import { PiNotePencilBold, PiPencilSimpleLine, PiXBold } from "react-icons/pi";
import User from '../../assets/profile-circle.png'

const UserProfile = () => {
  const [isNotificationActive,setIsNotificationActive] = useState(true);
  useEffect(()=>{
    if(!isNotificationActive){
      setTimeout(()=>{
        setIsNotificationActive((prev)=>!prev);
      },0.5*60*1000)
    }
  },[isNotificationActive])
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
              <div className="user-profile-image-container"><img src="https://lh3.googleusercontent.com/a/ACg8ocJeC4HcwSV54yIDLdQFZ6C_mTm-r3i-MMBatonqCzrw7CZG9A=s96-c" alt="profile" onError={(e)=>{e.onError=null;e.target.src=User}}/></div>

              <div className="user-profile-data-container">
                <div className="user-name-cntnr"><div className="user-name">Anish Gupta</div></div>
                <div className="user-nick-name-cntnr"><div className="user-nick-name">Anish Gupta <div className="nick-name-edit-icon"><PiPencilSimpleLine/></div></div>{'( This is used for meetings you join !! )'}</div>
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
                  <td className="detail-table-column column-2">Not Set</td>
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
                  <td className="detail-table-column column-2">Not Set</td>
                </tr>
                <tr>
                  <td className="detail-table-column column-1">Quick Link</td>
                  <td className="detail-table-column column-2">Not Set</td>
                </tr>
                <tr>
                  <td className="detail-table-column column-1">Meeting Key</td>
                  <td className="detail-table-column column-2">Not Set</td>
                </tr>
                <tr>
                  <td className="detail-table-column column-1">Meeting Duration</td>
                  <td className="detail-table-column column-2">You can host up to <i>40 minutes</i> per meeting</td>
                </tr>
                <tr>
                  <td className="detail-table-column column-1">Team Chat</td>
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
