import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import './ForgotPassword.css'
import MidNavbar from '../../midNav/MidNavbar'
import {UserAuth} from '../../../components/contexts/AuthContext'
import {useToast} from '../../../ToastService'
import CryptoJS from 'crypto-js'

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [emailValue,setEmailValue] = useState('')
  const [isEmailActive,setIsEmailActive] = useState(false)
  const [isVerifying,setIsVerifying] = useState(false)
  const {checkUser} = UserAuth();
  const {notifySuccess,notifyError} = useToast();

  function handleEmailChange(text) {
    setEmailValue(text);
    setIsEmailActive(text !== ''?true:false);
    }

    function validateEmail(email) {
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return regex.test(email);
  }

    const handleForgotPass = async (e) =>{
      e.preventDefault();
      // const userEmail = emailValue
      // const secretKey = 'zoomClone'
      // const encEmail = CryptoJS.AES.encrypt(userEmail, secretKey).toString();
      if(!validateEmail(emailValue)){
        notifyError('Enter a valid email !!')
        return
      }
      setIsVerifying(true)
      const result = await checkUser(emailValue);
      if(result){
        setIsVerifying(false);
        const secretKey = 'zoomClone'
        const encEmail = CryptoJS.AES.encrypt(emailValue, secretKey).toString();
        notifySuccess('User found !!')
        navigate(`/forgot-password/reset?id=${encodeURIComponent(encEmail)}`);
      }
      else{
        setIsVerifying(false)
        notifyError('User not found !!')
      }
    }
  return (
    <div>
      <div className="midnav" style={{width:'100%'}}><MidNavbar/></div>
      <div className="forgot-pass-main-cntnr">
        <h1 className="forgot-pass-header">Forgot Password ?</h1>
        <div className="forgot-pass-desc">Remember you password? <Link to="/signin" className='signUp'>Sign In</Link></div>
        <form className="forgot-pass-form-cntnr" onSubmit={handleForgotPass}>
          <div className="inp-cntnr">
            <input type="text" id="email" name="email" autoComplete='off' autoFocus className="login-page-input-field email-field" value={emailValue} onChange={(e) => handleEmailChange(e.target.value)}/>
            <label htmlFor="email" className={`login-input-label login-page-email-label ${isEmailActive ? 'Active' : ''}`}>Email address</label>
          </div>
          <button type="submit" className="forgot-pass-submit-btn">{isVerifying?<div className="verify-loader"></div>:'Verify & Reset'}</button>
        </form>

        <div className="forgot-go-back-btn" onClick={()=>navigate(-1)}>Go Back</div>
      </div>
    </div>
  )
}

export default ForgotPassword
