import React, { useState, useEffect } from "react";

export default function App() {
  const [mediaData,setMediaData] =useState()
  const [mediaId, setMediaId] = useState()
  const [tags, setTags] = useState([])
  const [currentTag, setCurrentTag] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [queryReturn, setQueryReturn] = useState([])

  useEffect(() => {
    window.mediaCapListener.mediaCaptureEvent((_event, value)=>{
      setMediaData(value)
    window.updatedTags.updateTagsEvent((_event, value) =>{
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

  const handleTagInputChange = (event) =>{
    setCurrentTag(event.target.value)
  }

  const handleSearchInputChange = (event) =>{
    setSearchTerm(event.target.value)
  }
  const handleSearch = async () =>{
    const searchData = await window.search.mediaTagSearch(searchTerm)
    setQueryReturn(JSON.parse(searchData))
  }

  const handleRemoveTag = (event) =>{
    setTags(tags.filter((_tag,index)=> index !== event))
  }
  
  const handleRemoveMedia = (_event) =>{
    setMediaData()
  }

  const handleTagSave = () =>{
    window.tagsSave.sendTags({mediaId, tags})
    setTags([])
    setMediaData()
    }
  
  return (
    <>
      <button disabled={mediaData} onClick={handleCaptureClick}>Capture</button><button onClick={handleTagSave}>Attach Tags to Media</button><br/>
      <form onSubmit={onSubmitTag}>
      <input type="text" placeholder="tag to add" value={currentTag} onChange={handleTagInputChange}></input><button type="submit" disabled={!currentTag.length}>Add Tag</button><br/>
      </form><br/>
      <ul>{tags ? tags.map((tag, index)=> <li key={`tag ${index}`}><button onClick={() =>handleRemoveTag(index)}>X</button>{" "}{tag}</li>):null}</ul>
      <input type="text" placeholder="tag search" value={searchTerm} onChange={handleSearchInputChange}></input><button onClick={handleSearch} disabled={!searchTerm}>Search</button><br/>
      <img onClick={handleRemoveMedia} src={mediaData}></img>
    {queryReturn ? queryReturn.map((result)=> <img key={result.location} src={result.location}/>) : null}
    </>
  );
}

