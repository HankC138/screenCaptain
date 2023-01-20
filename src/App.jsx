import React, { useState, useEffect } from "react";

export default function App() {
  const [imageData,setImageData] =useState()

  const handleCaptureClick = () => {
    window.sendCaptureCommand.sendCapture()
  };

  useEffect(() => {
    window.mountListener.captureListen((event, value)=>{
      setImageData(value)
    })
  }, [])

  return (
    <>
      <button onClick={handleCaptureClick}>Capture</button>
      <img src={imageData}></img>
    </>
  );
}