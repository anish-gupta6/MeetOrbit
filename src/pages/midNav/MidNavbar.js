import React from 'react'
import {Link} from 'react-router-dom'

const MidNavbar = () => {
    const midNavStyle={
      position:'fixed',
      top:'0',
      padding:'0 20px 0 70px',
      width:'100%',
      backgroundColor:'white',
      boxShadow:'0 8px 16px 0 rgba(0,0,0,0.1)',
      userSelect:'none',
      zIndex:'1'
  }
  return (
    <div>
    <div style={midNavStyle}>
      <Link to='/' style={{display:'flex',alignItems:'center',padding:'16px 0'}}><img src="https://us05st2.zoom.us/static/6.3.24306/image/new/topNav/Zoom_logo.svg" alt="" /></Link>
      </div>
    </div>
  )
}

export default MidNavbar
