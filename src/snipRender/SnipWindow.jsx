import React, { useEffect } from 'react'
const electron = require('electron')
export default function SnipWindow() {

  useEffect(()=>{
    // window.snipAPI.screenSize()
  })
  const handleSnip = () => {
    window.snipAPI.snipCap()
  }
  return (
    <button onClick={handleSnip}>SnipWindow</button>
  )
}
