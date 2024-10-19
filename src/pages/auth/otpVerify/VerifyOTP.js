import React, { useState,useEffect,useRef } from "react";
import "./VerifyOTP.css";
import { PiShieldCheckFill, PiXCircleBold } from "react-icons/pi";
import {UserAuth} from '../../../components/contexts/AuthContext'
import {useToast} from '../../../ToastService'

const VerifyOTP = ({handlePopUpChange,generatedOTP,userName,userEmail,userPassword,isPopUpActive}) => {

    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [isVerifying,setIsVerifying]=useState(false);
    const [isResending,setIsResending]=useState(false);
    const [error,setError]=useState('');
    const [genOTP,setGenOTP] = useState();
    
    // const genOTP = generatedOTP;
    const usrName=userName;
    const usrEmail=userEmail;
    const usrPassword=userPassword;
    const profileImg = "https://www.transparentpng.com/thumb/user/gray-user-profile-icon-png-fP8Q1P.png"

    const {userRegister,generateOTP} = UserAuth();
    const {notifySuccess,notifyError} = useToast();

    const firstInputRef = useRef(null);

  useEffect(() => {
    if (firstInputRef.current && isPopUpActive) {
      firstInputRef.current.focus()
    }
    if (generatedOTP) {
      setGenOTP(parseInt(generatedOTP,10));
    }
  }, [isPopUpActive]); // Rerun on popUpActive change
    
  // useEffect(() => {
    
  // }, []);
    

    const handleChange = (element, index) => {
      if (isNaN(element.value)) return;
  
      setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
  
      // Move to the next input box
      if (element.nextSibling && element.value) {
        element.nextSibling.focus();
      }
    };

    const handlePaste = (e) => {
      e.preventDefault(); // Prevent default paste behavior
      const pasteData = e.clipboardData.getData("text").trim();
      const otpArray = pasteData.split("").slice(0, 6); // Take only first 6 characters
  
      if (otpArray.length === 6) {
        setOtp(otpArray); // Set OTP state with the pasted value
        // Automatically move focus to the corresponding input fields
        document.querySelectorAll('.otp-input').forEach((input, idx) => {
          input.value = otpArray[idx];
          if (idx === 5) return; // No next sibling for the last input
          input.nextSibling.focus();
        });
      }
    };
    const handleKeyDown = (e, index) => {
      if (e.key === "Backspace") {
        if (otp[index] === "") {
          if (e.target.previousSibling) {
            e.target.previousSibling.focus();
          }
        } else {
          setOtp([...otp.map((d, idx) => (idx === index ? "" : d))]);
        }
      } else if (e.key === "ArrowLeft") {
        if (e.target.previousSibling) {
          e.target.previousSibling.focus();
        }
      } else if (e.key === "ArrowRight") {
        if (e.target.nextSibling) {
          e.target.nextSibling.focus();
        }
      }
    };

    const handleVerifyOTP= (e)=>{
        e.preventDefault();
        const finalOTP = parseInt(otp.join(""), 10);
        if(!finalOTP){
          notifyError('Enter received OTP !!')
          return
        }
        console.log(finalOTP,genOTP);
        if(finalOTP === genOTP){
          setIsVerifying(true)
          console.log('working');
          const message = userRegister(usrName,usrEmail,usrPassword,profileImg);
          setError(message)
          setIsVerifying(false)
          notifySuccess(error)
          // console.log(message)
        }
        else{
          notifyError("OTP doesn't match !!")
        }
    }

    const resendOTP = async() =>{
      setIsResending(true)
      const {otp,message,success} = await generateOTP(usrName, usrEmail);
      if(success){
        setGenOTP(parseInt(otp,10))
        notifySuccess('OTP re-sent successfully !!');
        setIsResending(false)
        firstInputRef.current.focus()
      }
      else{
        setIsResending(false)
        notifyError(message);
    }
    }


  return (
    <div className="otp-container">
        <div className="close-btn" onClick={()=>handlePopUpChange(false)}><PiXCircleBold/></div>
        <div className="otp-logo-cntnr"><PiShieldCheckFill/></div>
        <div className="otp-cntnr-header"><h3 className="otp-heading">Verify Your Email Address</h3></div>
        <div className="otp-cntnr-desc">We are glad, you signed up. To continue, please enter OTP on your email address. Thank You !</div>
      <form className="otp-form" onSubmit={handleVerifyOTP}>
      <div className="otp-box-cntnr">
      {otp.map((data, index) => {
        return (
          <input
            className="otp-input"
            type="text"
            name="otp"
            maxLength="1"
            key={index}
            value={data}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onFocus={(e) => e.target.select()}
            onPaste={index === 0 ? handlePaste : null}
            ref={index === 0 ? firstInputRef : null} // Assign ref only to the first input
          autoFocus={index === 0}
          />
        );
      })}
      </div>
      <div className="otp-form-buttons">
        <button className="otp-submit-btn" type="submit" >{isVerifying?<div className="verify-loader"></div>:'Verify'}</button>
        <button className="otp-resend-btn" type="button" onClick={resendOTP}>{isResending?<div className="verify-loader"></div>:'Resend OTP'}</button>
      </div>
      </form>
    </div>
  );
};

export default VerifyOTP;
