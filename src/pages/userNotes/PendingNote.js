import React, { useEffect,useState } from 'react'
import { BiSolidPencil, BiSolidTrash } from 'react-icons/bi';
import EmptyBox from '../../assets/empty-box.png'
import NoteSkeleton from './NoteSkeleton';

const PendingNote = ({notes,updateNoteStatus,isLoading,deleteNote}) => {
  const [isImgLoading,setIsImgLoading] = useState(true)
  useEffect(()=>{
    setTimeout(()=>{
      setIsImgLoading(false)
    },300)
  })
  return (
    <div>
      {isLoading ? (<NoteSkeleton/>) :(
        notes.length>0?(
      <div className="note-list-main-container">
        {notes.map((note) => (
        <div className="note-content-card-main-wrapper" key={note.noteId}>
            <div className="note-card-top">
                <div className={`note-card-note-type ${note.type==='Personal'?'first':'second'}`}>{note.type}</div>
                <div className="note-content-card-controls">
                    <div className="note-card-control-btn"><input type="checkbox" name="complete-check-box" id="complete-check" checked={note.status} onChange={()=>updateNoteStatus(note.noteId)}/></div>
                    <div className="note-card-control-btn edit-btn"><BiSolidPencil/></div>
                    <div className="note-card-control-btn trash-btn" onClick={()=>deleteNote(note.noteId)}><BiSolidTrash/></div>
                </div>
            </div>
            <div className="note-card-content">
                <div className="note-card-content-title">{note.title}</div>
                <div className="note-card-content-desc" dangerouslySetInnerHTML={{ __html: note.content }}></div>
            </div>
            <div className="note-card-date-cntnr">{new Date(note.createdAt).toLocaleString(undefined, {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true, 
            })}</div>
        </div>
        ))}

      </div>):(!isImgLoading && <div className='no-notes'><img src={EmptyBox} className='no-recording-img' alt="p" /></div> ))}
    </div>
  )
}

export default PendingNote
