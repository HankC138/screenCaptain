import React, { useState, useEffect } from "react";
import { Button, Form, Input, } from 'antd';
import '../node_modules/antd/dist/reset.css';

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
    // event.preventDefault()
    const formattedTag = currentTag.replace(/\s+/g, '-').toLowerCase()
    console.log(tags,"tags")
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

  const handleTagSave = (event) =>{
    console.log(event)
    window.tagsSave.sendTags({mediaId, tags})
    setTags([])
    setMediaData()
    }

  const handleSnip = () => {
    window.snipCapture.takeSnip()
  }
  
  return (
    <>
      <Button type="primary" disabled={mediaData} onClick={handleCaptureClick}>Window Capture</Button>
      <Button disabled={mediaData} onClick={handleSnip}>Snip Capture</Button>

      <Button onClick={handleTagSave}>Attach Tags to Media</Button>
      
      <br/>
      <Form onFinish={onSubmitTag}>
      <Form.Item id="tagInput" type="text" placeholder="tag to add" value={currentTag} onChange={handleTagInputChange} pattern="^[-a-zA-Z0-9\s]+$"><Input/></Form.Item>
      <Form.Item>
      <Button type="primary" htmlType="submit" disabled={!currentTag.length}>Add Tag</Button></Form.Item><br/>
      <label htmlFor="tagInput">No special chars 0-9,A-z only</label>
      <br/>
      </Form>
      <br/>

      <ul>{tags ? tags.map((tag, index)=> <li key={`tag ${index}`}><Button onClick={() =>handleRemoveTag(index)}>X</Button>{" "}{tag}</li>):null}</ul>
      <Form onFinish={handleSearch}>
      <Form.Item id="searchInput" type="text" placeholder="tag search" value={searchTerm} onChange={handleSearchInputChange}><Input/></Form.Item>
      
      <Form.Item><Button type="default" htmlType="submit" disabled={!searchTerm}>Search</Button></Form.Item></Form>
      <br/>
      <label htmlFor="searchInput">ex. tags-like-this</label>

      <img onClick={handleRemoveMedia} src={mediaData}></img>
    {queryReturn ? queryReturn.map((result,index)=> <li key={result.location}><Button onClick={() =>handleRemoveQueryCap(index)}>X</Button><img src={result.location}/></li>) : null}
    </>
  );
}

