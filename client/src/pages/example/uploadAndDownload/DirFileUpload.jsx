import React from 'react'
import { request } from '@/common/axios'
import { Modal } from 'antd'

const DirFileUpload = () => {
  function uploadFile() {
    const uploadFileEle = document.getElementById('DirFileUpload')
    console.log('file: ', uploadFileEle, uploadFileEle.files)
    if (!uploadFileEle.files.length) return
    const files = Array.from(uploadFileEle.files)
    // 省略文件的校验过程，比如文件类型、大小校验
    upload({
      url: '/dir',
      files,
    })
  }

  function upload({ url, files, fieldName = 'file' }) {
    let formData = new FormData()
    files.forEach((f) => {
      formData.append(fieldName, f, f.webkitRelativePath.replace(/\//g, '@'))
    })
    console.log('formData: ', formData)
    request
      .post(url, formData, {
        // 监听上传进度
        onUploadProgress: function (progressEvent) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          console.log('进度', percentCompleted)
        },
      })
      .then((result) => {
        console.log(result.data)
        const { code, msg, urls } = result.data
        if (code === 200) {
          Modal.success({
            content: (
              <div>
                上传成功
                <ul>
                  {urls.map((url) => (
                    <li key={url}>{url}</li>
                  ))}
                </ul>
              </div>
            ),
          })
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <div>
      <h2>目录上传</h2>
      <input id='DirFileUpload' type='file' accept='*' webkitdirectory='true' />
      <button id='submit' onClick={uploadFile}>
        上传文件
      </button>
    </div>
  )
}

export default DirFileUpload
