// src/App.js
import { BrowserRouter as Router, Route, Routes,Navigate } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
import Home from './pages/home/Home';
import SignIn from './pages/auth/signIn/SignIn'
import SignUp from './pages/auth/signUp/SignUp'
import { useEffect, useState } from 'react';
import Room from './pages/room/Room';
import Meeting from './pages/userMeeting/Meeting';
import { SocketProvider } from './components/contexts/SocketProvider';
import JoinMeeting from './pages/joinMeeting/JoinMeeting';
import MeetingMiddleware from './components/middleware/MeetingMiddleware';



function App() {

  const RequireAuth = ({ children }) => {
    const [userInfo, setUserInfo] = useState(localStorage.getItem("userData"));

  useEffect(() => {
    const handleStorageChange = () => {
      setUserInfo(localStorage.getItem("userData"));
    };

    window.addEventListener("storage", handleStorageChange);

    // Cleanup the event listener when the component is unmounted
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);


    return userInfo ? children : <Navigate to="/signin" />;
    
  };
  
  const HasAuth = ({ children }) => {
    const [userInfo, setUserInfo] = useState(localStorage.getItem("userData"));

  useEffect(() => {
    const handleStorageChange = () => {
      setUserInfo(localStorage.getItem("userData"));
    };

    window.addEventListener("storage", handleStorageChange);

    // Cleanup the event listener when the component is unmounted
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);


    return !userInfo ? children : <Navigate to="/dashboard" />;
  };
  

  return (
    // <Router>
      <Routes>
        <Route exact path='/' element={<HasAuth><Home/></HasAuth>}/>
        <Route exact path='/signin' element={<HasAuth><SignIn/></HasAuth>}/>
        <Route exact path='/signup' element={<HasAuth><SignUp/></HasAuth>}/>
        <Route exact path='/join-meeting' element={<JoinMeeting/>}/>

        {/* <Route exact path='/meeting'> */}
          {/* <SocketProvider> */}
            <Route exact path='/meeting/room/:mode/j' element={<SocketProvider><MeetingMiddleware/></SocketProvider>} />
            <Route exact path='/meeting/room/s' element={<SocketProvider><Room/></SocketProvider>} />
          {/* </SocketProvider> */}
        {/* </Route> */}

        <Route exact path='/dashboard' element={<RequireAuth><Dashboard/></RequireAuth>}>
          <Route exact path='/dashboard/profile'/>
          <Route exact path='/dashboard/edit-profile'/>
          <Route exact path='/dashboard/notifications'/>
          <Route exact path='/dashboard/meeting' element={<Meeting/>}/>
          <Route exact path='/dashboard/webinar'/>
          <Route exact path='/dashboard/recording'/>
          <Route exact path='/dashboard/plan-pricing'/>
          <Route exact path='/dashboard/setting'/>
        </Route>
      </Routes>
    // </Router>
  );
}

export default App;
