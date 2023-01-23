import React, { useEffect, useState } from 'react'
import {Rnd} from 'react-rnd'
import { Snipper } from './Snipper.jsx'
export default function SnipWindow() {
  const [screenSize, setScreenSize] = useState({width:0, height:0, x:0, y:0})
  useEffect(()=>{
    window.snipAPI.onSnipLoad((event,{width, height}) => {
      setScreenSize({width,height,x:width/2 -250,y:height/2 -250})
    })

  },[])
  const handleSnip = () => {
    console.log(screenSize)
    window.snipAPI.snipCap(screenSize)
  }
  const cancelSnip = () => {
    console.log("cancel, clicked")
  }
  return (
    <Rnd className="snipControl" 
     size={{ width: screenSize.width, height: screenSize.height }}
    position={{ x: screenSize.x, y: screenSize.y }}
    onDragStop={(event, delta) => {
      setScreenSize((currentSize) => ({...currentSize, x: delta.x, y: delta.y }))
  }}
  onResize={(_event, _direction, ref, _delta, position) => {
    setScreenSize({
        width: ref.style.width,
        height: ref.style.height,
        x : position.x,
        y : position.y
    });
}}
bounds={'window'}>
   <span><button onClick={handleSnip}>SnipWindow</button>
   <button onClick={cancelSnip}>Cancel</button></span>
    <Snipper/> </Rnd>
  )
}
