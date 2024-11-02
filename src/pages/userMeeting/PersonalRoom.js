import React,{useContext, useEffect, useState} from 'react'
import { PiCameraFill, PiCaretDownBold, PiCaretUpBold, PiCheck, PiCopyFill, PiCopyLight, PiEyeFill, PiEyeSlashFill, PiVideoCameraFill } from 'react-icons/pi'
import { Link, useNavigate } from 'react-router-dom'
import {useToast} from '../../ToastService'
import { TbSquareRoundedPlusFilled } from 'react-icons/tb'
import CryptoJS from 'crypto-js'
import {userContext} from '../../App'
import {ContentLoaderSkeleton} from './LoaderSkeleton'

const PersonalRoom = () => {
    const navigate = useNavigate();
    const {userInfo,isLoading,backend} = useContext(userContext);
    // const meetingId = userInfo.meetingId;
    // const meetingPassword = userInfo.meetingPassword
    const hiddenPassword = '******'
    const [isPass,setIsPass] = useState(false)
    const [optionVisible,setOptionVisible] = useState(false)
    const [linkCopied,setLinkCopied] = useState(false)
    const {notifySuccess} = useToast();
  const [loading,setLoading] = useState(true)
  const [userDetail,setUserDetail] = useState({})
  const [meetingId,setMeetingId] = useState('')
  const [meetingPassword,setMeetingPassword] = useState('')

  
  

  useEffect(()=>{
    const fetchUserDetails = async () =>{
        try{
            
        const response = await fetch(`${backend}/api/auth/getUser/${userInfo.userId}`)
        if(response.ok){
            const data = await response.json();
            setUserDetail(data.userData)
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
},[])

useEffect(()=>{
  if(userDetail){
    setMeetingId(userDetail.meetingId)
    setMeetingPassword(userDetail.meetingPassword)
  }
},[userDetail])

    const handleCopyLink = (data) =>{
      navigator.clipboard.writeText(data).then(
        () => {
          setLinkCopied(true);
          notifySuccess('Meeting Link Copied !!')
          setTimeout(() => setLinkCopied(false), 3000); // Reset after 2 seconds
        },
        (err) => {
          console.error("Failed to copy text: ", err);
        }
      );
    }

    const handleCreateMeeting = () =>{
      const secretKey = 'zoomClone'
      const encMeetingPassword = CryptoJS.AES.encrypt(meetingPassword, secretKey).toString();
      navigate(`/meeting/room/start/j?id=${meetingId}&pwd=${encodeURIComponent(encMeetingPassword)}`);
    }

    

  return (
    <div>
      <div className="personal-room-main-cntnr">
      {loading ? <ContentLoaderSkeleton/>:(<>
        <div className="personal-room-details-btn">Details</div>

        <div className="personal-room-details-content">
                <div className="personal-room-details-table">
                <div className='personal-room-table-row'>
                  <div className="room-detail-table-column detail-column-1" style={{fontSize:'18px',fontWeight:'600',color:'#333'}}>Title</div>
                  <div className="room-detail-table-column detail-column-2" style={{fontSize:'18px',fontWeight:'600',color:'#333'}}>{userDetail.userName}'s Personal Meeting Room</div>
                </div>
                <div className='personal-room-table-row'>
                  <div className="room-detail-table-column detail-column-1">Meeting ID</div>
                  <div className="room-detail-table-column detail-column-2">{meetingId.slice(0, 3)} {meetingId.slice(3, 6)} { meetingId.slice(6)} </div>
                </div>
                <div className='personal-room-table-row'>
                  <div className="room-detail-table-column detail-column-1">Meeting Password</div>
                  <div className="room-detail-table-column detail-column-2"><div className="room-password">{isPass ? meetingPassword.toUpperCase() :hiddenPassword}</div> <div onClick={()=>setIsPass((prev)=>!prev)} className='pass-show-hide'>{isPass ? <PiEyeSlashFill/> :<PiEyeFill/>}</div></div>
                </div>
                <div className='personal-room-table-row'>
                  <div className="room-detail-table-column detail-column-1">Invite Link</div>
                  <div className="room-detail-table-column detail-column-2"><Link to={userDetail.meetingLink} className="column-link">{userDetail.meetingLink}</Link> <div className="room-meetingId-copy-btn" onClick={()=>handleCopyLink(userInfo.meetingLink)}>{linkCopied ? <PiCheck color='#0e72ed'/> :<PiCopyFill/>}</div></div>
                </div>
                <div className='personal-room-table-row'>
                  <div className="room-detail-table-column detail-column-1">Options</div>
                  <div className="room-detail-table-column detail-column-2 detail-option-column">
                    <div className="options-show-hide-btn" onClick={()=>setOptionVisible((prev)=>!prev)}> {optionVisible ?<>Hide <PiCaretUpBold/></> : <>Show <PiCaretDownBold/></>}</div>
                   { optionVisible && <div className="room-options-cntnr">
                        <div className="room-option-item">
                            <input type="checkbox" id="anytime-join" className='room-option-checkbox'/>
                            <label htmlFor="anytime-join" className='room-option-label'>Don't allow participants join after 10 mins</label>
                        </div>
                        <div className="room-option-item">
                            <input type="checkbox" id="auto-record" className='room-option-checkbox'/>
                            <label htmlFor="auto-record" className='room-option-label'>Allow participants to record meeting</label>
                        </div>
                        <div className="room-option-item">
                            <input type="checkbox" id="waiting-room" className='room-option-checkbox'/>
                            <label htmlFor="waiting-room" className='room-option-label'>Waiting Room</label>
                        </div>
                    </div>}
                  </div>
                </div>
                
                <div className="personal-room-bottom-options">
                    <div className="bottom-option-start-btn bottom-option" onClick={handleCreateMeeting}><div className="bottom-option-icon"><PiVideoCameraFill/></div> Start New</div>
                    <div className="bottom-option-join-btn bottom-option" onClick={()=>navigate('/join-meeting')}><div className="bottom-option-icon"><TbSquareRoundedPlusFilled/></div> Join a Meeting</div>
                    <div className="bottom-option-copy-invite bottom-option"><div className="bottom-option-icon"><PiCopyFill/></div> Copy Invitation</div>
                    <div className="bottom-option-edit-btn bottom-option">Edit</div>
                </div>

                </div>
              </div></>)}
      </div>
    </div>
  )
}

export default PersonalRoom
