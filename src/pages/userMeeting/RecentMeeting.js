import React,{useContext, useEffect, useState} from 'react'
import { PiCalendarDotsFill, PiVideoCameraFill } from 'react-icons/pi'
import { TbSquareRoundedPlusFilled } from 'react-icons/tb'
import { NavLink, useNavigate } from 'react-router-dom'
import CryptoJS from 'crypto-js'
import {userContext} from '../../App'
import {ContentLoaderSkeleton} from './LoaderSkeleton'
import RecentActivity from '../dashHome/RecentActivity'

const RecentMeeting = () => {
  const navigate = useNavigate();
  const {isLoading,userInfo,backend}=useContext(userContext)
  const [loading,setLoading] = useState(true)
  const [userDetail,setUserDetail] = useState({})
  const [recentMeetings,setRecentMeetings] = useState([])
  

  const handleCreateMeeting = () =>{
    console.log('hi')
    const secretKey = 'zoomClone'
    const meetingId = userDetail.meetingId
    const meetingPassword = userDetail.meetingPassword
    const encMeetingPassword = CryptoJS.AES.encrypt(meetingPassword, secretKey).toString();
    navigate(`/meeting/room/start/j?id=${meetingId}&pwd=${encodeURIComponent(encMeetingPassword)}`);
  }


  useEffect(()=>{
    const fetchUserDetails = async () =>{
        try{
            
        const response = await fetch(`${backend}/api/auth/getUser/${userInfo.userId}`)
        if(response.ok){
            const data = await response.json();
            setUserDetail(data.userData)
            setRecentMeetings(data.userData.recentMeetings)
            if(!isLoading){
              setTimeout(()=>{
                setLoading(false)
              },400)
            }
        }
    } catch(err){
        console.log(err)
    }
}
    if(userInfo){
        fetchUserDetails();
    }
},[userInfo,isLoading])


    return (
      <div>
        {loading ? <ContentLoaderSkeleton/>:(
        <div className="upcoming-meeting-main-container">
          <div className="upcoming-meeting-header">Recent Meetings</div>
          <div className="upcoming-meeting-desc">Review and manage your recent meetings quickly and efficiently. Review recordings, and follow up with participants. Keep track of important details, or <NavLink to='/home/meeting/upcoming-meetings' className='learn-more-link'>Schedule</NavLink> meetings with ease for continued collaboration.</div>
          <div className="upcoming-meeting-list-cntnr">
              {recentMeetings.length!=0 ? <div className="upcoming-meeting-list-item-wrapper"><RecentActivity recentActivity={recentMeetings}/></div> 
              : <div className='no-upcoming-meeting-msg'>No Recent Meetings</div>}
          </div>
          
          <div className="upcoming-meeting-bottom">
            <div className="personal-room-bottom-options upcoming-meeting-btns">
            <div className="bottom-option-start-btn bottom-option" onClick={()=>handleCreateMeeting}><div className="bottom-option-icon"><PiVideoCameraFill/></div> Start New</div>
            <div className="bottom-option-join-btn bottom-option"><div className="bottom-option-icon"><TbSquareRoundedPlusFilled/></div> Join a Meeting</div>
            </div>
        </div>
        </div>)}
      </div>
    )
}

export default RecentMeeting
