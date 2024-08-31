import React, { useState } from 'react'
import './ChatBox.css'
import { PiPaperPlaneRight, PiPaperPlaneRightFill, PiXBold } from 'react-icons/pi'

const ChatBox = ({handleOpenChat}) => {
    const [messageContent,setMessageContent]=useState('');

    const handleMessageSend = (e) =>{
        e.preventDefault();
        if(messageContent.length>0){
         
        const messageBox = document.createElement('div');
        messageBox.classList.add('message-wapper');
        messageBox.innerHTML=
        `
            <div class="message-sender-name">Anish</div>
            <div class="message-content">${messageContent}</div>
         `;
         document.querySelector('.chatbox-chat-wrapper').append(messageBox);

         setMessageContent('')
            
        }
    }
  return (
    <div>
      <div className="chatbox-main-container">
        
        <div className="chatbox-top-nav">
            <div className="chatbox-nav-title">Meeting Chat</div>
            <div className="chatbox-close-btn" onClick={handleOpenChat}><PiXBold/></div>
        </div>

        <div className="chatbox-chat-wrapper">
            
        </div>

        <div className="chatbox-chat-bottom">
            <form className="message-form" onSubmit={handleMessageSend}>
                <input type="text" name="message-input" placeholder="Type a message . . ." className='chatbox-chat-input' value={messageContent} onChange={(e)=>setMessageContent(e.target.value)} autoComplete="off"/>
                <button type='submit' className={`chatbox-chat-send-btn ${messageContent.length>0 ?'active':''}`} ><PiPaperPlaneRightFill/></button>
            </form>
        </div>

      </div>
    </div>
  )
}

export default ChatBox
