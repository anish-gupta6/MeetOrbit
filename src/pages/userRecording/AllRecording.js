import React,{useContext, useEffect, useState} from 'react'
import EmptyRecording from '../../assets/empty-recording.png'
import {ContentLoaderSkeleton} from '../userMeeting/LoaderSkeleton'
import {userContext} from '../../App'

const AllRecording = () => {
  const [allRecordingList,setAllRecordingList] = useState([])
  const {isLoading} = useContext(userContext)
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
      {loading? <ContentLoaderSkeleton/>:(
      <div className="upcoming-meeting-main-container">
        <div className="upcoming-meeting-header">Your Recordings</div>
        <div className="upcoming-meeting-desc">Access and manage all your recorded meetings in one place. Review, download, or share recordings with participants for future reference. Stay organized by easily locating past sessions and never miss out on valuable insights or discussions.</div>
        <div className="upcoming-meeting-list-cntnr" style={{minHeight:'300px'}}>
            {allRecordingList.length!==0 ? <div className="upcoming-meeting-list-item-wrapper">

            </div> : <div className='no-upcoming-meeting-msg no-recording'><img src={EmptyRecording} className='no-recording-img' alt="p" /> <div className="no-recording-msg">No Recordings Found</div></div>}
        </div>
      </div>)}
    </div>
  )
}

export default AllRecording
