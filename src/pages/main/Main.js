import React from 'react'
import './Main.css'
import Navbar from '../navbar/Navbar'
import { ReactComponent as HomeSVG } from '../../assets/home-svg.svg';
import {useToast} from '../../ToastService'
const Home = () => {
  const {notifySuccess,notifyError} = useToast();
  return (
    <div>
        <div className="home-main-container">

        <div className="home-nav-cntnr"><Navbar/></div>

       <div className="landing-container">
        <div className="text-section">
            <h1>Enhance Workplace Engagement by <span className="highlight">MeetOrbit</span></h1>
            <p>Streamline communication, increase employee engagement and improve productivity with MeetOrbit workplace. One platform for seamless and limitless human connetion.</p>
            <div className="buttons">
                <button className="btn-primary">Discover MeetOrbit Workplace</button>
                <button className="btn-secondary">Plans & Pricing</button>
            </div>
        </div>
        <div className="image-section">
            <HomeSVG/>
        </div>
    </div>
    </div>
    </div>
  )
}

export default Home
