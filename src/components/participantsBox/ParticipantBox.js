import React, { useState, useEffect } from 'react'
import './ParticipantBox.css'
import { PiDotsThreeCircle, PiMicrophoneBold, PiMicrophoneSlashBold, PiVideoCameraBold, PiVideoCameraSlashBold, PiXBold } from 'react-icons/pi'
import { useRoomContext } from '../contexts/RoomContextPro'
import { useSocket } from '../contexts/SocketProvider'

const ParticipantBox = () => {
  const { endPoint, socket } = useSocket();
  const { roomHandlers, roomStates, setRoomStates } = useRoomContext();
  const { handleOpenParticipant } = roomHandlers;
  const { meetingId, participants, me, isMicOn, isVideoOn, isHost } = roomStates;
  const { setParticipants } = setRoomStates;
  const [hosts, setHosts] = useState([]);
  const [activeParticipantOption, setActiveParticipantOption] = useState(null); // State to track the active dropdown for each participant

  const fetchParticipants = async () => {
    try {
      const response = await fetch(`${endPoint}/meeting/${meetingId}/participants`, {
        method: 'GET',
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();

      if (Array.isArray(data.participants) && Array.isArray(data.hosts)) {
        setParticipants(data.participants);
        setHosts(data.hosts);
      } else {
        setParticipants([]);
        setHosts([]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (meetingId) {
      fetchParticipants();
    }
    socket.on('host-changed', () => {
      fetchParticipants();
    });
  }, [meetingId, participants, isMicOn, isVideoOn, socket]);

  // Sort participants to ensure 'me' is on top
  const sortedParticipants = [...participants].sort((a, b) => {
    if (a.userId === me) return -1;
    if (b.userId === me) return 1;
    return 0;
  });

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (activeParticipantOption && !event.target.closest('.participant-option-wrapper')) {
        setActiveParticipantOption(null);
      }
    };

    document.body.addEventListener('click', handleOutsideClick);

    return () => {
      document.body.removeEventListener('click', handleOutsideClick);
    };
  }, [activeParticipantOption]);

  const verifyMe = (id) => {
    return id === me;
  }
  const isHostUser = (id) => {
    return hosts.includes(id);
  }

  const makeHost = (userId) => {
    socket.emit('make-host', { meetingId, userId });
  }

  return (
    <div>
      <div className="participantbox-main-container">
        
        <div className="participantbox-top-nav">
            <div className="participantbox-nav-title">Participants ( {participants.length} )</div>
            <div className="participantbox-close-btn" onClick={handleOpenParticipant}><PiXBold/></div>
        </div>

        <div className="participantbox-main-wrapper">
        {sortedParticipants.map((participant, index) => (
            <div className="participant-wrapper" key={index}>
                <div className="participant-details">
                    <div className="participant-profile" style={{backgroundColor:`${participant.colorId}`}}>{participant.userName.charAt(0)}</div>
                    <div className="participant-desc">
                      <div className="participant-name">{participant.userName} {me === participant.userId ? '(you)':''}</div>
                      <div style={{fontSize:'10px',color:'#444',fontWeight:'600'}}>{hosts.includes(participant.userId)?'[ Host ]':''}</div>
                    </div>
                </div>
                <div className="participant-media-status">
                    <div className="mic-status media-status">{participant.micStatus ?<PiMicrophoneBold style={{color:'#666'}}/> :<PiMicrophoneSlashBold style={{color:'tomato'}}/>}</div>
                    <div className="video-status media-status">{participant.videoStatus ?<PiVideoCameraBold style={{color:'#666'}}/>:<PiVideoCameraSlashBold style={{color:'tomato'}}/>}</div>
                    
                    {/* {!isHostUser(participant.userId) && <div className="participant-option-wrapper">
                      <div className="option-icon media-status" onClick={() => setActiveParticipantOption(prev => prev === participant.userId ? null : participant.userId)}>
                        <PiDotsThreeCircle style={{fontSize:'22px'}} />
                      </div>
                      <div className={`participant-option-dropdown-cntnr ${activeParticipantOption === participant.userId ? 'active' : ''}`}>
                        <div className="participant-option">Rename</div>
                        {!verifyMe(participant.userId) && !isHostUser(participant.userId) && <div className="participant-option green-opt" onClick={() => makeHost(participant.userId)}>Make Host</div>}
                        {!verifyMe(participant.userId) && !isHostUser(participant.userId) && <div className="participant-option red-opt">Remove</div>}
                      </div>
                    </div>} */}
                </div>
            </div>
        ))}
        </div>
      </div>
    </div>
  )
}

export default ParticipantBox;
