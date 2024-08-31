import React, { useEffect, useState } from 'react'
// import {useSocket} from '../contexts/SocketProvider'
import {useLocation,useParams,useNavigate} from 'react-router-dom'
import CryptoJS from 'crypto-js'
import './MeetingMiddleware.css'

const MeetingMiddleware = () => {

  const [isLoading,setIsLoading] = useState(false);

    // const {socket} = useSocket();
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    // const roomId = queryParams.get('id');
    const roomPassword = queryParams.get('pwd');
    const {hostData,meetingId,meetingPassword} = location.state;
    const {mode}=useParams();



    const handleCreateRoom = async () => {
      try{
        const response = await fetch('http://localhost:3001/create-room',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({meetingId, meetingPassword})
        });
        if(response.ok){
          setIsLoading(true)
          setTimeout(()=>{
            navigate(`/meeting/room/s?id=${meetingId}&pwd=${roomPassword}`, { state: {roomId:meetingId,meetingPassword:meetingPassword,isHost:true,meetingDetails:hostData} });
          },3000)
        }
    }catch(err){
        console.log(err)
    }
      
    };
  
    const handleJoinRoom = async () => {
      try{
        const response = await fetch('http://localhost:3001/join-room',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({meetingId, meetingPassword})
        });
        if(response.ok){
          setIsLoading(true)
          setTimeout(()=>{
            navigate(`/meeting/room/s?id=${meetingId}&pwd=${roomPassword}`, { state: {roomId:meetingId,meetingPassword:meetingPassword,isHost:false} });
          },3000)
        }
    }catch(err){
        console.log(err)
    }
    };

    useEffect(()=>{
        if(mode==='start'){
          handleCreateRoom();
        }
        if(mode==='join'){
          handleJoinRoom();           
        }
        
    },[mode])

  return (
    <div className='middleware-main-wrapper'>
      {isLoading?<><div className="middleware-loader"></div><div className="middleware-loading-caption"></div></>:''}
      {/* <div className="middleware-loader"></div> */}
      
    </div>
  )
}

export default MeetingMiddleware


  


