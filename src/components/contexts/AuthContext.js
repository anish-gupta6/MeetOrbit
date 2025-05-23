import React,{createContext,useContext,useEffect,useState} from 'react'
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import {useNavigate} from 'react-router-dom'
import CryptoJS from 'crypto-js';
const UserContext = createContext()

const AuthContext = ({children}) => {
    // const [profileImg,setProfileImg]=useState('https://www.transparentpng.com/thumb/user/gray-user-profile-icon-png-fP8Q1P.png')
    const navigate = useNavigate();
    // const backend = 'https://meetorbit-1.onrender.com'
    // const backend = 'https://meetorbit.gdscbiher.in.net'
    const backend = 'http://localhost:5000';

    const [userInfo, setUserInfo] = useState(null);
    const secretKey = 'zoomClone';
    

    const getLocalStorageData = () =>{
        const encryptedData = localStorage.getItem('userData');
        if (encryptedData) {
          try {
            const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
            console.log(bytes)
            const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
            console.log(decryptedData)
            const parsedData = JSON.parse(decryptedData);
            setUserInfo(parsedData);
          } catch (error) {
            console.error("Error decrypting user data:", error);
          }
        }
    }
    useEffect(() => {
        getLocalStorageData();
        
      }, []);


    const saveUserData = (userData) =>{
        const secretKey = 'zoomClone';
        console.log(userData);
        const encryptedData=CryptoJS.AES.encrypt(JSON.stringify(userData), secretKey).toString();
        localStorage.setItem('userData',encryptedData);
        setTimeout(()=>{
            getLocalStorageData();
          },300)
    }


    const userLogOut = () =>{
        localStorage.removeItem('userData');
        navigate('/');
    }



    // for user login and saving data to the local storage
    const userLogin = async (userEmail,userPassword,profileImg,isGoogleLogin)=>{
        try{
            console.log('here')
            const response = await fetch(`${backend}/api/auth/login`,{
                method: 'POST',
                mode:'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({userEmail,userPassword,profileImg,isGoogleLogin})
            });
            const data = await response.json();
            if(response.ok){
                // if(data.success){
                    saveUserData(data.userData);
                    navigate('/home');
                    return {message:data.message,success:data.success}
                // }
            }
            return {message:data.message,success:data.success}

        }catch(err){
            console.log(err)
        }
    }

    // for registering user and saving data to database
    const userRegister = async (userName,userEmail,userPassword,profileImg,isGoogleRegister) =>{
        try{
            const response = await fetch(`${backend}/api/auth/register`,{
                method: 'POST',
                mode:'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({userName,userEmail,userPassword,profileImg,isGoogleRegister})
            });
            if(response.ok){
                
                const data = await response.json();
                userLogin(userEmail,userPassword,profileImg,isGoogleRegister);
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
            const response = await fetch(`${backend}/api/auth/generateOTP`,{
                method: 'POST',
                mode:'cors',
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

    // signup with google
    const handleGoogleAuth = useGoogleLogin({
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
              if(result===true){
                const isGoogleLogin = true;
                console.log('login')
                userLogin(userInfo.email,userInfo.id,userInfo.picture,isGoogleLogin);
              }
              else{
                console.log('register')
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
            const response = await fetch(`${backend}/api/auth/checkUser`,{
                method: 'POST',
                mode:'cors',
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
    
    const resetPassword = async (userEmail,userPassword) =>{
        try{
            const response = await fetch(`${backend}/api/auth/resetPassword`,{
                method: 'POST',
                mode:'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({userEmail,userPassword})
            });
            const data = await response.json();
            if(response.ok){
                return data
            }
            return data
        }catch(err){
            console.log(err);
        }
    }

  return (
    <UserContext.Provider value={{userInfo, generateOTP , userLogin, userRegister ,handleGoogleAuth, checkUser, userLogOut, resetPassword}}>
            {children}
        </UserContext.Provider>
  )
}

export default AuthContext

export const UserAuth = () => {
    return useContext(UserContext)
} 