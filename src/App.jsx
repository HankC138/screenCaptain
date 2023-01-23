import React, { useState, useEffect } from "react";
import { Button, Image, Input, Layout, Space,Tag,Spin,Form } from 'antd';
import { CameraOutlined, CloseOutlined,CloudUploadOutlined,LoadingOutlined,CloseCircleOutlined, PlusCircleOutlined} from "@ant-design/icons";
import '../node_modules/antd/dist/reset.css';
import { Content } from "antd/es/layout/layout";

export default function App() {
  const [mediaData,setMediaData] =useState()
  const [mediaId, setMediaId] = useState()
  const [tags, setTags] = useState([])
  const [currentTag, setCurrentTag] = useState("")
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
    window.capAPI.onCapture((_event, value)=>{
      setMediaData(value)
      setTimeout(()=>setLoading(false),1000)
    window.tagAPI.onTagUpdate((_event, value) =>{
      setMediaId(value)
    })
    })
  }, [])

  const handleCaptureClick = () => {
    window.capAPI.sendMediaCap()
    setLoading(true)
  };

  const onSubmitTag = (_event) =>{
    const formattedTag = currentTag.replace(/\s+/g, '-').toLowerCase()
    setTags([...tags,formattedTag])
    setCurrentTag("")
    form.resetFields()
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
    setSearchTerm("")
    const searchData = await window.tagAPI.mediaTagSearch(formattedSearch)
    const searchReturn = JSON.parse(searchData)
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

  const handleTagSave = (_event) =>{
    window.tagAPI.saveTags({mediaId, tags})
    setTags([])
    setMediaData()
    }

  const handleSnip = () => {
    window.mainSnipAPI.snipCap()
  }
  
  const [form] = Form.useForm();

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
    <br/>
      <Form form={form} onFinish={onSubmitTag} name="tag">
      <Input.Group compact>
      <Form.Item
        name="tag"
        rules={[
          {
            required: true,
            pattern: new RegExp(
              /^[-a-zA-Z0-9\s]+$/
            ),
            message: "No special characters"
          }
        ]}
      >
     
        <Input value={currentTag} onChange={handleTagInputChange} placeholder="tags-to-add" />
      </Form.Item>
      <Form.Item>
      <Button icon={<PlusCircleOutlined/>} htmlType="submit">Add Tag</Button></Form.Item></Input.Group>
    </Form>

      <Content>

      <ul>{tags ? tags.map((tag, index)=><Tag key={`tag ${index}`} icon={<CloseCircleOutlined/>} color={tagColors[index]} onClick={()=>handleRemoveTag(index)}>{tag}</Tag>):null}</ul>
      
      <Input.Search enterButton id="searchInput" type="text" placeholder="Search Tags" allowClear value={searchTerm} onSearch={handleSearch} onChange={handleSearchInputChange}></Input.Search>
      <label htmlFor="searchInput">ex. tags-like-this</label><br/>

      {loading ? null : <Image preview={false} onClick={handleRemoveMedia} src={mediaData}></Image>}
      <Spin spinning={loading} indicator={<LoadingOutlined style={{ fontSize: 100 }} spin/>}/>
      {queryReturn.length ? <h3>Search Results:</h3> : null}
    {queryReturn ? queryReturn.map((result,index)=> <span key={result.location}><Button shape="circle" icon={<CloseOutlined/>} onClick={() =>handleRemoveQueryCap(index)}></Button><Image src={result.location}/></span>) : null}
    {noTagsFound ? <div>NO TAGS FOUND</div> : null}
    </Content>
    
    </Layout>
    </>
  );
}


  