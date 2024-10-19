import React, { useState, useEffect, useCallback, useRef } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css"; // Import the styles
import { PiArrowCircleLeftFill, PiXBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import {useToast} from '../../ToastService'
import CryptoJS from 'crypto-js'

const NoteEditor = () => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [noteType, setNoteType] = useState("");
  const [userId, setUserId] = useState("");
  const [selectedSize, setSelectedSize] = useState('');
  const titleRef = useRef();
  const navigate = useNavigate();
  const {notifySuccess,notifyError,notifyWarning} = useToast();


  useEffect(()=>{
    const secretKey = "zoomClone"
    const userInfo = localStorage.getItem('userData');
    if(userInfo){
        const bytes = CryptoJS.AES.decrypt(userInfo, secretKey);
        const userData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        setUserId(userData.userId)
    }
    
},[]);
   
  const toolBarStyle = {
    display: "flex",
    alignItems: "center",
    gap: "2px",
    border: "none",
  };
  const editorStyle = {
    height: "90%",
    backgroundColor: "white",
    border: "none",
  };



  const { quill, quillRef } = useQuill({
    modules: {
      toolbar: "#toolbar",
    },
    formats: [
      "size",
      "bold",
      "italic",
      "underline",
      "strike",
      "list",
      "link",
      "script",
    ],
    placeholder: 'Write your note here...',
  });

  

  const handleSave = async () => {
    const editorContent = quill.root.innerHTML;
    setContent(editorContent);
    if(!title){
      notifyWarning('Please give a title !!');
      return
    }
    if(content==='<p><br></p>'){
      notifyWarning('Please write something !!');
      return
    }
    if(!noteType){
      notifyWarning('Select note type !!');
      return
    }
    try {
      // Save content to the database using fetch
      const response = await fetch("http://localhost:5000/api/note/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({userId,title:title,noteType,content:editorContent }),
      });

      const data = await response.json();
      if (response.ok) {
        notifySuccess(data.message);
        navigate('/home/notes')
      } else {
        notifyError(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };


  const handleEditorClick = () => {
    if (quill) {
      quill.focus();
    }
  };

  const handleClear = () => {
    setTitle(""); // Clear the title
    if (quill) {
      quill.setText(''); // Clear the Quill editor content
    }
    titleRef.current.focus();
  };

  const handleTitleKeyDown = (event) => {
    
    if (event.key === "Enter") {
      event.preventDefault(); 
      if (quill) {
        quill.focus();
      }
    }
  };
  

 
  return (
    <div>
      <div className="note-editor-main-container">
        <div className="note-editor-top-wrapper">
          <div className="note-editor-header"><div className="note-back-icon" title="Go Back" onClick={()=>navigate(-1)}><PiArrowCircleLeftFill/></div>Note Editor</div>
        <div id="toolbar" style={toolBarStyle}>
          <select className="ql-size" value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
            <option value="small" />
            <option value="">Normal</option>
            <option value="large" />
            <option value="huge" />
          </select>
          <button className="ql-bold" />
          <button className="ql-italic" />
          <button className="ql-underline" />
          <button className="ql-strike" />
          <button className="ql-list" value="ordered" />
          <button className="ql-list" value="bullet" />
          <button className="ql-script" value="sub" />
          <button className="ql-script" value="super" />
          <button className="ql-link" />
        </div>
        </div>


        <div className="note-editor-container">
          <input type="text" ref={titleRef} placeholder="Write title here..." value={title} className="note-editor-title" onChange={(e)=>setTitle(e.target.value)} onKeyDown={handleTitleKeyDown} autoFocus/>
          <div ref={quillRef} style={editorStyle} onClick={handleEditorClick} className="note-editor-body"/>
        </div>

        <div className="select-note-type-popup-cntnr">
        <div className="select-note-type-header">Note Type: </div>
        <div className="select-note-type-check-cntnr">
          <div className="note-type-item">
            <input type="checkbox" id="General" checked={noteType==='General'} onChange={()=>setNoteType("General")}/>
            <label htmlFor="General">General</label>
          </div>
          <div className="note-type-item">
            <input type="checkbox" id="Personal" checked={noteType==='Personal'} onChange={()=>setNoteType("Personal")}/>
            <label htmlFor="Personal">Personal</label>
          </div>
        </div>
      </div>

        <div className="note-editor-btn-cntnr">
          <button onClick={handleClear} className="note-editor-btn note-clear">Clear All</button>
          <button onClick={handleSave} className="note-editor-btn note-save">Save</button>
          {/* <button className="note-editor-btn note-save">Save</button> */}
        </div>
      </div>

      

    </div>
  );
};

export default NoteEditor;
