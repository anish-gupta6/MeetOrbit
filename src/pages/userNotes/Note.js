import React from 'react'
import { Outlet } from 'react-router-dom'
import './Note.css'

const Note = () => {
  return (
    <div>
      <Outlet/>
    </div>
  )
}

export default Note
