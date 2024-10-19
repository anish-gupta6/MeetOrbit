import React from 'react'
import Logo from '../../assets/Logo.png'

const AppLoader = () => {
    const cntnrStyle = {
        backgroundColor:'white',
        width:'100%',
        height:'100vh',
        display:'flex',
        alignItems:'center',
        justifyContent:'center'
    }
    const imgCntnrStyle = {
        width:'300px',
        height:'200px',
        objectFit:'contain'
    }
  return (
    <div>
      <div className="app-loader-cntnr" style={cntnrStyle}>
        <div className="app-loader-img-cntnr" style={imgCntnrStyle}><img src={Logo} className='app-loader-img' style={imgCntnrStyle}/></div>
      </div>
    </div>
  )
}

export default AppLoader
