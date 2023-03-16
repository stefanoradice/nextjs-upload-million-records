import Link from 'next/link'
import React from 'react'

export default function Layouts({children}) {
  return (
    <div className='flex flex-wrap'>
        <div className='header h-[6vh] w-full p-4 shadow-lg shadow-gray-100	flex items-center'>
          <Link className='text-semibold mr-3' href="/">
            Home
          </Link>
          <Link className='text-semibold'  href="/upload">
            Upload
          </Link>
        </div>
        <div className='text-center h-[94vh] w-full flex items-center justify-center'>{children}</div>
    </div>
  )
}
