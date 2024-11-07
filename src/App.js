// src/App.js
import { BrowserRouter as Router, Route, Routes,Navigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
import Main from './pages/main/Main';
import SignIn from './pages/auth/signIn/SignIn'
import SignUp from './pages/auth/signUp/SignUp'
import { createContext, useEffect, useState } from 'react';
import Room from './pages/room/Room';
import Meeting from './pages/userMeeting/Meeting';
import { SocketProvider } from './components/contexts/SocketProvider';
import JoinMeeting from './pages/joinMeeting/JoinMeeting';
import MeetingMiddleware from './components/middleware/MeetingMiddleware';
import RoomContextPro from './components/contexts/RoomContextPro';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VerifyForgotPassword from './pages/auth/forgotPassword/VerifyForgotPassword';
import ResetForgotPassword from './pages/auth/forgotPassword/ResetForgotPassword';
import MeetingLobby from './pages/lobby/MeetingLobby';
import DashboardHome from './pages/dashHome/DashboardHome';
import UserProfile from './pages/userProfile/UserProfile';
import PlansPricing from './pages/plansPricing/PlansPricing';
import PersonalRoom from './pages/userMeeting/PersonalRoom';
import UpcomingMeeting from './pages/userMeeting/UpcomingMeeting';
import RecentMeeting from './pages/userMeeting/RecentMeeting';
import AllRecording from './pages/userRecording/AllRecording';
import Recording from './pages/userRecording/Recording';
import FavouriteRecording from './pages/userRecording/FavouriteRecording';
import TrashRecording from './pages/userRecording/TrashRecording';
import Note from './pages/userNotes/Note';
import NotePreview from './pages/userNotes/NotePreview';
import NoteEditor from './pages/userNotes/NoteEditor';
import CryptoJS from 'crypto-js'
import AppLoader from './components/appLoader/AppLoader';
import LaunchLobby from './pages/lobby/LaunchLobby';
import {UserAuth} from './components/contexts/AuthContext'


const useAuth = () => {
  const [userInfo, setUserInfo] = useState(localStorage.getItem("userData"));

  useEffect(() => {
    const handleStorageChange = () => {
      setUserInfo(localStorage.getItem("userData"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return !!userInfo;
};

const RequireAuth = ({ children }) => {
  const isAuthenticated = useAuth();
  return isAuthenticated ? children : <Navigate to="/signin" />;
};

const HasAuth = ({ children }) => {
  const isAuthenticated = useAuth();
  return !isAuthenticated ? children : <Navigate to="/home" />;
};

export const userContext = createContext(null)

function App() {
  // const backend = 'https://meetorbit-1.onrender.com'
  // const backend = 'https://meetorbit.gdscbiher.in.net';
  const backend = 'http://localhost:5000';
  const [isLoading, setIsLoading] = useState(true); 
  const {userInfo} = UserAuth();

  useEffect(() => {
    setTimeout(()=>{
      setIsLoading(false);
    },1200)
  }, []);


  if (isLoading) {
    return <AppLoader/>; 
  }

  return (
    <>
    <div className="App">
      <ToastContainer position="top-center" autoClose={2500} hideProgressBar={true} pauseOnHover={false} pauseOnFocusLoss={false} limit={3}/>
    </div>
    <userContext.Provider value={{userInfo,isLoading,backend}}>
      <Routes>
        <Route exact path='/' element={<HasAuth><Main/></HasAuth>}/>
        <Route exact path='/signin' element={<HasAuth><SignIn/></HasAuth>}/>
        <Route exact path='/signup' element={<HasAuth><SignUp/></HasAuth>}/>
        <Route exact path='/forgot-password/verify' element={<HasAuth><VerifyForgotPassword/></HasAuth>}/>
        <Route exact path='/forgot-password/reset' element={<HasAuth><ResetForgotPassword/></HasAuth>}/>
        <Route exact path='/join-meeting' element={<JoinMeeting/>}/>
        <Route exact path='/meeting/room/wr' element={<MeetingLobby/>}/>
        <Route exact path='/meeting/room/launch' element={<LaunchLobby/>}/>
        
        {/* <Route exact path='/meeting/room/:mode/j' element={<MeetingMiddleware/>} />
        <Route exact path='/meeting/room/s' element={<RoomContextPro><Room/></RoomContextPro>} /> */}
        <Route exact path='/meeting/room/:mode/j' element={<SocketProvider><MeetingMiddleware/></SocketProvider>} />
        <Route exact path='/meeting/room/s' element={<SocketProvider><RoomContextPro><Room/></RoomContextPro></SocketProvider>} />
        <Route exact path='/plan-pricing' element={<PlansPricing/>}/>


        <Route exact path='/home' element={<RequireAuth><Dashboard/></RequireAuth>}>
          <Route index element={<DashboardHome/>}/>
          <Route exact path='/home/profile' element={<UserProfile/>}/>
          <Route exact path='/home/meeting' element={<Meeting/>}>
            <Route index element={<PersonalRoom/>}/>
            <Route exact path='/home/meeting/upcoming-meetings' element={<UpcomingMeeting/>}/>
            <Route exact path='/home/meeting/recent-meetings' element={<RecentMeeting/>}/>
          </Route>
          <Route exact path='/home/recording' element={<Recording/>}>
            <Route index element={<AllRecording/>}/>
            <Route exact path='/home/recording/favourite-recordings' element={<FavouriteRecording/>}/>
            <Route exact path='/home/recording/trash-recordings' element={<TrashRecording/>}/>
          </Route>
          <Route exact path='/home/notes' element={<Note/>}>
            <Route index element={<NotePreview/>}/>
            <Route exact path='/home/notes/completed'/>
            <Route exact path='/home/notes/pending'/>
            <Route exact path='/home/notes/editor' element={<NoteEditor/>}/>
          </Route>
          <Route exact path='/home/edit-profile'/>
          <Route exact path='/home/notifications'/>
          <Route exact path='/home/whiteboard'/>
          <Route exact path='/home/setting'/>
        </Route>
      </Routes>
      </userContext.Provider>
      </>
    
  );
}

export default App;
