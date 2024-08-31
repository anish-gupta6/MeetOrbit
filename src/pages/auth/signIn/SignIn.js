import React,{useState} from 'react';
import './SignIn.css';
import {Link,useNavigate} from 'react-router-dom'
import GoogleIcon from '../../../assets/GoogleIcon.png'
// import MicrosoftIcon from '../../../assets/icons/MicrosoftIcon.png'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEye,faEyeSlash } from '@fortawesome/free-regular-svg-icons'
// import AuthService from '../authService/Auth.Service';
// import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import {UserAuth} from '../../../components/contexts/AuthContext'
import MidNavbar from '../../midNav/MidNavbar';
import {ReactComponent as SignInSVG} from '../../../assets/signIn-svg.svg'

const SignIn = () => {
  const navigate = useNavigate();
  // const authService = AuthService();
    const [isEmailActive, setIsEmailActive] = useState(false);
    const [isPasswordActive, setIsPasswordActive] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [inputType, setInputType] = useState('password');
    const [eyeIcon, setEyeIcon] = useState(faEye);
    const [emailValue, setemailValue] = useState('');
    const [passwordValue, setpasswordValue] = useState('');
    const [formError, setFormError] = useState('');
    const [isFormMsg, setIsFormMsg] = useState(false);

    const {userLogin,handleGoogleSignUp}=UserAuth();

    function handleEmailChange(text) {
        setemailValue(text);
        setIsEmailActive(text!==''?true:false);
      }

      function handlePasswordVisibility(){
        setInputType(isPasswordVisible!==true?'text':'password');
        setEyeIcon(isPasswordVisible!==true?faEyeSlash:faEye);
        setIsPasswordVisible(isPasswordVisible!==true?true:false);
      }

    function handlePasswordChange(pass) {
        setpasswordValue(pass);
        setIsPasswordActive(pass !== ''?true:false);
      }

    const handleSubmit=async (e)=>{
      e.preventDefault();
        const userEmail=emailValue;
        const userPassword=passwordValue;
      setIsFormMsg(false);
      try{
        const {message,success} = await userLogin(userEmail,userPassword)
        if (success) {
          setFormError(message);
          setIsFormMsg(true);
        } else {
          setFormError(message);
        }
      }catch(err){
        console.log(err)
      }
      if(formError!==""){
        setTimeout(() => {
          setFormError("");
       }, 5000);
      }
      else{
        setTimeout(() => {
          setFormError("");
        }, 5000);
      }
    }

  return (
    <div >
      <section style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
      <div className="midnav" style={{width:'100%'}}><MidNavbar/></div>
      <div className="login-page-main-container" style={{marginTop:'100px'}}>
      <div className="login-page-heading" ><h1>Welcome back ! ! !</h1></div>
          <div className="login-svg-form-cntnr">
        <div className="signin-svg-cntnr"><SignInSVG style={{width:'480px'}}/></div>

        <div className='login-page-form-cntnr'>
            
            <form  method="post" className="login-page-form" onSubmit={handleSubmit}>
          
                <div className="input-field-cntnr">
                <div className="inp-cntnr">
                <input type="email" id="email" name="email" autoComplete='off' className="login-page-input-field email-field" value={emailValue}
                    onChange={(e) => handleEmailChange(e.target.value)} required/>
                <label htmlFor="email" className={`login-input-label login-page-email-label ${isEmailActive ? 'Active' : ''}`}>Email address</label>
              </div>
            </div>


            <div className="input-field-cntnr pass-cntnr">
              <div className="inp-cntnr">
                <input type={inputType} id="password" name="password" className="login-page-input-field pass-field" value={passwordValue}
                    onChange={(e) => handlePasswordChange(e.target.value)}  required/>
                    
                <label htmlFor="password" className={`login-input-label login-page-password-label ${isPasswordActive ? 'Active' : ''}`}>Password</label>
              </div>
              <FontAwesomeIcon icon={eyeIcon} className='show-pass-icon' onClick={handlePasswordVisibility}/>
            </div>

              <div className={`form-error-cntnr ${isFormMsg?'Active':''}`}>{formError}</div>
              <button type="submit" className="login-page-submit-btn">Continue</button>
              <div className='forgot-pass-link'><Link to="/forgot-password" className='forgot-password'>Forgot Your Password?</Link></div>

            </form>
            <p>Don't have an account? <Link to="/signup" className='signUp'>Sign Up</Link></p>

            <div style={{display:'flex',alignItems:'center',justifyContent:'center',width:'100%',marginTop:'10px'}}> <div className="line" ></div> <span style={{margin:'0 10px'}}>OR</span><div className="line"></div></div>
            {/* <GoogleLoginButton onSuccess={handleLoginSuccess} onFailure={handleLoginFailure}/> */}
            <button className="social-button" id="google-button" onClick={handleGoogleSignUp}><img src={GoogleIcon} width={20} height={20} alt='G'/>Continue with Google</button>
            </div>
            </div>
    </div>
    {/* <div className="alert-message">  {message && <p>{message}</p>}  </div> */}
    </section>
    </div>
  )
}

export default SignIn;