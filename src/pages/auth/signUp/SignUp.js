import React,{useState} from 'react';
import '../signIn/SignIn.css';
import {Link,useNavigate} from 'react-router-dom'
import GoogleIcon from '../../../assets/GoogleIcon.png'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEye,faEyeSlash } from '@fortawesome/free-regular-svg-icons'
import {UserAuth} from '../../../components/contexts/AuthContext';
import MidNavbar from '../../midNav/MidNavbar';
import {ReactComponent as SignUpSVG} from '../../../assets/signUp-svg.svg'
import VerifyOTP from '../otpVerify/VerifyOTP';
import {useToast} from '../../../ToastService'

const SignUp = () => {
    const [isEmailActive, setIsEmailActive] = useState(false);
    const [isNewPassActive, setIsNewPassActive] = useState(false);
    const [isConfirmPassActive, setIsConfirmPassActive] = useState(false);
    const [isNewPassVisible, setIsNewPassVisible] = useState(false);
    const [isConfirmPassVisible, setIsConfirmPassVisible] = useState(false);
    const [newInputType, setNewInputType] = useState('password');
    const [confirmInputType, setConfirmInputType] = useState('password');
    const [newEyeIcon, setNewEyeIcon] = useState(faEye);
    const [confirmEyeIcon, setConfirmEyeIcon] = useState(faEye);
    const [emailValue, setemailValue] = useState('');
    const [isNameActive, setIsNameActive] = useState(false);
    const [nameValue, setnameValue] = useState('');
    const [newPassValue, setNewPassValue] = useState('');
    const [confirmPassValue, setConfirmPassValue] = useState('');
    // const [formError, setFormError] = useState('');
    // const [isFormMsg, setIsFormMsg] = useState(false);
    const [isPopUpActive,setIsPopUpActive]=useState(false)
    const [isLoaderActive,setIsLoaderActive]=useState(false)
    const [generatedOTP,setGeneratedOTP]=useState('')
    
    // const [userId,setUserId]=useState('')
    const {generateOTP,handleGoogleAuth}=UserAuth();
    const {notifySuccess,notifyError,notifyWarning} = useToast();


    function handleEmailChange(text) {
        setemailValue(text);
        setIsEmailActive(text !== ''?true:false);
        }
    
      function handleNewPasswordVisibility(){
        setNewInputType(isNewPassVisible!==true?'text':'password');
        setNewEyeIcon(isNewPassVisible!==true?faEyeSlash:faEye);
        setIsNewPassVisible(isNewPassVisible!==true?true:false);
      }
      function handleConfirmPasswordVisibility(){
        setConfirmInputType(isConfirmPassVisible!==true?'text':'password');
        setConfirmEyeIcon(isConfirmPassVisible!==true?faEyeSlash:faEye);
        setIsConfirmPassVisible(isConfirmPassVisible!==true?true:false);
      }
    function handleNameChange(text) {
        setnameValue(text);
        setIsNameActive(text !== ''?true:false);
        }
    function handleNewPasswordChange(pass) {
        setNewPassValue(pass);
        setIsNewPassActive(pass !== ''?true:false);
        }
    function handleConfirmPasswordChange(pass) {
        setConfirmPassValue(pass);
        setIsConfirmPassActive(pass !== ''?true:false);
      }
      function validateEmail(email) {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    }
      
      
      const handleSubmit = async (event) => {
        event.preventDefault();
        const userName= nameValue;
        const userEmail= emailValue;

        if(!userName && !userEmail && !newPassValue){
          notifyWarning('Enter your details to continue !!');
          return
        }

        if(!userName){
          notifyWarning('Enter your name !!');
          return
        }
        if(!userEmail){
          notifyWarning('Enter your email !!');
          return
        }
        if(!newPassValue || !confirmPassValue){
          notifyWarning('Create a password !!');
          return
        }
        if(!validateEmail(userEmail)){
          notifyError('Enter a valid email !!');
          return
        }
        if(newPassValue.length<8 || confirmPassValue.length<8){
          notifyWarning('Password must be at least 8 characters long !!');
          return
        }
        
          if(newPassValue!==confirmPassValue){
            notifyError("Passwords doesn't match !!!");
          }
          else{
            setIsLoaderActive(true)
            const {otp,message,success} = await generateOTP(userName, userEmail);
            if(success){
              setGeneratedOTP(otp);
              notifySuccess(message);
              setIsLoaderActive(false)
              setIsPopUpActive(true);
            }
            else{
            setIsLoaderActive(false)
            notifyError(message);
          }
          }
      };
      
      const handlePopUpChange = (value)=>{
        setIsPopUpActive(value);
      }
  return (
    <div >
      <div className={`verify-email-popup ${isPopUpActive===true?'active':''}`}> <div className="popup-inner"> <VerifyOTP handlePopUpChange={handlePopUpChange} generatedOTP={generatedOTP} userName={nameValue} userEmail={emailValue} userPassword={newPassValue} isPopUpActive={isPopUpActive}/></div></div>
      <div className={`verify-email-loader ${isLoaderActive===true?'active':''}`}> <div className="loader"></div></div>
      <section style={{height:'100vh',width:'100vw',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',zIndex:'-10'}}>
      <div className="midnav" style={{width:'100%'}}><MidNavbar/></div>
      
      <div className="login-page-main-container" style={{marginTop:'80px'}}>
            <div className="login-page-heading" ><h1>Register Yourself</h1></div>

      <div className="login-svg-form-cntnr" style={{gap:'60px',margin:'20px 10px'}}>
          <div className="signin-svg-cntnr"><SignUpSVG style={{width:'450px'}}/></div>

          <div className='login-page-form-cntnr'>
            <form  method="post" className="login-page-form" onSubmit={handleSubmit}>
            <div className="input-field-cntnr">
                <div className="inp-cntnr">
                <input type="text" id="name" name="name" autoComplete='off' className="login-page-input-field name-field" value={nameValue}
                    onChange={(e) => handleNameChange(e.target.value)}/>
                <label htmlFor="name" className={`login-input-label login-page-name-label ${isNameActive ? 'Active' : ''}`}>Full Name</label>
                </div>
            </div>
                <div className="input-field-cntnr">
                <div className="inp-cntnr">
                <input type="text" id="email" name="email" autoComplete='off' className="login-page-input-field email-field" value={emailValue}
                    onChange={(e) => handleEmailChange(e.target.value)}/>
                <label htmlFor="email" className={`login-input-label login-page-email-label ${isEmailActive ? 'Active' : ''}`}>Email address</label>
              </div>
            </div>
            <div className="input-field-cntnr pass-cntnr">
              <div className="inp-cntnr">
                <input type={newInputType} id="password" name="password" className="login-page-input-field pass-field" value={newPassValue}
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



                {/* <div className={`form-error-cntnr ${isFormMsg?'Active':''}`}>{formError}</div> */}
              <button type="submit" className="login-page-submit-btn">Register</button>
              
            </form>
            <p>Already have an account? <Link to="/signin" className='signUp'>Sign In</Link></p>
            <div style={{display:'flex',alignItems:'center',justifyContent:'center',width:'100%',marginTop:'10px'}}> <div className="line" ></div> <span style={{margin:'0 10px'}}>OR</span><div className="line"></div></div>
            <button className="social-button" id="google-button" onClick={handleGoogleAuth}><img src={GoogleIcon} width={20} height={20} alt='G'/>Continue with Google</button>
      </div>
      </div>
    </div>
    {/* <div className="alert-message">  {message && <p>{message}</p>}  </div> */}
    </section>
    
    </div>
  )
}

export default SignUp;