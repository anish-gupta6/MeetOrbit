import React, { useState,useEffect, useContext} from 'react';
import {Link,useNavigate,Outlet,useLocation, NavLink} from 'react-router-dom'
import './Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faBell, faL} from '@fortawesome/free-solid-svg-icons'
import { PiHouseBold, PiTagFill  ,PiVideoCameraFill ,PiVideoFill ,PiGearFill , PiVideoConferenceFill ,PiEnvelopeBold ,PiQuestionBold,PiUserCircleGearFill, PiSignOutBold,PiDotsThreeVerticalBold ,PiListBold, PiChartPieSliceBold, PiUserCircleFill, PiNoteFill   } from "react-icons/pi";
import { RiMovie2Fill } from "react-icons/ri";
import CryptoJS from 'crypto-js'
import {UserAuth} from '../../components/contexts/AuthContext'
import Logo from '../../assets/Logo.png'
import User from '../../assets/profile-circle.png'
import { BiSolidChalkboard, BiSolidMoviePlay } from 'react-icons/bi';
import { TbHomeFilled } from "react-icons/tb";
import { HiHome } from 'react-icons/hi';
import {userContext} from '../../App'


const Dashboard = () => {
    const navigate=useNavigate();
    const location=useLocation();
    const {userInfo} = useContext(userContext);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [navId, setNavId] = useState('');
    const [userName, setUserName] = useState('');
    const [profileImg, setProfileImg] = useState('');
    const [activeLink, setActiveLink] = useState('');
    const [isMobileSearchOpen,setIsMobileSearchOpen]=useState(false)
    const {userLogOut} = UserAuth();

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query');

    useEffect(()=>{
        setActiveLink(location.pathname);
        setSidebarOpen(false)
        setDropdownOpen(false)
    },[location]);
    

    const toggleDropdown = () => {
        isDropdownOpen === true ? setDropdownOpen(false) : setDropdownOpen(true);
    }
    
    const toggleSidebar = () => {
        isSidebarOpen === true ? setSidebarOpen(false) : setSidebarOpen(true);
    }
    useEffect(()=>{
        // const secretKey = "zoomClone"
        // const userInfo = localStorage.getItem('userData');
        if(userInfo){
            // const bytes = CryptoJS.AES.decrypt(userInfo, secretKey);
            // const userData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            setUserName(userInfo.userName)
            setProfileImg(userInfo.profileImg)
        }
        
    },[userInfo]);

    const handleViewProfile=()=>{
        navigate(`/home/profile/${navId}`)
    }
    useEffect(() => {
        const handleOutsideClick = (event) => {
          if (isMobileSearchOpen && !event.target.closest('.dashboard-main-preview-outlet-nav-cntnr')) {
            setIsMobileSearchOpen(false);
          }
        };
    
        document.body.addEventListener('click', handleOutsideClick);
    
        return () => {
          document.body.removeEventListener('click', handleOutsideClick);
        };
      }, [isMobileSearchOpen]);


      useEffect(()=>{
        const outlet = document.querySelector('.dashboard-preview-outlet');
        outlet.scrollTo(0,0);
      },[location.pathname])

    return (
        <>
            <section className="body-dashboard-main-container">
                
                <div className="dashboard-main-preview-outlet-container">
                    <div className="dashboard-main-preview-outlet-nav-cntnr">
                        <div className="outlet-menu-logo">
                            <div className="dashboard-sidebar-burger-container" id="burger-menu" onClick={toggleSidebar}>
                                <PiListBold/>
                            </div>
                        <div className="web-name-logo-container">
                            <Link to="/home" className='dashboard-logo'><img src={Logo} alt="" /></Link>
                        </div>
                        </div>
                        

                        <div className="dashboard-main-preview-nav-shortlinks-cntnr">
                        <div className="short-links">
                            <div className="dashboard-main-preview-nav-notification-icon"><Link to='/home/notifications'><FontAwesomeIcon icon={faBell} className={`bell-icon ${activeLink==='/home/notifications'?'link-active':''}`} style={{ fontSize: '20px' }}/></Link></div>
                            
                            <div className="dashboard-main-preview-nav-profile-dropdown">
                                <div className="dashboard-main-preview-nav-profile-cntnr"  onClick={toggleDropdown}>
                                    <div className="dashboard-main-preview-nav-profile-img-cntnr"><img
                                        src={profileImg}
                                        alt="p" onError={(e)=>{e.onError=null;e.target.src=User}} className="dashboard-main-preview-nav-profile-image"/></div>
                                        </div>
                                <div id="profile-Dropdown" className={`dashboard-main-preview-nav-profile-dropdown-content ${isDropdownOpen === true ? 'show' : ''}`}>
                                    <div className={`user-link user-person-link`} onClick={handleViewProfile}><PiUserCircleFill style={{fontSize:'23px'}}/> Profile</div>
                                    <div className="dropdown-border"></div>
                                    <Link to="/home/edit-profile" className={`user-link`}><PiUserCircleGearFill style={{fontSize:'23px'}}/>Edit Profile</Link>
                                    <div className="dropdown-border"></div>
                                    <div className='user-link' onClick={userLogOut}>Sign Out<PiSignOutBold style={{fontSize:'20px'}}/></div>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
                <div className="view-section">
                <div className={`dashboard-main-sidebar-container ${isSidebarOpen === true ? 'active' : ''}`} >
                    <div className="dashboard-main-sidebar-upper">

                    {/* <div className="dashboard-sidebar-profile-container" onClick={handleViewProfile}>
                            <div className='content' >
                                <div className="dashboard-sidebar-profile-img-cntnr"><img src={profileImg} alt='p' className="dashboard-sidebar-profile-image" referrerPolicy="no-referrer"/></div>
                                
                                <div className="dashboard-sidebar-profile-info">
                                    <span className="dashboard-sidebar-profile-username">{userName}</span>
                                    <span className="dashboard-sidebar-profile-type">Basic Free Plan</span>
                                </div>
                            </div>
                        </div> */}
                        {/* <hr className="dashboard-horizontal-line" /> */}

                        <div className="dashboard-sidebar-links-container">
                            <div className="dashboard-sidebar-links sidebar-link-home"><NavLink to="/home" end className={({ isActive }) =>`${isActive ?'link-active':''}`}>
                                <div className="icon-cntnr"><HiHome/></div><span>Home</span>
                            </NavLink></div>
                            <div className="dashboard-sidebar-links sidebar-link-home"><NavLink to="/home/meeting" className={({ isActive }) =>`${isActive ?'link-active':''}`}>
                                <div className="icon-cntnr"><PiVideoCameraFill /></div><span>Meetings</span>
                            </NavLink></div>
                            {/* <div className="dashboard-sidebar-links sidebar-link-home"><Link to="/home/webinar" className={`${activeLink==='/home/webinar'?'link-active':''}`}>
                                <div className="icon-cntnr"><PiVideoConferenceFill /></div><span>Webinars</span>
                            </Link></div> */}
                            <div className="dashboard-sidebar-links sidebar-link-home"><NavLink to="/home/recording" className={({ isActive }) =>`${isActive ?'link-active':''}`}>
                                <div className="icon-cntnr"><BiSolidMoviePlay /></div><span>Recordings</span>
                            </NavLink></div>
                            <div className="dashboard-sidebar-links sidebar-link-home"><NavLink to="/home/notes" className={({ isActive }) =>`${isActive ?'link-active':''}`}>
                                <div className="icon-cntnr"><PiNoteFill/></div><span>Tasks & Notes</span>
                            </NavLink></div>
                            <div className="dashboard-sidebar-links sidebar-link-home"><NavLink to="/home/whiteboard" className={({ isActive }) =>`${isActive ?'link-active':''}`}>
                                <div className="icon-cntnr"><BiSolidChalkboard/></div><span>Whiteboard</span>
                            </NavLink></div>
                        </div>

                        {/* <div className="dashboard-horizontal-line"></div> */}

                    </div>
                    <div className="dashboard-main-sidebar-lower">
                    {/* <hr className="dashboard-horizontal-line" /> */}
                        <div className="dashboard-support-link-container">
                            <div className="dashboard-help-container dashboard-sidebar-links">
                                <NavLink to="/help">
                                    <div className="icon-cntnr"><PiQuestionBold/></div>
                                    <span>Help</span>
                                </NavLink>
                            </div>
                            <div className="dashboard-feedback-container dashboard-sidebar-links">
                                <NavLink to="/contact-us">
                                    <div className="icon-cntnr"><PiEnvelopeBold /></div>
                                    <span>Contact Us</span>
                                </NavLink>
                            </div>
                            <div className="dashboard-feedback-container dashboard-sidebar-links">
                                <NavLink to="/home/setting" className={({ isActive }) =>`${isActive ?'link-active':''}`}>
                                    <div className="icon-cntnr"><PiGearFill /></div>
                                    <span>Settings</span>
                                </NavLink>
                            </div>
                        </div>

                        {/* <hr className="dashboard-horizontal-line" /> */}

                        
                    </div>
                </div>
                    <div className="dashboard-preview-outlet">
                        <Outlet/>
                    </div>
                </div>

                <div className={`sidebar-overlay ${isSidebarOpen === true ? 'active' : ''}`} onClick={toggleSidebar}></div>
                <div className={`dropdown-overlay ${isDropdownOpen === true ? 'active' : ''}`} onClick={toggleDropdown}></div>
            </section>
        </>
    );
}

export default Dashboard;
