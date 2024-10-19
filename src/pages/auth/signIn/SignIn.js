import React,{useState} from 'react';
import './SignIn.css';
import {Link} from 'react-router-dom'
import GoogleIcon from '../../../assets/GoogleIcon.png'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEye,faEyeSlash } from '@fortawesome/free-regular-svg-icons'
import {UserAuth} from '../../../components/contexts/AuthContext'
import MidNavbar from '../../midNav/MidNavbar';
import {ReactComponent as SignInSVG} from '../../../assets/signIn-svg.svg'
import {useToast} from '../../../ToastService'

const SignIn = () => {
    const [isEmailActive, setIsEmailActive] = useState(false);
    const [isPasswordActive, setIsPasswordActive] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [inputType, setInputType] = useState('password');
    const [eyeIcon, setEyeIcon] = useState(faEye);
    const [emailValue, setemailValue] = useState('');
    const [passwordValue, setpasswordValue] = useState('');
    const {notifyError,notifyInfo,notifyWarning} = useToast();

    const {userLogin,handleGoogleAuth}=UserAuth();

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
      
      function validateEmail(email) {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    }

    const handleSubmit=async (e)=>{
      e.preventDefault();
        const userEmail=emailValue;
        const userPassword=passwordValue;
        if(!userEmail && !userPassword){
          notifyWarning('Enter your login credentials !!');
          return
        }
        if(!validateEmail(userEmail)){
          notifyError('Enter a valid email !!');
          return
        }
      try{
        const {message,success} = await userLogin(userEmail,userPassword)
        if (success) {
          notifyInfo(message)
        } else {
          notifyError(message)
        }
      }catch(err){
        console.log(err)
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
                <input type="text" id="email" name="email" autoComplete='off' className="login-page-input-field email-field" value={emailValue}
                    onChange={(e) => handleEmailChange(e.target.value)}/>
                <label htmlFor="email" className={`login-input-label login-page-email-label ${isEmailActive ? 'Active' : ''}`}>Email address</label>
              </div>
            </div>


            <div className="input-field-cntnr pass-cntnr">
              <div className="inp-cntnr">
                <input type={inputType} id="password" name="password" className="login-page-input-field pass-field" value={passwordValue}
                    onChange={(e) => handlePasswordChange(e.target.value)}/>
                    
                <label htmlFor="password" className={`login-input-label login-page-password-label ${isPasswordActive ? 'Active' : ''}`}>Password</label>
              </div>
              <FontAwesomeIcon icon={eyeIcon} className='show-pass-icon' onClick={handlePasswordVisibility}/>
            </div>

              <button type="submit" className="login-page-submit-btn">Continue</button>
              <div className='forgot-pass-link'><Link to="/forgot-password/verify" className='forgot-password'>Forgot Your Password?</Link></div>

            </form>
            <p>Don't have an account? <Link to="/signup" className='signUp'>Sign Up</Link></p>

            <div style={{display:'flex',alignItems:'center',justifyContent:'center',width:'100%',marginTop:'10px'}}> <div className="line" ></div> <span style={{margin:'0 10px'}}>OR</span><div className="line"></div></div>
            {/* <GoogleLoginButton onSuccess={handleLoginSuccess} onFailure={handleLoginFailure}/> */}
            <button className="social-button" id="google-button" onClick={handleGoogleAuth}><img src={GoogleIcon} width={20} height={20} alt='G'/>Continue with Google</button>
            </div>
            </div>
    </div>
    </section>
    </div>
  )
}

export default SignIn;