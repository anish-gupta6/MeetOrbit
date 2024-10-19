import React from 'react'
import {Link} from 'react-router-dom'
import Logo from '../../assets/Logo.png'

const MidNavbar = () => {
    const midNavStyle={
      position:'fixed',
      top:'0',
      width:'100%',
      backgroundColor:'white',
      boxShadow:'rgba(50, 50, 93, 0.04) 0px 6px 12px -2px, rgba(0, 0, 0, 0.08) 0px 3px 7px -3px',
      userSelect:'none',
      zIndex:'1',
      lineHeight: '80px',
      padding:'13px 30px'
  }
  // box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
  return (
    <div>
    <div style={midNavStyle}>
      <Link to='/' style={{display:'flex',alignItems:'center'}}><img src={Logo} alt="" className='upper-nav-logo'/></Link>
      </div>
    </div>
  )
}

export default MidNavbar
