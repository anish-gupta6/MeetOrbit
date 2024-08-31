import React from 'react'
import './Navbar.css'
import {Link} from 'react-router-dom'

const Navbar = () => {
  return (
    <div>
      <header className="nav-header-container">
    <nav className="upper-nav-main-container">
      <div className="lower-navlinks-main-container">
        <Link to='/' className="upper-nav-logo-container"><img src="https://us05st2.zoom.us/static/6.3.24306/image/new/topNav/Zoom_logo.svg" alt="" /></Link>
      </div>


      <div className="upper-nav-auth-container">
        <div className="upper-nav-auth-btn-cntnr">
        <Link to="/" className="upper-nav-join-host"><span>Join</span></Link>
        <Link to="/" className="upper-nav-join-host"><span>Host</span></Link>
          <span className="border-right-icon">|</span>
          <Link to="/signin" className="upper-nav-auth-signIn-btn upper-nav-auth-btn"><span>Sign In</span></Link>
        </div>

      </div>
    </nav>
  </header>
    </div>
  )
}

export default Navbar
