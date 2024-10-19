import React, { useContext, useState,useEffect } from 'react'
import { PiCalendarDotsFill } from 'react-icons/pi'
import {NavLink} from 'react-router-dom'
import {ReactComponent as StarSVG} from '../../assets/star-ai-svg.svg'
import {userContext} from '../../App'
import { ContentLoaderSkeleton } from './LoaderSkeleton'

const UpcomingMeeting = () => {
  const [upcomingMeetingList,setUpcomingMeetingList] = useState([])
  const [freeScheduleCount,setFreeScheduleCount] = useState(5)
  const {isLoading}=useContext(userContext)
  const [loading,setLoading] = useState(true)
  useEffect(()=>{
    if(!isLoading){
    setTimeout(()=>{
      setLoading(false)
    },400)
  }
  },[isLoading])
  return (
    <div>
      {loading ? <ContentLoaderSkeleton/>:(
      <div className="upcoming-meeting-main-container">
        <div className="upcoming-meeting-header">Schedule & Manage</div>
        <div className="upcoming-meeting-desc">Schedule new and manage existing meetings conveniently all in one place. Currently, you're limited to 25 minutes per meeting. Upgrade now for extended meeting durations and enhanced features!! <NavLink to='/plan-pricing' className='learn-more-link'> Learn More</NavLink></div>
        <div className="upcoming-meeting-list-cntnr">
            {upcomingMeetingList.length!=0 ? <div className="upcoming-meeting-list-item-wrapper">

            </div> : <div className='no-upcoming-meeting-msg'>No Upcoming Meetings</div>}
        </div>
        
        <div className="upcoming-meeting-bottom">
            <div className="remaining-schedule-info">{freeScheduleCount} free meeting schedules remaining <NavLink to='/plan-pricing' className="upgrade-notification-upgrade-link" style={{marginLeft:'20px',textDecoration:'none'}}>Upgrade <StarSVG/></NavLink></div>
            <div className="personal-room-bottom-options upcoming-meeting-btns">
                <button className="bottom-option-join-btn bottom-option" onClick={()=>setFreeScheduleCount((prev)=>prev-1)} disabled={freeScheduleCount===0?true:false}><div className="bottom-option-icon"><PiCalendarDotsFill/></div>Schedule Meeting</button>
                <NavLink to='/plan-pricing' className="bottom-option-copy-invite bottom-option">Upgrade Plan</NavLink>
            </div>
        </div>
      </div>)}
    </div>
  )
}

export default UpcomingMeeting
