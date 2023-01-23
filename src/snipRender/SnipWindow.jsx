import { CameraFilled, CloseCircleFilled } from '@ant-design/icons'
import { Button, Space } from 'antd'
import React, { useEffect, useState } from 'react'
import {Rnd} from 'react-rnd'
import { Snipper } from './Snipper.jsx'
export default function SnipWindow() {
  const [screenSize, setScreenSize] = useState({width:0, height:0, x:0, y:0})

  //listening for the snip window to load and setting size to the size of that window
  useEffect(()=>{
    window.snipAPI.onSnipLoad((event,{width, height}) => {
      setScreenSize({width:500,height:500,x:(width/2) -250,y:(height/2) -250})
    })

  },[])

  const style = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  //sending a capture with cooresponding screen size
  const handleSnip = () => {
    window.snipAPI.snipCap(screenSize)
  }

  //cancel snip without doing anything
  const cancelSnip = () => {
    window.snipAPI.snipCancel()
  }
  return (
    //the Rnd element is what can be resized and dragged around and sets it's size and position to state
  <Rnd className="snipControl" 
    style={style}
     size={{ width: screenSize.width, height: screenSize.height }}
    position={{ x: screenSize.x, y: screenSize.y }}
    onDragStop={(event, delta) => {
      setScreenSize((currentSize) => ({...currentSize, x: delta.x, y: delta.y }))
    }}
    onResize={(_event, _direction, ref, _delta, position) => {
    setScreenSize({
        width: ref.style.width,
        height: ref.style.height,
        ...position
    });
    }}
    bounds={'window'}>
   <span>
      <Space>
        <Button icon={<CameraFilled/>} onClick={handleSnip}>

        </Button>

        <Button onClick={cancelSnip} icon={<CloseCircleFilled/>}>
        </Button>
      </Space>
    </span>
    <Snipper/> 
  </Rnd>
  )
}
