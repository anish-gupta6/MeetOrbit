import React from 'react'
import { HiOutlineTrash } from 'react-icons/hi'

const RecentActivity = ({recentActivity}) => {

  const convertTime = (seconds) =>{
    if (seconds < 60) {
      seconds = Math.floor(seconds);
      return `${seconds}second${seconds !== 1 ? 's' : ''}`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes}min${minutes !== 1 ? 's' : ''}${remainingSeconds > 0 ? ` ${remainingSeconds}s` : ''}`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const remainingMinutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${hours}hr${hours !== 1 ? 's' : ''}${remainingMinutes > 0 ? ` ${remainingMinutes}min${remainingMinutes !== 1 ? 's' : ''}` : ''}${remainingSeconds > 0 ? ` ${remainingSeconds}s` : ''}`;
    }
  }
  return (
    <div>
      <div className="recent-activity-wrapper">
        {recentActivity.slice().reverse().map((activity,index)=>(
        <div className="recent-activity-item" key={index}>
            <div className="recent-activity-details">
                <div className="recent-activity-title">{activity.title}</div>
                <div className="recent-activity-desc">
                    <div className="recent-activity-start-date">{new Date(activity.startTime).toLocaleString()}</div>
                    <div className="recent-activity-duration">{convertTime(activity.duration)}</div>
                </div>
            </div>
            {/* <div className="recent-activity-option-wrapper"> */}
              <div className="recent-activity-option-icon"><HiOutlineTrash/></div>
              {/* <div className="recent-option">
                <div className="recent-option-item"></div>
              </div> */}
            {/* </div> */}
        </div>))}
      </div>
    </div>
  )
}

export default RecentActivity
