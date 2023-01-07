import React from 'react'
import axios from 'axios'

const SingleFileUpload = () => {
  const upload = ({ url, file, fieldName = 'file' }) => {
    const request = axios.create({
      baseURL: 'http://localhost:3000/upload',
      timeout: 60000,
    })
    let formData = new FormData()
    formData.set(fieldName, file)
    console.log(formData)
    request
      .post(url, formData, {
        // 监听上传进度
        onUploadProgress(progressEvent) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          console.log('进度', percentCompleted)
        },
      })
      .then((result) => {
        console.log(result.data)
        const { code, data, msg } = result.data
        if (code === 200) {
          alert(`${msg}, 地址: ${data.docPath}`)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const uploadFile = () => {
    const uploadFileEle = document.querySelector('#uploadFile')
    console.log(uploadFileEle, uploadFileEle.files)
    if (!uploadFileEle.files.length) return
    const file = uploadFileEle.files[0] // 获取单个文件
    // 省略文件的校验过程，比如文件类型、大小校验
    upload({
      url: '/single',
      file,
    })
  }

  return (
    <div>
      <h2>单文件上传</h2>
      <div>
        <input id='uploadFile' type='file' accept='*' />
        <button id='submit' onClick={uploadFile}>
          上传文件
        </button>
      </div>
    </div>
  )
}

export default SingleFileUpload
