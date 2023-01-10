import React, { useState } from 'react'
import mergeImages from 'merge-images'
import body from '../../../../public/images/body'
import eyes from '../../../../public/images/eyes'
import mouth from '../../../../public/images/mouth'

const AtagDownload = () => {
  const [mergePicEle, setMergePicEle] = useState()
  const [mergeFileUrl, setMergePicUrl] = useState()

  function merge() {
    mergeImages([
      { src: body, x: 0, y: 0 },
      { src: eyes, x: 32, y: 0 },
      { src: mouth, x: 16, y: 0 },
    ])
      .then((result) => {
        console.log(typeof result)
        setMergePicUrl(result)
        mergePicEle.src = result
      })
      .catch((err) => {
        console.log(err)
      })
  }
  function download() {
    if (!mergeFileUrl) {
      alert('请先合成')
      return
    }
    const imgBlob = dataUrlToBlob(mergeFileUrl, 'image/png')
    console.log(imgBlob)
    saveFile(imgBlob, 'face.png')
  }
  function dataUrlToBlob(base64, mimeType) {
    let bytes = window.atob(base64.split(',')[1])
    let ab = new ArrayBuffer(bytes.length)
    let ia = new Uint8Array(ab)
    // console.log(bytes, ab, ia)
    for (let i = 0; i < bytes.length; i++) {
      ia[i] = bytes.charCodeAt(i)
    }
    console.log(ab, [ab])
    return new Blob([ab], { type: mimeType })
  }
  function saveFile(blob, filename) {
    const aTag = document.createElement('a')
    aTag.download = filename
    const downloadUrl = URL.createObjectURL(blob)
    console.log('url: ', downloadUrl)
    aTag.href = downloadUrl
    aTag.click()
    URL.revokeObjectURL(downloadUrl)
  }

  return (
    <div>
      <h3>a 标签下载示例</h3>
      <div>
        <img src='../../assets/images/body.png' />
        <img src='../../assets/images/eyes.png' />
        <img src='../../assets/images/mouth.png' />
      </div>
      <img id='mergedPic' src='http://via.placeholder.com/256' />
      <br />
      <button onClick={merge}>图片合成</button>
      <button onClick={download}>图片下载</button>
    </div>
  )
}

export default AtagDownload
