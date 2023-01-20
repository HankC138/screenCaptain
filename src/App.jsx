import React, { useState, useEffect } from "react";

export default function App() {
  const [title, setTitle] = useState("");
  const [sources, setSources] = useState([]);
  const [imageData,setImageData] =useState()

  const handleClick = (event) => {
    window.electronAPI.setTitle(title).then(setSources);
    window.sendCaptureCommand.sendCapture()
  };

  useEffect(() => {
    window.mountListener.captureListen((event, value)=>{
      setImageData(value)
    })
    console.log(imageData)
  }, [imageData])

  return (
    <>
      <button onClick={handleClick}>Capture</button>
      <img src={imageData}></img>
    </>
  );
}