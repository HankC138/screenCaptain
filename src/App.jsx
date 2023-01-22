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
    const formattedTag = currentTag.replace(/\s+/g, '-').toLowerCase()
    setTags([...tags,formattedTag])
    setCurrentTag([])
  }

  const handleTagInputChange = (event) =>{
    setCurrentTag(event.target.value)
  }

  const handleSearchInputChange = (event) =>{
    setSearchTerm(event.target.value)
  }
  const handleSearch = async () =>{
    const formattedSearch = searchTerm.replace(/\s+/g, '-').toLowerCase()
    const searchData = await window.search.mediaTagSearch(formattedSearch)
    setQueryReturn(JSON.parse(searchData))
  }

  const handleRemoveTag = (event) =>{
    setTags(tags.filter((_tag,index)=> index !== event))
  }
  
  const handleRemoveQueryCap = (event) =>{
    setQueryReturn(queryReturn.filter((_query,index)=> index !== event))
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
      <button disabled={mediaData} onClick={handleCaptureClick}>Capture</button>
      
      <button onClick={handleTagSave}>Attach Tags to Media</button>
      
      <br/>
      <form onSubmit={onSubmitTag}>
      <input id="tagInput" type="text" placeholder="tag to add" value={currentTag} onChange={handleTagInputChange} pattern="^[-a-zA-Z0-9\s]+$"></input>
      
      <button type="submit" disabled={!currentTag.length}>Add Tag</button><br/>
      <label htmlFor="tagInput">No special chars 0-9,A-z only</label>
      <br/>
      </form>
      <br/>

      <ul>{tags ? tags.map((tag, index)=> <li key={`tag ${index}`}><button onClick={() =>handleRemoveTag(index)}>X</button>{" "}{tag}</li>):null}</ul>

      <input id="searchInput" type="text" placeholder="tag search" value={searchTerm} onChange={handleSearchInputChange}></input>
      
      <button onClick={handleSearch} disabled={!searchTerm}>Search</button>
      <br/>
      <label htmlFor="searchInput">ex. tags-like-this</label>

      <img onClick={handleRemoveMedia} src={mediaData}></img>
    {queryReturn ? queryReturn.map((result,index)=> <li key={result.location}><button onClick={() =>handleRemoveQueryCap(index)}>X</button><img src={result.location}/></li>) : null}
    </>
  );
}

