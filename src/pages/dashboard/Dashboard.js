import React, { useState,useEffect} from 'react';
import {Link,useNavigate,Outlet,useLocation} from 'react-router-dom'
import './Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faBell, faL} from '@fortawesome/free-solid-svg-icons'
import { PiHouseBold, PiTagFill  ,PiVideoCameraFill ,PiVideoFill ,PiGearFill , PiVideoConferenceFill ,PiEnvelopeBold ,PiQuestionBold,PiUserCircleGearFill, PiSignOutBold,PiDotsThreeVerticalBold ,PiListBold, PiChartPieSliceBold, PiUserCircleFill   } from "react-icons/pi";
import CryptoJS from 'crypto-js'
import {UserAuth} from '../../components/contexts/AuthContext'


const Dashboard = ({onLogOut}) => {
    const navigate=useNavigate();
    const location=useLocation();
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [navId, setNavId] = useState('');
    const [userName, setUserName] = useState('');
    const [profileImg, setProfileImg] = useState('');
    const [activeLink, setActiveLink] = useState('Sign Out');
    const [searchFocused,setSearchFocused]=useState(false)
    const [isMobileSearchOpen,setIsMobileSearchOpen]=useState(false)
    const [searchQuery,setSearchQuery]=useState('');
    const {userLogOut} = UserAuth();

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query');

    useEffect(()=>{
        setActiveLink(location.pathname);
        setSidebarOpen(false)
        setDropdownOpen(false)
        // console.clear()
    },[location]);
    

    const toggleDropdown = () => {
        isDropdownOpen === true ? setDropdownOpen(false) : setDropdownOpen(true);
    }
    
    const toggleSidebar = () => {
        isSidebarOpen === true ? setSidebarOpen(false) : setSidebarOpen(true);
    }
    useEffect(()=>{
        const secretKey = "zoomClone"
        const userInfo = localStorage.getItem('userData');
        if(userInfo){
            const bytes = CryptoJS.AES.decrypt(userInfo, secretKey);
            const userData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            setUserName(userData.userName)
            setProfileImg(userData.profileImg.toString())
        }
        
    },[]);

    const handleFocus=()=>{
        setSearchFocused(true)
    }
    const handleBlur=()=>{
        setSearchFocused(false)
    }
    const handleViewProfile=()=>{
        navigate(`/dashboard/profile/${navId}`)
    }
    const handleMobileSearchBar=()=>{
        setIsMobileSearchOpen(true)
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
      
      const handleSearchQuery=(searchQuery)=>{
        setSearchQuery(searchQuery);
      }

      const handleSearch =(event)=>{
        event.preventDefault();
        navigate(`/dashboard/search?query=${searchQuery}`);
      }
      

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
                            <Link to="/dashboard" className='dashboard-logo'><img src="https://us05st2.zoom.us/static/6.3.24306/image/new/topNav/Zoom_logo.svg" alt="" /></Link>
                        </div>
                        </div>
                        

                        <div className="dashboard-main-preview-nav-shortlinks-cntnr">
                        {/* <form className={`dashboard-main-preview-nav-searchbar-cntnr ${searchFocused===true?'focused':''} ${isMobileSearchOpen===true?'showMobileSearch':''}`} onSubmit={handleSearch}>
                            <input type="text" name="Search" placeholder="Search Here..."
                                className="dashboard-main-preview-nav-search-field" id="dashboard-main-preview-nav-search" autoComplete="OFF" value={searchQuery}  onChange={(e) => handleSearchQuery(e.target.value)} onFocus={handleFocus} onBlur={handleBlur}/>
                            <button className="search-icon" type='submit'><PiMagnifyingGlassBold style={{ fontSize: '20px' }}/></button>
                        </form> */}
                        {/* <div className="mobile-search-icon-btn" onClick={handleMobileSearchBar}><PiMagnifyingGlassBold style={{ fontSize: '20px' }}/></div> */}
                        <div className="short-links">
                            <div className="dashboard-main-preview-nav-notification-icon"><Link to='/dashboard/notifications'><FontAwesomeIcon icon={faBell} className={`bell-icon ${activeLink==='/dashboard/notifications'?'link-active':''}`} style={{ fontSize: '20px' }}/></Link></div>
                            {/* <div className="slash-bar"> </div> */}
                            <div className="dashboard-main-preview-nav-profile-dropdown">
                                <div className="dashboard-main-preview-nav-profile-cntnr"  onClick={toggleDropdown}>
                                    <div className="dashboard-main-preview-nav-profile-img-cntnr"><img
                                        src={profileImg}
                                        alt="p" className="dashboard-main-preview-nav-profile-image" referrerPolicy="no-referrer"/></div>
                                        </div>
                                <div id="profile-Dropdown" className={`dashboard-main-preview-nav-profile-dropdown-content ${isDropdownOpen === true ? 'show' : ''}`}>
                                    <div className={`user-link user-person-link`} onClick={handleViewProfile}><PiUserCircleFill style={{fontSize:'23px'}}/> Profile</div>
                                    <div className="dropdown-border"></div>
                                    <Link to="/dashboard/edit-profile" className={`user-link`}><PiUserCircleGearFill style={{fontSize:'23px'}}/>Edit Profile</Link>
                                    <div className="dropdown-border"></div>
                                    <div className='user-link' onClick={userLogOut}>Sign Out<PiSignOutBold style={{fontSize:'20px'}}/></div>
                                </div>
                            </div>


                            {/* <div className="dashboard-main-preview-nav-meeting-dropdown">
                                <div className="dashboard-main-preview-nav-profile-cntnr"  onClick=''>
                                    <div className="mobile-search-icon-btn" ><PiDotsThreeVerticalBold  style={{ fontSize: '28px' }}/></div>
                                </div>
                                <div id="profile-Dropdown" className={`dashboard-main-preview-nav-profile-dropdown-content ${isDropdownOpen === true ? 'show' : ''}`}>
                                    
                                </div>
                            </div> */}
                            
                        </div>
                        </div>
                    </div>
                </div>
                <div className="view-section">
                <div className={`dashboard-main-sidebar-container ${isSidebarOpen === true ? 'active' : ''}`} >
                    <div className="dashboard-main-sidebar-upper">

                    <div className="dashboard-sidebar-profile-container" onClick={handleViewProfile}>
                            <div className='content' >
                                <div className="dashboard-sidebar-profile-img-cntnr"><img src={profileImg} alt='p' className="dashboard-sidebar-profile-image" referrerPolicy="no-referrer"/></div>
                                {/* <div className="dashboard-sidebar-profile-img-cntnr"><img src={userImg} alt="p" className="dashboard-sidebar-profile-image" /></div> */}
                                <div className="dashboard-sidebar-profile-info">
                                    <span className="dashboard-sidebar-profile-username">{userName}</span>
                                    <span className="dashboard-sidebar-profile-type">Basic Plan (free)</span>
                                </div>
                            </div>
                        </div>
                        {/* <hr className="dashboard-horizontal-line" /> */}

                        <div className="dashboard-sidebar-links-container">
                            <div className="dashboard-sidebar-links sidebar-link-home"><Link to="/dashboard" className={`${activeLink==='/dashboard'?'link-active':''}`}>
                                <div className="icon-cntnr"><PiHouseBold/></div><span>Home</span>
                            </Link></div>
                            <div className="dashboard-sidebar-links sidebar-link-home"><Link to="/dashboard/meeting" className={`${activeLink==='/dashboard/meeting'?'link-active':''}`}>
                                <div className="icon-cntnr"><PiVideoCameraFill /></div><span>Meetings</span>
                            </Link></div>
                            <div className="dashboard-sidebar-links sidebar-link-home"><Link to="/dashboard/webinar" className={`${activeLink==='/dashboard/webinar'?'link-active':''}`}>
                                <div className="icon-cntnr"><PiVideoConferenceFill /></div><span>Webinars</span>
                            </Link></div>
                            <div className="dashboard-sidebar-links sidebar-link-home"><Link to="/dashboard/recording" className={`${activeLink==='/dashboard/recording'?'link-active':''}`}>
                                <div className="icon-cntnr"><PiVideoFill  /></div><span>Recordings</span>
                            </Link></div>
                            <div className="dashboard-sidebar-links sidebar-link-home"><Link to="/dashboard/plan-pricing" className={`${activeLink==='/dashboard/plan-pricing'?'link-active':''}`}>
                                <div className="icon-cntnr"><PiTagFill   /></div><span>Plans & Pricing</span>
                            </Link></div>
                        </div>

                        <div className="dashboard-horizontal-line"></div>

                    </div>
                    <div className="dashboard-main-sidebar-lower">
                    {/* <hr className="dashboard-horizontal-line" /> */}
                        <div className="dashboard-support-link-container">
                            <div className="dashboard-help-container dashboard-sidebar-links">
                                <Link to="/help">
                                    <div className="icon-cntnr"><PiQuestionBold/></div>
                                    <span>Help</span>
                                </Link>
                            </div>
                            <div className="dashboard-feedback-container dashboard-sidebar-links">
                                <Link to="/contact-us">
                                    <div className="icon-cntnr"><PiEnvelopeBold /></div>
                                    <span>Contact Us</span>
                                </Link>
                            </div>
                            <div className="dashboard-feedback-container dashboard-sidebar-links">
                                <Link to="/dashboard/setting" className={`${activeLink==='/dashboard/setting'?'link-active':''}`}>
                                    <div className="icon-cntnr"><PiGearFill /></div>
                                    <span>Settings</span>
                                </Link>
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
