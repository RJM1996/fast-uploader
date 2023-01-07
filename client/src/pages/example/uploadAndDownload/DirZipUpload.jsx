import React from 'react'
import { request } from '@/common/axios'
import { Modal } from 'antd'
import JSZip from 'jszip'

const DirZipUpload = () => {
  async function uploadFile() {
    const uploadFileEle = document.getElementById('DirZipUpload')
    let fileList = uploadFileEle.files
    if (!fileList.length) return
    let webkitRelativePath = fileList[0].webkitRelativePath
    let zipFileName = webkitRelativePath.split('/')[0] + '.zip'
    let zipFile = await generateZipFile(zipFileName, fileList)
    console.log(zipFileName, zipFile)
    upload({
      url: '/zipDirUpload',
      file: zipFile,
      fileName: zipFileName,
    })
  }

  function upload({ url, file, fileName, fieldName = 'file' }) {
    let formData = new FormData()
    formData.append(fieldName, file, fileName)
    console.log('formData: ', formData)
    formData.forEach((value, key) => {
      console.log(key, value)
    })
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
        const { code, msg, url } = result.data
        if (code === 200) {
          Modal.success({
            title: msg,
            content: <div>{url}</div>,
          })
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  // 压缩文件
  function generateZipFile(zipName, files, options = { type: 'blob', compression: 'DEFLATE' }) {
    return new Promise((resolve, reject) => {
      const zip = new JSZip()
      for (let i = 0; i < files.length; i++) {
        zip.file(files[i].webkitRelativePath, files[i])
      }
      zip
        .generateAsync(options)
        .then(function (blob) {
          zipName = zipName || Date.now() + '.zip'
          const zipFile = new File([blob], zipName, {
            type: 'application/zip',
          })
          resolve(zipFile)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  return (
    <div>
      <h2>目录压缩上传</h2>
      <input id='DirZipUpload' type='file' accept='*' webkitdirectory='true' />
      <button id='submit' onClick={uploadFile}>
        上传文件
      </button>
    </div>
  )
}

export default DirZipUpload
