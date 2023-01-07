import axios from 'axios'
import React from 'react'
import { useState } from 'react'

const http = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 60000,
})

const BigFileDownload = () => {
  const [fileName, setFileName] = useState('fileName')
  const [fileSize, setFileSize] = useState(0)

  // 获取待下载文件的大小
  async function getFileSize(name = this.fileName) {
    try {
      const res = await http.get(`/size/${name}`)
      this.fileSize = res.data.data
      return res.data.data
    } catch (error) {
      console.log({ error })
    }
  }
  /**
   * 下载分片内容
   * @param {*} start
   * @param {*} end
   * @param {*} i
   * @param {*} ifRange
   */
  async function getBinaryContent(start, end, i, ifRange = true) {
    try {
      let options = {
        responseType: 'blob',
      }
      if (ifRange) {
        options.headers = {
          Range: `bytes=${start}-${end}`,
        }
      }
      const result = await http.get(`/down/${this.fileName}`, options)
      return { index: i, data: result }
    } catch (error) {
      return {}
    }
  }
  // 分片下载
  async function onDownload() {
    try {
      const fileSize = await this.getFileSize(this.fileName)
      const chunksCount = Math.ceil(fileSize / CHUNK_SIZE)

      const results = await asyncPool(3, [...new Array(chunksCount).keys()], (i) => {
        const start = i * CHUNK_SIZE
        const end = i + 1 === chunksCount ? fileSize : (i + 1) * CHUNK_SIZE - 1
        return this.getBinaryContent(start, end, i)
      })
      results.sort((a, b) => a.index - b.index)
      const buffers = new Blob(results.map((r) => r.data.data))
      saveFile(this.fileName, buffers)
    } catch (error) {
      console.log({ error })
    }
  }
  // 单文件直接下载
  async function onDownloadSingle() {
    try {
      const res = await this.getBinaryContent(0, 0, 0, false)
      const buffers = new Blob([res.data.data])
      saveFile(this.fileName, buffers)
    } catch (error) {
      console.log({ error })
    }
  }

  return (
    <div id='bigFileDownLoad'>
      <h3>大文件分片下载</h3>
      <div>
        fileName: {fileName}
        fileSize: {fileSize}
      </div>
      <button onClick={() => getFileSize(fileName)}>获取文件大小</button>
      <button onClick={onDownload}>分片下载</button>
      <button onClick={onDownloadSingle}>直接下载</button>
    </div>
  )
}

export default BigFileDownload
