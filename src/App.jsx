import React, { useState, useEffect } from "react";

export default function App() {
  const [title, setTitle] = useState("");
  const [sources, setSources] = useState([]);
  const [imageData,setImageData] =useState()

  const handleCaptureClick = (event) => {
    window.electronAPI.setTitle(title).then(setSources);
    window.sendCaptureCommand.sendCapture()
  };

  const handleSaveClick = (event) =>{
    console.log(event,'save event')
  }
  useEffect(() => {
    window.mountListener.captureListen((event, value)=>{
      setImageData(value)
    })
    console.log(imageData)
  }, [])

  return (
    <>
      <button onClick={handleCaptureClick}>Capture</button>
      <button onClick={handleSaveClick}>Save</button>
      <img src={imageData}></img>
    </>
  );
}