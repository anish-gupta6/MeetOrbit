import React, { useContext, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import EmptyBox from '../../assets/empty-box.png'
import { BsBookmarkPlusFill } from 'react-icons/bs'
import {ContentLoaderSkeleton} from '../userMeeting/LoaderSkeleton'
import {userContext} from '../../App'

const FavouriteRecording = () => {
  const [favRecordingList,setFavRecordingList] = useState([])
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
        <div className="upcoming-meeting-header">My Favourite Recordings</div>
        <div className="upcoming-meeting-desc">Quickly access your favorite meeting recordings all in one place. Easily revisit key discussions, share important sessions, or save them for future reference. Keep your most valuable content at your fingertips for seamless productivity and collaboration.</div>
        <div className="upcoming-meeting-list-cntnr" style={{minHeight:'300px'}}>
            {favRecordingList.length!==0 ? <div className="upcoming-meeting-list-item-wrapper">

            {/* </div> : <div className='no-upcoming-meeting-msg no-recording'><img src={EmptyBox} className='no-recording-img' alt="p" /> <div className="no-recording-msg">No Favourites Recordings</div></div>} */}
            </div> : <div className='no-upcoming-meeting-msg no-recording'><img src={EmptyBox} className='no-recording-img' alt="p" /></div>}
        </div>

        <div className="upcoming-meeting-bottom">
            <div className="personal-room-bottom-options upcoming-meeting-btns">
              <NavLink to='/home/recording' className="bottom-option-join-btn bottom-option"><div className="bottom-option-icon"><BsBookmarkPlusFill/></div>Import to Favourite Recordings</NavLink>
            </div>
        </div>
      </div>)}
    </div>
  )
}

export default FavouriteRecording
