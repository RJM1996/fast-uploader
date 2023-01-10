import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { Space } from 'antd'

const http = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 60000,
})

const BigFileDownload = () => {
  const [fileName, setFileName] = useState('Warp.dmg')
  const [fileSize, setFileSize] = useState(0)
  const CHUNK_SIZE = 10 * 1024 * 1024 // 一个分片10MB

  async function asyncPool(poolLimit, array, iteratorFn) {
    const allTask = [] // 存储所有的异步任务
    const executing = [] // 存储正在执行的异步任务
    for (const item of array) {
      // 调用 iteratorFn 函数创建异步任务
      const p = Promise.resolve().then(() => iteratorFn(item, array))
      allTask.push(p) // 保存新的异步任务

      // 当 poolLimit 值小于或等于总任务个数时，进行并发控制
      if (poolLimit <= array.length) {
        // 当任务完成后，从正在执行的任务数组中移除已完成的任务
        const e = p.then(() => executing.splice(executing.indexOf(e), 1))
        executing.push(e) // 保存正在执行的异步任务
        if (executing.length >= poolLimit) {
          await Promise.race(executing) // 等待较快的任务执行完成
        }
      }
    }
    return Promise.all(allTask)
  }

  const saveFile = (name, buffers, mime = 'application/octet-stream') => {
    const blob = new Blob([buffers], { type: mime })
    const blobUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.download = name
    a.href = blobUrl
    a.click()
    URL.revokeObjectURL(blob)
  }

  // 获取待下载文件的大小
  async function getFileSize(name = fileName) {
    try {
      const res = await http.get(`/size/${name}`)
      setFileSize(res?.data?.data || 0)
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
      const result = await http.get(`/down/${fileName}`, options)
      return { index: i, data: result }
    } catch (error) {
      return {}
    }
  }
  // 分片下载
  async function onDownload() {
    try {
      const fileSize = await getFileSize(fileName)
      const chunksCount = Math.ceil(fileSize / CHUNK_SIZE)

      const results = await asyncPool(3, [...new Array(chunksCount).keys()], (i) => {
        const start = i * CHUNK_SIZE
        const end = i + 1 === chunksCount ? fileSize : (i + 1) * CHUNK_SIZE - 1
        return getBinaryContent(start, end, i)
      })
      results.sort((a, b) => a.index - b.index)
      const buffers = new Blob(results.map((r) => r.data.data))
      saveFile(fileName, buffers)
    } catch (error) {
      console.log({ error })
    }
  }
  // 单文件直接下载
  async function onDownloadSingle() {
    try {
      const res = await getBinaryContent(0, 0, 0, false)
      const buffers = new Blob([res.data.data])
      saveFile(fileName, buffers)
    } catch (error) {
      console.log({ error })
    }
  }

  return (
    <div id='bigFileDownLoad'>
      <h3>大文件分片下载</h3>
      <div>文件名: {fileName}</div>
      <div>文件大小: {fileSize}</div>
      <Space>
        <button onClick={() => getFileSize(fileName)}>获取文件大小</button>
        <button onClick={onDownload}>分片下载</button>
        <button onClick={onDownloadSingle}>直接下载</button>
      </Space>
    </div>
  )
}

export default BigFileDownload
