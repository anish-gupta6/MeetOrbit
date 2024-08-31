import React, { useState } from "react";
import "./VerifyOTP.css";
import { PiXCircleBold } from "react-icons/pi";
import {UserAuth} from '../../../components/contexts/AuthContext'

const VerifyOTP = ({handlePopUpChange,generatedOTP,userName,userEmail,userPassword}) => {

    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [isVerifying,setIsVerifying]=useState(false);
    const genOTP = parseInt(generatedOTP,10);
    // const genOTP = generatedOTP;
    const usrName=userName;
    const usrEmail=userEmail;
    const usrPassword=userPassword;
    const profileImg = "https://www.transparentpng.com/thumb/user/gray-user-profile-icon-png-fP8Q1P.png"

    const {userRegister} = UserAuth();
    // console.log(genOTP)

    const handleChange = (element, index) => {
      if (isNaN(element.value)) return;
  
      setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
  
      // Move to the next input box
      if (element.nextSibling && element.value) {
        element.nextSibling.focus();
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

    const handleVerifyOTP= ()=>{
      
        const finalOTP = parseInt(otp.join(""), 10);
        console.log(finalOTP,genOTP);
        if(finalOTP === genOTP){
          setIsVerifying(true)
          console.log('working');
          const message = userRegister(usrName,usrEmail,usrPassword,profileImg);
          setIsVerifying(false)
          console.log(message)
        }
    }


  return (
    <div className="otp-container">
        <div className="close-btn" onClick={()=>handlePopUpChange(false)}><PiXCircleBold/></div>
        <div className="otp-cntnr-header"><h3 className="otp-heading">Verify Your Email Address</h3></div>
        <div className="otp-cntnr-desc">We are glad, you signed up. To start exploring <strong>Zoom</strong>, Please Enter OTP on your email address.<br/> Thank You !</div>
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
          />
        );
      })}
      </div>
      <div className="otp-err-msg"></div>
      <button className="otp-submit-btn" onClick={handleVerifyOTP}>{isVerifying?<div className="verify-loader"></div>:'Verify'}</button>
    </div>
  );
};

export default VerifyOTP;
