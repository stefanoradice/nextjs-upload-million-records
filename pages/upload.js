import Layout from '@/components/Layout'
import React, { useEffect, useRef, useState } from 'react'

export default function upload() {
  const [batchInfo, setBatchInfo] = useState({});
  const [batchId, setBatchId] = useState(null);
  const [batchProgress, setBatchProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = 'http://localhost:8000/api'
  let refFile = useRef();

  function handleSubmit(e) {
    e.preventDefault();
    if (!isLoading) {
      setIsLoading(true);
      let files = refFile.current.files;
      if (!files[0]) return;
      let formData = new FormData();
      formData.append('csv', files[0])
      fetch(`${API_URL}/upload`, { method: 'POST', body: formData }).then(res => res.json()).then(
        (data) => {
          setIsLoading(false);
          setBatchInfo(data)
          setBatchId(data.id)
        });
    }

  }

  function getBatchInfo() {
    if (batchInfo && batchInfo.id) {
      if (batchProgress != undefined && batchProgress < 100) {
        const BATCH_ID = batchInfo.id;
        fetch(`${API_URL}/batch/${BATCH_ID}`).then(res => res.json()).then(
          data => {
            setBatchInfo(data);
            setBatchProgress(data.progress);
            setIsLoading(false)
          }
        );
      }

    }
  }

  function getPendingBatch() {

    fetch(`${API_URL}/batch/in-progress`).then(res => res.json()).then(
      data => {
        setBatchInfo(data[0])
        setBatchId(data[0].id)
      }
    ).catch(e => {
      setIsLoading(false)
    });
  }
  useEffect(() => {
    if (batchInfo != undefined) {
      getBatchInfo()
    }
  }, [batchInfo]);

  useEffect(() => {
    getPendingBatch()
  }, []);

  return (
    <Layout>
      {
        isLoading &&
        <div>Loading...</div>
      }
      {
        !isLoading && batchId != undefined && batchInfo && batchInfo.progress >= 0 &&
        <section>
          <div>
            <p>Current upload progress ({batchInfo.progress}%)</p>
            <div className='w-full rounded-lg border shadow-inner h-4'><div className='rounded-lg h-4 w-full bg-blue-700' style={{ width: `${batchInfo.progress}%` }}></div></div>
          </div>
        </section>
      }
      {
        !isLoading && batchId == undefined &&
        <div className='fit-content'>
          <h1 className='text-xl -text-grey-800 mb-5 text-center'>Choose a file to upload</h1>
          <form className='border rounded p-4'>
            <input type="file" ref={refFile} />
            <input type="submit" onClick={handleSubmit} value="upload" className={`px-4 py-2 bg-gray-700 rounded text-white ${isLoading ? 'bg-gray-400 outline-none' : 'bg-gray-700'}`} />
          </form>
        </div>
      }

    </Layout>
  )
}
