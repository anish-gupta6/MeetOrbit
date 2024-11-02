import React, { useContext, useEffect, useState } from 'react'
// import {useSocket} from '../contexts/SocketProvider'
import {useLocation,useParams,useNavigate} from 'react-router-dom'
import CryptoJS from 'crypto-js'
import './MeetingMiddleware.css'
import {userContext} from '../../App'
import {useSocket} from '../contexts/SocketProvider'

const MeetingMiddleware = () => {
  const {userInfo} = useContext(userContext)
  const {endPoint} = useSocket();
  const [isLoading,setIsLoading] = useState(false);
  // const [meetingId,setmeetingId] = useState('')
  const [meetingPassword,setMeetingPassword] = useState('')

    // const {socket} = useSocket();
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const meetingId = queryParams.get('id');
    const roomPassword = decodeURIComponent(queryParams.get('pwd'));
    const {isMicOn,isVideoOn,userName,meetingTitle} = location.state || '';
    const {mode}=useParams();



    const handleCreateRoom = async () => {
      if(meetingId && meetingPassword){
        console.log(meetingId,meetingPassword,meetingTitle)
      try{
        const response = await fetch(`${endPoint}/meeting/create-room`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({meetingId, meetingPassword, meetingTitle, userId:userInfo.userId,userName:userInfo.userName})
        });
        if(response.ok){
          console.log('true')
          setIsLoading(true)
          setTimeout(()=>{
            navigate(`/meeting/room/s?id=${meetingId}&pwd=${encodeURIComponent(roomPassword)}`,{state:{userInfo,isMicOn:false,isVideoOn:true,userName:userInfo.meetingName}});
          },3000)
        }
        else{
          handleJoinRoom();
        }
    }catch(err){
        console.log(err)
    }
  }
      
    };
  
    const handleJoinRoom = async () => {
      if(meetingId && meetingPassword){
        console.log(meetingId,meetingPassword)
      try{
        const response = await fetch(`${endPoint}/meeting/join-room`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({meetingId, meetingPassword})
        });
        if(response.ok){
          setIsLoading(true)
          setTimeout(()=>{
            navigate(`/meeting/room/s?id=${meetingId}&pwd=${encodeURIComponent(roomPassword)}`,{state:{userInfo,isMicOn,isVideoOn,userName}});
          },3000)
        }
    }catch(err){
        console.log(err)
    }
  }
    };

    useEffect(()=>{
      // console.log(encodeURIComponent(roomPassword))
      const secretKey = 'zoomClone'
      const bytes =  CryptoJS.AES.decrypt(roomPassword, secretKey);
      const decMeetingPassword = bytes.toString(CryptoJS.enc.Utf8);
      setMeetingPassword(decMeetingPassword)
      console.log(userInfo)
        if(mode==='start'){
          handleCreateRoom();
        }
        if(mode==='join'){
          handleJoinRoom();
        }
        
    },[mode,meetingId,meetingPassword,location])

  return (
    <div className='middleware-main-wrapper'>
      {isLoading?<><div className="middleware-loader"></div><div className="middleware-loading-caption"></div></>:''}
      {/* <div className="middleware-loader"></div> */}
      
    </div>
  )
}

export default MeetingMiddleware


  


