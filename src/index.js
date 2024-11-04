import React,{useEffect}from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter as Router,useLocation} from "react-router-dom"
import { GoogleOAuthProvider } from '@react-oauth/google';
import AuthContext from './components/contexts/AuthContext';
import ToastService from './ToastService';
import { SocketProvider } from './components/contexts/SocketProvider';
// import { SocketProvider } from './components/contexts/SocketProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
// docxity  777290076207-2gbggpks6vqeusp4lmf8esphgrvcn09t.apps.googleusercontent.com
// meetorbit  185401706823-nmpme6j4mqd3o0u9qsltekiaqm73savb.apps.googleusercontent.com
root.render(
  <GoogleOAuthProvider clientId="185401706823-nmpme6j4mqd3o0u9qsltekiaqm73savb.apps.googleusercontent.com">
  <React.StrictMode>
    <Router>
      {/* <SocketProvider> */}
      <AuthContext>
        <ToastService>
          <App />
        </ToastService>
      </AuthContext>
      {/* </SocketProvider> */}
    </Router>
  </React.StrictMode>
  </GoogleOAuthProvider>
);