import React, { useContext, useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import AllNote from './AllNote'
import CompletedNote from './CompletedNote'
import PendingNote from './PendingNote'
import { BiSolidEdit } from 'react-icons/bi'
import CryptoJS from 'crypto-js'
import {useToast} from '../../ToastService'
import {TopLoaderSkeleton} from '../userMeeting/LoaderSkeleton'
import {userContext} from '../../App'


const NotePreview = () => {

  const [activeTab,setActiveTab] = useState('All')
  // const [userId, setUserId] = useState("");
  const [notes, setNotes] = useState([]);
  const [isDataLoading,setIsDataLoading] = useState(false)
  const {notifySuccess,notifyError} = useToast();
  const {userInfo,isLoading} = useContext(userContext)
  const [loading,setLoading] = useState(true)
  const userId = userInfo.userId;

//   useEffect(()=>{
//     const secretKey = "zoomClone"
//     const userInfo = localStorage.getItem('userData');
//     if(userInfo){
//         const bytes = CryptoJS.AES.decrypt(userInfo, secretKey);
//         const userData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
//         setUserId(userData.userId)
//     }
    
// },[]);

 
  const updateNoteStatus = async (noteId) =>{
    if(userId){
      try{
        const response = await fetch('http://localhost:5000/api/note/updateNoteStatus',{
          method:'POST',
          headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify({userId,noteId}),
        });
        const data=await response.json();
        if(response.ok){
          notifySuccess(data.message)
          setNotes((prevNotes) =>
            prevNotes.map((note) =>
              note.noteId === noteId ? { ...note, status: !note.status } : note
            )
          );
        }
        // setLoading(false)
      }catch(err){
        console.log(err)
      }
    }
  }

  const deleteNote = async (noteId) =>{
    if(userId){
      try{
        const response = await fetch('http://localhost:5000/api/note/deleteNote',{
          method:'DELETE',
          headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify({userId,noteId}),
        });
        const data=await response.json();
        if(response.ok){
          notifySuccess(data.message)
          setNotes((prevNotes) =>prevNotes.filter((note) =>note.noteId !== noteId ));
        }
        else{
          notifyError(data.message)
        }

      }catch(err){
        console.log(err)
      }
    }
  }

  useEffect(()=>{
    const fetchNotes = async ()=>{
      if(userId){
      try{
        setIsDataLoading(true);
        const response = await fetch(`http://localhost:5000/api/note/fetch/${userId}/${activeTab}`,{
          method:'GET',
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data=await response.json();
        if(response.ok){
          setNotes(data.notes)
        }
        setTimeout(()=>{
          setIsDataLoading(false)
        },500)
      }catch(err){
        console.log(err);
      }
    }
  }
    fetchNotes();
  },[activeTab,userId])

  

    useEffect(()=>{
      if(!isLoading){
      setTimeout(()=>{
        setLoading(false)
      },400)
    }
    },[isLoading])


  return (
    <div>
      <div className="user-meeting-page-main-container">
      {loading ? <TopLoaderSkeleton/>:(
          <div className="user-meeting-page-top-wrapper">
          <div className="note-header-top"><div className="user-meeting-page-main-header">Tasks & Notes</div><NavLink to='/home/notes/editor' className="create-note-button"><div className="bottom-option-icon" style={{fontSize:'16px'}}><BiSolidEdit/></div>Create</NavLink></div>
          <div className="user-meeting-page-top-bar-wrapper">
            <div className={`${activeTab==='All' ? 'tab-active' : ''} user-meeting-top-bar-tab`} onClick={()=>setActiveTab('All')}>All</div>
            <div className={`${activeTab==='Completed' ? 'tab-active' : ''} user-meeting-top-bar-tab`} onClick={()=>setActiveTab('Completed')}>Completed</div>
            <div className={`${activeTab==='Pending' ? 'tab-active' : ''} user-meeting-top-bar-tab`} onClick={()=>setActiveTab('Pending')}>Pending</div>
          </div>
          </div>)}

          <div className="note-list-tab-preview">
            {activeTab === 'All'? <AllNote notes={notes} updateNoteStatus={updateNoteStatus} isLoading={isDataLoading} deleteNote={deleteNote}/> : '' }
            {activeTab === 'Completed'? <CompletedNote notes={notes.filter(note => note.status)} updateNoteStatus={updateNoteStatus} isLoading={isDataLoading} deleteNote={deleteNote}/> : ''}
            {activeTab === 'Pending'? <PendingNote notes={notes.filter(note => !note.status)} updateNoteStatus={updateNoteStatus} isLoading={isDataLoading} deleteNote={deleteNote}/> : ''}
          </div>
        </div>
    </div>
  )
}

export default NotePreview
