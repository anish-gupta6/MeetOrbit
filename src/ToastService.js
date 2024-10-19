import React,{createContext,useContext} from 'react'
import { PiCheckCircleFill } from 'react-icons/pi';
import { toast } from 'react-toastify';

const toastContext = createContext(null);

const ToastService = ({children}) => {
    const notifySuccess = (message) => toast.success(<div style={{display:'flex',alignItems:'center',gap:'15px'}}><PiCheckCircleFill style={{fontSize:'24px',color:'#0e72ed'}}/> {message}</div>);
    const notifyError = (message) => toast.error(message);
    const notifyInfo = (message) => toast.info(message);
    const notifyWarning = (message) => toast.warn(message);
  return (
    <toastContext.Provider value={{notifySuccess,notifyError,notifyInfo,notifyWarning}}>
        {children}
    </toastContext.Provider>
  )
}

export default ToastService

export const useToast = () => {
    return useContext(toastContext)
} 




