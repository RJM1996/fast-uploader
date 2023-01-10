import React, { Component } from 'react'
import { Button } from 'antd'
import download from '@/common/download.js'
import BigFileUpload from './BigFileUpload'
import SingleFileUpload from './SingleFileUpload'
import MutipleFileUpload from './MutipleFileUpload'
import DirFileUpload from './DirFileUpload'
import DirZipUpload from './DirZipUpload'
import BigFileDownload from './BigFileDownload'

class UploadAndDownload extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  download = () => {
    const url = 'http://localhost:3000/download'
    download(url)
  }

  download1 = () => {
    let url = 'https://example.com'
    let headers = {
      Authorization: 'Bearer 1234567890',
      'Content-Type': 'application/json',
    }

    let params = 'height=600,width=800'

    for (let key in headers) {
      params += `,${key}=${headers[key]}`
    }

    let win = window.open(url, '__self', params)
    console.log(win)
  }

  render() {
    return (
      <div>
        <Button onClick={this.download1}>window.open</Button>
        <div className='g-content'>
          <BigFileUpload></BigFileUpload>
        </div>
        <div className='g-content'>
          <div>
            <h2>单文件下载</h2>
            <Button onClick={this.download}>下载文件</Button>
          </div>
        </div>
        <div className='g-content'>
          <SingleFileUpload />
        </div>
        <div className='g-content'>
          <MutipleFileUpload />
        </div>
        <div className='g-content'>
          <DirFileUpload />
        </div>
        <div className='g-content'>
          <DirZipUpload />
        </div>
        <div className='g-content'>
          <BigFileDownload />
        </div>
      </div>
    )
  }
}

export default UploadAndDownload
