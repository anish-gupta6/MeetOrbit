import React, { useEffect, useState,useRef } from 'react'
import './ChatBox.css'
import {PiArrowDownBold, PiPaperPlaneRightFill, PiXBold } from 'react-icons/pi'
import {useRoomContext} from '../contexts/RoomContextPro'

const ChatBox = () => {
    const [messageContent,setMessageContent]=useState('');
    const {roomHandlers,roomStates,setRoomStates} = useRoomContext();
    const {handleOpenChat,handleSendMessage} = roomHandlers;
    const {meetingId,chatHistory,me} = roomStates;
    const {setChatHistory} = setRoomStates;
    const chatWrapperRef = useRef(null);
    const [showScrollButton, setShowScrollButton] = useState(false);

    const handleMessageSend = (e) =>{
        e.preventDefault();
        handleSendMessage(messageContent);
        setMessageContent('')
        // if(messageContent.length>0){
         
        // const messageBox = document.createElement('div');
        // messageBox.classList.add('message-wapper');
        // messageBox.innerHTML=
        // `
        //     <div class="message-sender-name">Anish</div>
        //     <div class="message-content">${messageContent}</div>
        //  `;
        //  document.querySelector('.chatbox-chat-wrapper').append(messageBox);

        //  setMessageContent('')
            
        // }
    }

    useEffect(()=>{
      const fetchChatHistory = async () => {
      try{
      const response = await fetch(`http://localhost:3001/meeting/${meetingId}/chat`);

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();

      if (Array.isArray(data.chatHistory)) {
        setChatHistory(data.chatHistory);
      } else {
        setChatHistory([]); // Fallback in case the response is not an array
        console.error("Chat history is not an array");
      }
      }
      catch(err){
        console.log(err)
      }

    }
    if(meetingId){
    fetchChatHistory();
    }
    },[meetingId,chatHistory])


    useEffect(() => {
      if (chatWrapperRef.current) {
          const { scrollHeight, clientHeight, scrollTop } = chatWrapperRef.current;
          setShowScrollButton(scrollHeight > clientHeight + scrollTop);
      }
  }, [chatHistory]);

  const scrollToBottom = () => {
      if (chatWrapperRef.current) {
          chatWrapperRef.current.scrollTo({
              top: chatWrapperRef.current.scrollHeight,
              behavior: 'smooth',
          });
          const { scrollHeight, clientHeight, scrollTop } = chatWrapperRef.current;
          setShowScrollButton(scrollHeight > clientHeight + scrollTop);
      }
  };

  return (
    <div>
      <div className="chatbox-main-container">
        
        <div className="chatbox-top-nav">
            <div className="chatbox-nav-title">Meeting Chat</div>
            <div className="chatbox-close-btn" onClick={handleOpenChat}><PiXBold/></div>
        </div>

        <div className="chatbox-chat-wrapper" ref={chatWrapperRef}>
        {chatHistory.map((chat, index) => (
          <div className="message-cntnr">
            <div className="sender-profile" style={{backgroundColor:`${chat.colorId}`}}>{chat.userName.charAt(0)}</div>
          <div className="message-wapper" key={index}>
            <div className="message-sender-name" style={{color:`${chat.colorId}`}}>{chat.userName} {me === chat.userId ? '(you)':''}</div>
            <div className="message-content">{chat.message} </div>
            <div className='message-timestamp'>{new Date(chat.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
            
          </div>
          </div>
        ))}
        </div>

        {showScrollButton && (
          <button className="scroll-to-bottom-btn" onClick={scrollToBottom}><PiArrowDownBold/></button>
          )}

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
