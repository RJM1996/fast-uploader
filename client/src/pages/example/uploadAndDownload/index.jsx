import React, { Component } from 'react'
import BigFileUpload from './BigFileUpload'
import { Button } from 'antd'
import download from '@/common/download.js'

class UploadAndDownload extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  download = () => {
    const url = 'http://localhost:3000/download'
    download(url)
  }

  render() {
    return (
      <div>
        <div className='g-content'>
          <BigFileUpload></BigFileUpload>
        </div>
        <div className='g-content'>
          <div>
            <h2>单文件下载</h2>
            <Button onClick={this.download}>下载文件</Button>
          </div>
        </div>
      </div>
    )
  }
}

export default UploadAndDownload
