import React,{useState} from 'react'
import {PiMicrophone, PiMicrophoneSlash, PiVideoCamera, PiVideoCameraSlash, PiUsersThree, PiChats, PiDotsThreeCircle, PiMonitorArrowUpFill} from "react-icons/pi";
import {useRoomContext} from '../contexts/RoomContextPro'

const RoomBottomBar = () => {

    
    const {roomStates,setRoomStates,roomHandlers} = useRoomContext();
    const {handleOpenChat,handleOpenParticipant,handleMicClick,handleVideoClick,handleStartScreenShare, handleStopScreenShare,stopMedia} = roomHandlers
    const {isVisible,isMicOn,isVideoOn,meId,isChatOpen,isParticipantOpen,isScreenSharing} = roomStates;
    const {setIsHovered} = setRoomStates;


    

  return (
    <div>
      <div className={`bottom-bar-main-container ${isVisible || isChatOpen || isParticipantOpen ? 'visible' : 'hidden'}`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          <div className="bottom-bar">
            <button className="bottom-bar-button all-btn" onClick={handleMicClick}>{isMicOn ? <><div className="bottom-bar-icon"><PiMicrophone /> </div> Mute</> : <><div className="bottom-bar-icon icon-off"><PiMicrophoneSlash /></div> Unmute</>}</button>
            <button className="bottom-bar-button all-btn" onClick={handleVideoClick}>{isVideoOn ? <><div className="bottom-bar-icon"><PiVideoCamera /> </div> Close Video </> : <><div className="bottom-bar-icon icon-off"><PiVideoCameraSlash /></div> Start Video</>}</button>
            {/* <button className="bottom-bar-button all-btn" onClick={''}><div className="bottom-bar-icon icon-color"><PiMonitorArrowUpFill /> </div> Share Screen</button> */}
            <button className="bottom-bar-button all-btn" onClick={isScreenSharing?handleStopScreenShare:handleStartScreenShare}><div className="bottom-bar-icon icon-color"><PiMonitorArrowUpFill /> </div> {isScreenSharing?'Stop Sharing':'Share Screen'}</button>
            <button className="bottom-bar-button all-btn" onClick={handleOpenParticipant}><div className="bottom-bar-icon"><PiUsersThree /> </div> Participants</button>
            <button className="bottom-bar-button chat-btn" onClick={handleOpenChat}><div className="bottom-bar-icon"><PiChats /> </div> Chat</button>
            <button className="bottom-bar-button all-btn" onClick={stopMedia} ><div className="bottom-bar-icon"><PiDotsThreeCircle /> </div> More</button>
          </div>
        </div>
    </div>
  )
}

export default RoomBottomBar
