import React,{useContext, useEffect, useState} from 'react'
import EmptyBox from '../../assets/empty-box.png'
import { PiTrashFill } from 'react-icons/pi'
import {ContentLoaderSkeleton} from '../userMeeting/LoaderSkeleton'
import {userContext} from '../../App'

const TrashRecording = () => {
    const [trashRecordingList,setTrashRecordingList] = useState([])
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
        <div className="upcoming-meeting-header">Trash Recordings</div>
        <div className="upcoming-meeting-desc">Manage and recover deleted meeting recordings from the trash. Easily restore important sessions or permanently delete them to free up space. Keep your recordings organized and ensure no valuable content is lost unintentionally.</div>
        <div className="upcoming-meeting-list-cntnr" style={{minHeight:'300px'}}>
            {trashRecordingList.length!==0 ? <div className="upcoming-meeting-list-item-wrapper">

            {/* </div> : <div className='no-upcoming-meeting-msg no-recording'><img src={EmptyBox} className='no-recording-img' alt="p" /> <div className="no-recording-msg">Empty Trash List</div></div>} */}
            </div> : <div className='no-upcoming-meeting-msg no-recording'><img src={EmptyBox} className='no-recording-img' alt="p" /></div>}
        </div>

        <div className="upcoming-meeting-bottom">
            <div className="personal-room-bottom-options upcoming-meeting-btns">
              <button className="bottom-option-clear-trash bottom-option"><div className="bottom-option-icon" style={{fontSize:'16px'}}><PiTrashFill/></div>Clear Trash</button>
            </div>
        </div>
      </div>)}
      </div>
    )
}

export default TrashRecording
