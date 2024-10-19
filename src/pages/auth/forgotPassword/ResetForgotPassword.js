import React, { useEffect, useState } from 'react'
import { Link,useNavigate,useLocation, useParams } from 'react-router-dom'
import './ForgotPassword.css'
import MidNavbar from '../../midNav/MidNavbar'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEye,faEyeSlash } from '@fortawesome/free-regular-svg-icons'
import CryptoJS from 'crypto-js'
import {UserAuth} from '../../../components/contexts/AuthContext'
import {useToast} from '../../../ToastService'

const ResetForgotPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isNewPassActive, setIsNewPassActive] = useState(false);
    const [isConfirmPassActive, setIsConfirmPassActive] = useState(false);
    const [isNewPassVisible, setIsNewPassVisible] = useState(false);
    const [isConfirmPassVisible, setIsConfirmPassVisible] = useState(false);
    const [newInputType, setNewInputType] = useState('password');
    const [confirmInputType, setConfirmInputType] = useState('password');
    const [newEyeIcon, setNewEyeIcon] = useState(faEye);
    const [confirmEyeIcon, setConfirmEyeIcon] = useState(faEye);
    const [newPassValue, setNewPassValue] = useState('');
    const [confirmPassValue, setConfirmPassValue] = useState('');
    const [userEmail, setUserEmail] = useState('');

    const queryParams = new URLSearchParams(location.search);
    const emailValue = queryParams.get('id');
    const {resetPassword} = UserAuth();
    const {notifySuccess,notifyError,notifyWarning} = useToast();

    useEffect(()=>{
        const encEmail = decodeURIComponent(emailValue)
        const secretKey = 'zoomClone'
        const bytes =  CryptoJS.AES.decrypt(encEmail, secretKey);
        const email = bytes.toString(CryptoJS.enc.Utf8);
        console.log(email)
        setUserEmail(email)
    },[emailValue])
   
    const handleNewPasswordChange = (pass) => {
        setNewPassValue(pass);
        setIsNewPassActive(pass !== ''?true:false);
        }
    const handleConfirmPasswordChange = (pass) => {
        setConfirmPassValue(pass);
        setIsConfirmPassActive(pass !== ''?true:false);
      }
      const  handleNewPasswordVisibility = () =>{
        setNewInputType(isNewPassVisible!==true?'text':'password');
        setNewEyeIcon(isNewPassVisible!==true?faEyeSlash:faEye);
        setIsNewPassVisible(isNewPassVisible!==true?true:false);
      }
      const  handleConfirmPasswordVisibility = () =>{
        setConfirmInputType(isConfirmPassVisible!==true?'text':'password');
        setConfirmEyeIcon(isConfirmPassVisible!==true?faEyeSlash:faEye);
        setIsConfirmPassVisible(isConfirmPassVisible!==true?true:false);
      }
  
      const handlePasswordReset = async (e) =>{
        e.preventDefault();

        if(!newPassValue || !confirmPassValue){
            notifyWarning('Create a password !!');
            return
          }

        if(newPassValue.length<8 ||  confirmPassValue.length<8){
            notifyWarning('Password must be at least 8 characters long !!');
          return
        }
        if(newPassValue!==confirmPassValue){
            notifyError("Passwords doesn't match !!!");
          }
          else{
            

            const result = resetPassword(userEmail,newPassValue);
            console.log(result)
          }

      }
    return (
      <div>
        <div className="midnav" style={{width:'100%'}}><MidNavbar/></div>
        <div className="forgot-pass-main-cntnr">
          <h1 className="forgot-pass-header">Create New Password</h1>
          <div className="forgot-pass-desc"> If you remember you password? <Link to="/signin" className='signUp'>Sign In</Link></div>
          <form className="forgot-pass-form-cntnr" onSubmit={handlePasswordReset}>
          <div className="input-field-cntnr pass-cntnr">
              <div className="inp-cntnr">
                <input type={newInputType} id="password" name="password" autoFocus className="login-page-input-field pass-field" value={newPassValue}
                    onChange={(e) => handleNewPasswordChange(e.target.value)} />
                    
                <label htmlFor="password" className={`login-input-label login-page-password-label ${isNewPassActive ? 'Active' : ''}`}>Create New Password</label>
              </div>
              <FontAwesomeIcon icon={newEyeIcon} className='show-pass-icon' onClick={handleNewPasswordVisibility}/>
            </div>

            <div className="input-field-cntnr pass-cntnr">
              <div className="inp-cntnr">
                <input type={confirmInputType} id="password" name="password" className="login-page-input-field pass-field" value={confirmPassValue}
                    onChange={(e) => handleConfirmPasswordChange(e.target.value)} />
                    
                <label htmlFor="password" className={`login-input-label login-page-password-label ${isConfirmPassActive ? 'Active' : ''}`}>Confirm New Password</label>
              </div>
              <FontAwesomeIcon icon={confirmEyeIcon} className='show-pass-icon' onClick={handleConfirmPasswordVisibility}/>
            </div>
            <button type="submit" className="forgot-pass-submit-btn">Change</button>
          </form>
  
          <div className="forgot-go-back-btn" onClick={()=>navigate(-1)}>Go Back</div>
        </div>
      </div>
    )
}

export default ResetForgotPassword
