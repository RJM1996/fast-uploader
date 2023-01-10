import { Modal } from 'antd'
import React from 'react'
import { request } from '../../../common/axios'

const MutipleFileUpload = () => {
  const upload = ({ url, files, fieldName = 'file' }) => {
    let formData = new FormData()
    files.forEach((f) => {
      formData.append(fieldName, f)
    })
    console.log(formData)

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
        const { code, urls } = result.data
        if (code === 200) {
          Modal.success({
            content: (
              <div>
                上传成功
                <ul>
                  {urls.map((url) => (
                    <li>{url}</li>
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

  const uploadFile = () => {
    const uploadFileEle = document.querySelector('#MutipleFileUpload')
    console.log('file: ', uploadFileEle, uploadFileEle.files)
    if (!uploadFileEle.files.length) return
    const files = Array.from(uploadFileEle.files)
    // 省略文件的校验过程，比如文件类型、大小校验
    upload({
      url: '/multiple',
      files,
    })
  }

  return (
    <div>
      <h2>多文件上传</h2>
      <input id='MutipleFileUpload' type='file' accept='*' multiple />
      <button id='submit' onClick={uploadFile}>
        上传文件
      </button>
    </div>
  )
}

export default MutipleFileUpload
