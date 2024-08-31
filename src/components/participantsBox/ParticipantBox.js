import React, { useState } from 'react'
import './ParticipantBox.css'
import { PiMicrophoneSlashBold, PiVideoCameraSlashBold, PiXBold } from 'react-icons/pi'

const ParticipantBox = ({handleOpenParticipant}) => {
  return (
    <div>
      <div className="participantbox-main-container">
        
        <div className="participantbox-top-nav">
            <div className="participantbox-nav-title">Participants</div>
            <div className="participantbox-close-btn" onClick={handleOpenParticipant}><PiXBold/></div>
        </div>

        <div className="participantbox-main-wrapper">
            <div className="participant-wrapper">
                <div className="participant-details">
                    <div className="participant-profile">A</div>
                    <div className="participant-name">Anish Gupta</div>
                </div>
                <div className="participant-media-status">
                    <div className="mic-status media-status"><PiMicrophoneSlashBold/></div>
                    <div className="video-status media-status"><PiVideoCameraSlashBold/></div>
                </div>
            </div>

            <div className="participant-wrapper">
                <div className="participant-details">
                    <div className="participant-profile">A</div>
                    <div className="participant-name">Anish Gupta</div>
                </div>
                <div className="participant-media-status">
                    <div className="mic-status media-status"><PiMicrophoneSlashBold/></div>
                    <div className="video-status media-status"><PiVideoCameraSlashBold/></div>
                </div>
            </div>
        </div>

      </div>
    </div>
  )
}

export default ParticipantBox
