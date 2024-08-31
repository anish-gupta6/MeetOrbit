// src/components/VideoStream.js
import React, { forwardRef } from 'react';

const VideoStream = forwardRef((props, ref) => (
  <div className="video-stream">
    <video ref={ref} autoPlay playsInline {...props} />
  </div>
));

export default VideoStream;
