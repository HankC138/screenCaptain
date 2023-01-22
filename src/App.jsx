import React, { useState, useEffect } from "react";
import { Button, Image, Input, Layout, Space,Tag,Spin } from 'antd';
import { CameraOutlined, CloseOutlined,CloudUploadOutlined,LoadingOutlined} from "@ant-design/icons";
import '../node_modules/antd/dist/reset.css';
import { Content } from "antd/es/layout/layout";

export default function App() {
  const [mediaData,setMediaData] =useState()
  const [mediaId, setMediaId] = useState()
  const [tags, setTags] = useState([])
  const [currentTag, setCurrentTag] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [queryReturn, setQueryReturn] = useState([])
  const [noTagsFound, setNoTagsFound] = useState(false)
  const [loading, setLoading] = useState(false)
  const tagColors = [
    "magenta",
      "red",
      "purple",
      "blue",
      "lime",
      "gold",
      "green",
      "orange",
      "cyan",
      "volcano",
      "geekblue",
  ]
  useEffect(() => {
    window.mediaCapListener.mediaCaptureEvent((_event, value)=>{
      setMediaData(value)
      setTimeout(()=>setLoading(false),1000)
    window.updatedTags.updateTagsEvent((_event, value) =>{
      setMediaId(value)
    })
    })
  }, [])

  const handleCaptureClick = () => {
    window.mediaCapture.sendMediaCapture()
    setLoading(true)
  };

  const onSubmitTag = (event) =>{
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
    setQueryReturn([])
    setNoTagsFound(false)
    const formattedSearch = searchTerm.replace(/\s+/g, '-').toLowerCase()
    const searchData = await window.search.mediaTagSearch(formattedSearch)
    const searchReturn = JSON.parse(searchData)
    console.log(searchReturn[0].NOTHING)
    if(searchReturn[0].NOTHING) return setNoTagsFound(true)
    return setQueryReturn(searchReturn)
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
    <Layout style={{backgroundColor:"white"}}>
      <Space>
        <span>
      <Button type="primary" disabled={mediaData} icon={<CameraOutlined/>} onClick={handleCaptureClick}>Window Capture</Button>
      <Button disabled={mediaData} onClick={handleSnip} icon={<CameraOutlined/>}>Snip Capture</Button>
      <Button onClick={handleTagSave} icon={<CloudUploadOutlined />}>Attach Tags to Media</Button>
      </span>
      </Space>
      <Content>
      <br/>
      <Input.Search id="tagInput" type="text" placeholder="tag-here" value={currentTag} enterButton="Add Tag"  onChange={handleTagInputChange} onSearch={onSubmitTag} pattern="^[-a-zA-Z0-9\s]+$"></Input.Search>
      <label htmlFor="tagInput">No special chars 0-9,A-z only</label>
      <br/>
      <br/>

      <ul>{tags ? tags.map((tag, index)=><Tag key={`tag ${index}`} icon={<CloseOutlined/>} color={tagColors[index]} onClick={()=>handleRemoveTag(index)}>{tag}</Tag>):null}</ul>
      
      <Input.Search id="searchInput" type="text" placeholder="Search Tags" allowClear value={searchTerm} onSearch={handleSearch} onChange={handleSearchInputChange}></Input.Search>
      <label htmlFor="searchInput">ex. tags-like-this</label><br/>

      {loading ? null : <Image preview={false} onClick={handleRemoveMedia} src={mediaData}></Image>}
      <Spin spinning={loading} indicator={<LoadingOutlined style={{ fontSize: 100 }} spin/>}/>
    {queryReturn ? queryReturn.map((result,index)=> <span key={result.location}><Button shape="circle" icon={<CloseOutlined/>} onClick={() =>handleRemoveQueryCap(index)}></Button><Image src={result.location}/></span>) : null}
    {noTagsFound ? <div>NO TAGS FOUND</div> : null}
    </Content>
    </Layout>
    </>
  );
}


  