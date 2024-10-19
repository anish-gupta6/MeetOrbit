import React, { useState,useEffect } from 'react'
import './ParticipantBox.css'
import { PiMicrophoneBold, PiMicrophoneSlashBold, PiVideoCameraBold, PiVideoCameraSlashBold, PiXBold } from 'react-icons/pi'
import {useRoomContext} from '../contexts/RoomContextPro'

const ParticipantBox = () => {
  const {roomHandlers,roomStates,setRoomStates} = useRoomContext();
  const {handleOpenParticipant} = roomHandlers;
  const {meetingId,participants,me,isMicOn,isVideoOn} = roomStates;
    const {setParticipants} = setRoomStates;

  useEffect(()=>{

    const fetchParticipants = async () => {
    try{
    const response = await fetch(`http://localhost:3001/meeting/${meetingId}/participants`);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();

    if (Array.isArray(data.participants)) {
      setParticipants(data.participants);
    } else {
      setParticipants([]); // Fallback in case the response is not an array
      console.error("Chat history is not an array");
    }
    }
    catch(err){
      console.log(err)
    }

  }

  if(meetingId){
    fetchParticipants();
  }
  
  },[meetingId,participants,isMicOn,isVideoOn])
  return (
    <div>
      <div className="participantbox-main-container">
        
        <div className="participantbox-top-nav">
            <div className="participantbox-nav-title">Participants ( {participants.length} )</div>
            <div className="participantbox-close-btn" onClick={handleOpenParticipant}><PiXBold/></div>
        </div>

        <div className="participantbox-main-wrapper">
        {participants.map((participant, index) => (
            <div className="participant-wrapper" key={index}>
                <div className="participant-details">
                    <div className="participant-profile" style={{backgroundColor:`${participant.colorId}`}}>{participant.userName.charAt(0)}</div>
                    <div className="participant-name">{participant.userName} {me === participant.userId ? '(you)':''}</div>
                </div>
                <div className="participant-media-status">
                    <div className="mic-status media-status">{participant.micStatus ?<PiMicrophoneBold style={{color:'#666'}}/> :<PiMicrophoneSlashBold style={{color:'tomato'}}/>}</div>
                    <div className="video-status media-status">{participant.videoStatus ?<PiVideoCameraBold style={{color:'#666'}}/>:<PiVideoCameraSlashBold style={{color:'tomato'}}/>}</div>
                </div>
            </div>
        ))}

        </div>

      </div>
    </div>
  )
}

export default ParticipantBox
