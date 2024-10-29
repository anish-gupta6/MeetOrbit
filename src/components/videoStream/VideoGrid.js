import React,{useRef,useEffect,useState} from 'react'
import { PiCaretLeftBold, PiCaretRightBold, PiMicrophoneSlash, PiPushPinFill, PiPushPinSimpleFill, PiVideoCameraSlash } from 'react-icons/pi';
import {useRoomContext} from '../contexts/RoomContextPro'
import videoThumbnail from '../../assets/videoThumbnail.png'
import { TbPinnedFilled } from 'react-icons/tb';

const VideoGrid = () => {

    const videoRefs = useRef({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [pinnedStream, setPinnedStream] = useState({});
    const [isPinned, setIsPinned] = useState(false);
    const [screenSharer,setScreenSharer] = useState('')
    const {roomStates} = useRoomContext();
    const {socket,isVisible,streams,isVideoOn,me,isHovered} = roomStates;

  // Group streams into slides of 4
  const [slides, setSlides] = useState([]);
  useEffect(() => {
    // Create new slides array based on streams
    const newSlides = [];
    for (let i = 0; i < streams.length; i += 6) {
      newSlides.push(streams.slice(i, i + 6));
    }
    setSlides(newSlides); // Update state with new slides
    console.log(newSlides, currentIndex); // Logging the new slides and currentIndex
  }, [streams, currentIndex]);

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  useEffect(()=>{
    socket.on('screen-share-started', ({ userId}) => {
      console.log('stream',streams)
      const screenStream = streams.find(stream => stream.userId === userId);
      if(screenStream){
        setPinnedStream(screenStream)
        setIsPinned(me!==userId)
        setScreenSharer(userId)
      }
      console.log("screen",screenStream)
    });
    socket.on('screen-share-stopped', ({ userId}) => {
        setPinnedStream({})
        setIsPinned(false);
        setScreenSharer('');
    });
  },[streams,socket,pinnedStream])

  return (
    <div>
      {pinnedStream && isPinned &&(
        <div className={`pinned-video-grid ${isVisible? 'hovered':''}`}>
          

        <div className="pinned-video-container">
          <video
            autoPlay
            playsInline
            className="pinned-screen-video-element"
            disablePictureInPicture
            ref={(video) => {
              if (video) {
                if (!video.srcObject || video.srcObject !== pinnedStream.stream) {
                  video.srcObject = pinnedStream.stream;
                }
              }
            }}
          />
          <button className="unpin-button" onClick={() => console.log(streams)}>
            <PiPushPinFill/>
          </button>
        </div>

            <div className="pinned-grid-user-streams">
            {streams.map(({ userId,userName,colorId,micStatus,videoStatus,stream }) => (
              <div className="pinned-grid-wrapper" key={userId}>
                <div className="pinned-grid-user-video">
                
                {(!videoStatus || screenSharer===userId) ?<div className='pinned-grid-video-element'>
                  <div className="pinned-video-poster" style={{backgroundColor:`${colorId}`}}>
                    {userName?userName.charAt(0):'asdfasd'}
                  </div>
                  </div>:''}
              <video
                
                style={{visibility:`${(videoStatus && screenSharer!==userId )?'visible':'hidden'}`}}
                autoPlay
                playsInline
                className='pinned-grid-video-element'
                disablePictureInPicture
                ref={(video) => {
                  if (video) {
                    if (!videoRefs.current[userId]) {
                      videoRefs.current[userId] = video;
                      video.srcObject = stream;
                    } else if (video.srcObject !== stream) {
                      video.srcObject = stream;
                    }
                  }
                }}
              />
              </div>
              {/* <button className="unpin-button" onClick={() => console.log(streams)}>
                <PiPushPinFill/>
              </button> */}
              </div>
            ))}
            </div>

        </div>
      )}






{!isPinned &&(<>
      <div className={`carousel-container ${isVisible? 'hovered':''}`}>
      
        {slides.length > 1 && currentIndex > 0 &&(<button className={`carousel-button prev-button ${isVisible?'active':'inactive'}`} onClick={goToPrevious}>
          <PiCaretLeftBold/>
          </button> )}
       
        {slides.map((slide, slideIndex) => (
          <div
            className={`carousel-slide slide${slide.length} ${slideIndex === currentIndex ? 'active' : ''} `}
            key={slideIndex}>

            {slide.map(({ userId,userName,colorId,micStatus,videoStatus,stream }) => (
              <div className="slide-video-wrapper" key={userId}>
                <div className="slide-user-video">
                
                {!videoStatus && <div className='peer-video-element'>
                  <div className="video-poster" style={{backgroundColor:`${colorId}`}}>
                    {userName?userName.charAt(0):'asdfasd'}
                  </div>
                  </div>}
              <video
                
                style={{visibility:`${videoStatus?'visible':'hidden'}`}}
                autoPlay
                playsInline
                className='peer-video-element'
                disablePictureInPicture
                ref={(video) => {
                  if (video) {
                    if (!videoRefs.current[userId]) {
                      videoRefs.current[userId] = video;
                      video.srcObject = stream;
                    } else if (video.srcObject !== stream) {
                      video.srcObject = stream;
                    }
                  }
                }}
              />
              </div>
              <div className="user-stream-detail-cntnr">
                {!micStatus && <div className="stream-media-icon"><PiMicrophoneSlash/></div>}
                {!videoStatus && <div className="stream-media-icon"><PiVideoCameraSlash/></div>}
                <div className="user-stream-name">{userName}</div>
              </div>
              <button className="unpin-button" onClick={() => console.log(streams)}>
                <TbPinnedFilled/>
              </button>
              </div>
            ))}
          </div>
        ))}

      {slides.length > 1 && (<button className={`carousel-button next-button ${isVisible?'active':'inactive'}`} onClick={goToNext}>
        <PiCaretRightBold/>
      </button>)}
    </div>
      <div className="carousel-pagination">
        {slides.map((_, slideIndex) => (
          <span
            key={slideIndex}
            className={`carousel-dot ${slideIndex === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(slideIndex)}
          ></span>
        ))}
      </div></>)}
    </div>
  )
}

export default VideoGrid
