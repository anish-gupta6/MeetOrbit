import React, { useEffect, useState } from 'react'
import {useParams,Link,useNavigate} from 'react-router-dom'
import './UserProfile.css'
import {PiAddressBookFill, PiCaretRightBold, PiEnvelopeBold, PiGraduationCapFill, PiPhoneFill, PiPlusBold } from 'react-icons/pi'
import { MdContacts } from "react-icons/md";
import {FaEllipsisH, FaEnvelope, FaGraduationCap, FaPhoneAlt, FaUniversity } from 'react-icons/fa'
import { FaLocationDot } from "react-icons/fa6";
import UserPosts from '../userPosts/UserPosts'
import UserFollowers from '../userFollowers/UserFollowers'
import UserFollowings from '../userFollowing/UserFollowings'
import follower from '../../../assets/dummyJSON/FollowersData.json'
import FollowService from '../../auth/followService/FollowService.js'
import FollowerService from '../../auth/getFollowerDataService/FetchFollowerService.js'
import FollowingService from '../../auth/getFollowingDataService/FetchFollowingService.js'
// import selfFollowingService from '../../auth/loggedUserService/LoggedUserService.js'
import UserProfileSkeleton from '../userProfileAnimation/UserProfileSkeleton.js'

const UserProfile = () => {
  // const navigate=useNavigate();
  const navigate = useNavigate();
  const followService=FollowService();
  const followerService=FollowerService();
  const followingService=FollowingService();
  // const fetchSelfFollowing=selfFollowingService();
  const [activeTab,setActiveTab]=useState('posts');
  // const [userData,setUserData]=useState('');
  const {userId}=useParams();
  const [user, setUser] = useState({});
  // const usrId=currentUser.currentUser;
  
  const [usrId,setUsrId]=useState('')
  // const [followerId,setFollowerId]=useState('')
  const [usrName,setUsrName]=useState('')
  const [usrEmail,setUsrEmail]=useState('')
  const [followerCount,setFollowerCount]=useState()
  const [followingCount,setFollowingCount]=useState()
  const [followingData,setFollowingData]=useState([])
  const [selfFollowingData,setSelfFollowingData]=useState([])
  const [selfFollowerData,setSelfFollowerData]=useState([])
  const [followerData,setFollowerData]=useState([])
  const [followButtonValue,setFollowButtonValue]=useState('')
  const [selfProfile,setselfProfile]=useState(false)
  const [loading, setLoading] = useState(true);
  const firstFollowerData=followerData.slice(0,5);
  const [isMoreInfoOpen, setIsMoreInfoOpen] = useState(false);

  const [userUploads,setUserUploads]=useState([])
  const [userFiles,setUserFiles]=useState([])
  const data={
    phone:null,
    studyYear:null
  }

  useEffect(()=>{
    const fetchData = async () => {
      try {
          const userData = JSON.parse(localStorage.getItem('activeUser'));
          const isLogged = JSON.parse(localStorage.getItem('isLoggedIn'));
          if (userData !== null && isLogged !== null) {
              setUsrId(userData.userId);
              setUsrName(userData.userName);
              setUsrEmail(userData.userEmail);
          }
      } catch (error) {
          console.error('Error fetching user data:', error);
      }
  };
  
  fetchData();

  },[]);


  const handleFollowUnfollow= async ()=>{
    if(followButtonValue==='Follow' || followButtonValue==='Follow Back'){
    const response= await followService.followUser(usrId,userId);
    console.log(response)
    }
    else{
      const response= await followService.unFollowUser(usrId,userId);
      console.log(response)
    }
  }
  
  const handleTabSwitch=(value)=>{
    setActiveTab(value);
  }

  useEffect(()=>{
    setTimeout(()=>{
    const fetchFollowing=async ()=>{

      const userFollowerData = await followerService.fetchUserFollowers(userId);
      console.log(userFollowerData)
      setFollowerCount(userFollowerData.length)
      setFollowerData(userFollowerData)  

      const userFollowingData = await followingService.fetchUserFollowings(userId);
      setFollowingCount(userFollowingData.length)
      setFollowingData(userFollowingData)    

      if(usrId){
      const selfFollowerData = await followerService.fetchSelfFollowers(usrId);
      console.log(selfFollowerData)
      setSelfFollowerData(selfFollowerData)  

      const selfFollowingData = await followingService.fetchSelfFollowings(usrId);
      console.log(selfFollowingData)
      setSelfFollowingData(selfFollowingData)  
      }
  }
    fetchFollowing();
  },300)
  },[userId,usrId,setSelfFollowingData,selfFollowingData])


  useEffect(()=>{
    if(userId===usrId){
      setselfProfile(true);
    }
    else{
      setselfProfile(false);
    if(selfFollowingData.includes(userId)===true){
      setFollowButtonValue('Unfollow')
    }
    else{
      if(selfFollowerData.includes(userId)===true){
        setFollowButtonValue('Follow Back')
      }
      else{
        setFollowButtonValue('Follow')
      }
      
    }
  }
  },[userId,usrId,followButtonValue,selfFollowingData,selfFollowerData])


  useEffect( () => {
    const fetchData=async ()=>{
      setLoading(true);
      setActiveTab('posts')
    const response= await fetch(`http://localhost:3001/get-user-data/${userId}`,{
      method:'GET',
      mode:'cors',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data= await response.json();
    if(response.ok){
      
      const timer = setTimeout(() => {
        setLoading(false);
      }, 500);
      setUser(data);
      
    }
  }
  fetchData();
  }, [userId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (isMoreInfoOpen && !event.target.closest('.more-info-cntnr')) {
        setIsMoreInfoOpen(false);
      }
    };

    document.body.addEventListener('click', handleOutsideClick);

    return () => {
      document.body.removeEventListener('click', handleOutsideClick);
    };
  }, [isMoreInfoOpen]);

  const toggleDropdown = () => {
    setIsMoreInfoOpen(!isMoreInfoOpen);
  };

  useEffect(()=>{
    setTimeout(()=>{
    const fetchUserUploadsFiles=async ()=>{
        // if(userId){
            // console.log(UserId);
    try{
        // const checkDetails = new URLSearchParams({
        //   });
        const response=await fetch(`http://localhost:7001/fetch-user-uploads/${userId}`,{
            method:'GET',
            mode:'cors'                
        });
        if(response.ok){
            const data= await response.json();
            const uploadsArray=data.result;
            setUserUploads(uploadsArray)
        }

    }catch(error){
        console.log(error)
    }
// }
// }
    // const fetchUserFiles=async ()=>{
        // if(userId){
            // console.log(UserId);
    try{
        // const checkDetails = new URLSearchParams({
        //   });
        const response=await fetch(`http://localhost:7001/fetch-user-files/${userId}`,{
            method:'GET',
            mode:'cors'                
        });
        if(response.ok){
            const data= await response.json();
            const filesArray=data.result;
            setUserFiles(filesArray)
        }

    }catch(error){
        console.log(error)
    }
// }
}
fetchUserUploadsFiles();
},200)
// fetchUserFiles();
},[userId])
  
  return (
    <div>
      {loading ? (
        <UserProfileSkeleton/> // Render skeleton animation while loading
      ) : (
      
      <div className="userprofile-main-container">

        <div className="userprofile-view-container">
          <div className="profile-cover-container"></div>

          <div className="user-profile-info-container">

            <div className="user-profile">
              <div className="user-profile-image-container"><img src={user.profileImg} alt='profile' /></div>

              <div className="user-profile-data-container">
                <div className="user-name-follow-btn-cntnr">
                  <div className="user-name">{user.name}</div>
                  <button className={`user-follow-button ${selfProfile===true?'hide':''}`} onClick={handleFollowUnfollow}>{followButtonValue}</button>
                </div>
                <div className="follower-following-count-cntnr">
                  <div className="followers-count-value">{followerCount} Followers</div>
                  <div style={{fontWeight:'bold',fontSize:'15px',marginTop:'-8px',height:'5px'}}>.</div>
                  <div className="following-count-value">{followingCount} Following</div>
                </div>
                <div className={`followers-picture-row-container ${followerData.length===0?'hide':''}`}>
                  {firstFollowerData.map(followers=>(
                    <div className="follower-profile-cntnr" key={followers.userId}><Link to={`/dashboard/profile/${followers.userId}`}><img src={followers.profileImg} alt="" /></Link></div>
                  ))}
                  <div className='follower-profile-cntnr more-follower' onClick={()=>handleTabSwitch('followers')}><div className='follower-profile-more-icon'><FaEllipsisH/></div></div>
                </div>
                <div className="user-type-and-more-info-cntnr">
                  <div className="user-type-cntnr">{user.designation}</div>
                  <div className="more-info-cntnr">
                    <div className="more-info-label" onClick={toggleDropdown}>More Info<PiCaretRightBold/></div>
                    <div className={`more-info-content ${isMoreInfoOpen ? 'open' : ''}`}>
                      <div className="more-info-content-title">More Details</div>
                      <hr className="more-info-horizontal-line" />
                      <div className="more-info-all-topic-cntnr">
                      <div className="more-info-topic-cntnr">
                        <div className="more-info-topic-title"><div className="topic-icons"><FaGraduationCap style={{fontSize:'20px'}}/></div> Study At</div>
                        {/* <div className="more-info-topic-content">{user.institution}<br/>{user.degree} - {user.course}</div> */}
                        <div className="more-info-topic-content">{user.institution}<br/>{user.degree} - {user.course}<br/>{user.studyYear===null?data.studyYear+' Student':''}</div>
                      </div>

                      {user.address===null?
                      <div className='more-info-topic-cntnr'>
                        <div className="more-info-topic-title"><div className="topic-icons"><FaLocationDot style={{fontSize:'18px'}}/></div>Address</div>
                        <div className="more-info-topic-content">{user.institution}</div>
                      </div>:''}

                      <div className="more-info-topic-cntnr">
                        <div className="more-info-topic-title"><div className="topic-icons"><PiAddressBookFill style={{fontSize:'20px'}}/></div> Contact On</div>
                        <div className="more-info-topic-content"><FaEnvelope/>{user.email}</div>
                        {user.phone===null?<div className="more-info-topic-content"><FaPhoneAlt/>{user.phone}</div>:''}
                      </div>


                      </div>
                    </div>
                  </div>
                </div>
                <div className="user-profile-institution-cntnr">
                  <div className="institution-icon"><FaUniversity/></div>
                  <div className="user-institution-name">{user.institution}</div>
                </div>
              </div>
            </div>

            <div className="profile-horizontal-line" ></div>

          </div>
        </div>
        <div className="user-profile-menu-main-container">
          <div className="user-profile-menu" id='profile-menu'>
            <div className={`profile-menu-option ${activeTab === 'posts'?'postActive':''}`} onClick={()=>handleTabSwitch('posts')}>Posts</div>
            <div className={`profile-menu-option ${activeTab === 'followers'?'followerActive':''}`} onClick={()=>handleTabSwitch('followers')}>Followers</div>
            <div className={`profile-menu-option ${activeTab === 'followings'?'followingActive':''}`} onClick={()=>handleTabSwitch('followings')}>Following</div>
          </div>
          <div className="profile-menu-content-container">
          {activeTab === 'posts' && <UserPosts userUploads={userUploads} userFiles={userFiles} selfProfile={selfProfile}/>} 
          {activeTab === 'followers' && <UserFollowers followerData={followerData}/>} 
          {activeTab === 'followings' && <UserFollowings followingData={followingData}/>} 
          </div>
        </div>

      </div>
      )}
    </div>
  )
}

export default UserProfile
