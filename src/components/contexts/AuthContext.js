import React,{createContext,useContext,useState} from 'react'
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import {useNavigate} from 'react-router-dom'
import CryptoJS from 'crypto-js';
const UserContext = createContext()

const AuthContext = ({children}) => {
    // const [profileImg,setProfileImg]=useState('https://www.transparentpng.com/thumb/user/gray-user-profile-icon-png-fP8Q1P.png')
    const navigate = useNavigate();
    

    const saveUserData = (userData) =>{
        const secretKey = 'zoomClone';
        console.log(userData);
        const encryptedData=CryptoJS.AES.encrypt(JSON.stringify(userData), secretKey).toString();
        localStorage.setItem('userData',encryptedData);
    }


    const userLogOut = () =>{
        localStorage.removeItem('userData');
        navigate('/');
    }



    // for user login and saving data to the local storage
    const userLogin = async (userEmail,userPassword,isGoogleLogin)=>{
        try{
            console.log('here')
            const response = await fetch('http://localhost:5000/api/auth/login',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({userEmail,userPassword,isGoogleLogin})
            });
            const data = await response.json();
            if(response.ok){
                if(data.success){
                    saveUserData(data.userData);
                    navigate('/dashboard');
                    return {message:data.message,success:data.success}
                }
            }
            return {message:data.message,success:data.success}

        }catch(err){
            console.log(err)
        }
    }

    // for registering user and saving data to database
    const userRegister = async (userName,userEmail,userPassword,profileImg,isGoogleRegister) =>{
        try{
            const response = await fetch('http://localhost:5000/api/auth/register',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({userName,userEmail,userPassword,profileImg,isGoogleRegister})
            });
            if(response.ok){
                
                const data = await response.json();
                isGoogleRegister?userLogin(userEmail,userPassword,isGoogleRegister):userLogin(userEmail,userPassword);
                return data.message;
            }
        }catch(err){
            console.log(err)
        }
    }

    // for generating and sending otp
    const generateOTP = async (userName,userEmail) =>{
        console.log(userName,userEmail);
        try{
            const response = await fetch('http://localhost:5000/api/auth/generateOTP',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({userName,userEmail})
            });
           
            if(response.ok){
                const data = await response.json();
                console.log(data);
                return {otp:data.otp,message:data.message,success:true}
            }
            return {otp:"0",message:'User already exists !!!',success:false}
        }catch(err){
            console.log(err)  
        }
    }

    // login with google
    const handleGoogleSignIn = useGoogleLogin({
        onSuccess: async (codeResponse) =>{
          try{
            const response=await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`,{
              method:'GET',
              mode:'cors',
              headers: {
                Authorization: `Bearer ${codeResponse.access_token}`,
                Accept: 'application/json'
                }
            });
            if(response.ok){
                const userInfo = await response.json();
                const isGoogleLogin = true;
                userLogin(userInfo.email,userInfo.id,isGoogleLogin);
              }
          }
          catch(error){
            console.log(error);
          }
        },
        onError: (error) => console.log('Login Failed:', error)
    });

    // signup with google
    const handleGoogleSignUp = useGoogleLogin({
        onSuccess: async (codeResponse) =>{
          try{
            const response=await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`,{
              method:'GET',
              mode:'cors',
              headers: {
                Authorization: `Bearer ${codeResponse.access_token}`,
                Accept: 'application/json'
                }
            });
            if(response.ok){
              const userInfo = await response.json();
              console.log(userInfo)
              const result = await checkUser(userInfo.email)
            //   console.log(result)
              if(result===true){
                const isGoogleLogin = true;
                console.log('login')
                userLogin(userInfo.email,userInfo.id,isGoogleLogin);
              }
              else{
                console.log('register')
                // setProfileImg(userInfo.picture)
                const isGoogleRegister = true;
                userRegister(userInfo.name,userInfo.email,userInfo.id,userInfo.picture,isGoogleRegister);
              }

            }
          }
          catch(error){
            console.log(error);
          }
        },
        onError: (error) => console.log('Login Failed:', error)
    });

    // check user already exists
    const checkUser = async (userEmail) =>{
        try{
            const response = await fetch('http://localhost:5000/api/auth/checkUser',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({userEmail})
            });
            if(response.ok){
                const data = await response.json();
                return true
            }
            return false
        }catch(err){
            console.log(err);
        }
    }

  return (
    <UserContext.Provider value={{ generateOTP , userLogin, userRegister ,handleGoogleSignUp, handleGoogleSignIn, checkUser, userLogOut}}>
            {children}
        </UserContext.Provider>
  )
}

export default AuthContext

export const UserAuth = () => {
    return useContext(UserContext)
} 