import React, { useState, useEffect } from "react";

export default function App() {
  const [mediaData,setMediaData] =useState()
  const [mediaId, setMediaId] = useState()
  const [tags, setTags] = useState([])
  const [currentTag, setCurrentTag] = useState([])

  useEffect(() => {
    window.mediaCapListener.mediaCaptureEvent((event, value)=>{
      setMediaData(value)
    window.updatedTags.updateTagsEvent((event, value) =>{
      setMediaId(value)
    })
    })
  }, [])

  const handleCaptureClick = () => {
    window.mediaCapture.sendMediaCapture()
  };

  const onSubmitTag = (event) =>{
    event.preventDefault()
    setTags([...tags,currentTag])
    setCurrentTag([])
  }

  const handleInputChange = (event) =>{
    setCurrentTag(event.target.value)
  }

  const handleRemoveTag = (event) =>{
    setTags(tags.filter((tag,index)=> index !== event))
  }

  const handleTagSave = () =>{
    window.tagsSave.sendTags({mediaId, tags})
  }

  return (
    <>
      <button onClick={handleCaptureClick}>Capture</button><button onClick={handleTagSave}>Save Tags to Screen Cap</button><br/>
      <form onSubmit={onSubmitTag}>
      <input type="text" placeholder="tags" value={currentTag} onChange={handleInputChange}></input><button type="submit">Add Tag</button><br/>
      </form><br/>
      <ul>{tags ? tags.map((tag, index)=> <li key={`tag ${index}`}><button onClick={() =>handleRemoveTag(index)}>X</button>{" "}{tag}</li>):null}</ul>
      <img src={mediaData}></img>
    </>
  );
}