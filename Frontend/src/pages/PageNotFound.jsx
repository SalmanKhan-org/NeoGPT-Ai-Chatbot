import React from 'react'
import { Link } from 'react-router-dom'

const PageNotFound = () => {
  return (
    <div className='w-full h-screen bg-neutral-900 flex items-center justify-center'>
          <div className='w-full max-w-md bg-neutral-800 shadow-md rounded-md p-8 flex flex-col space-y-2'>
              <h1 className='text-lg font-semibold text-white'>NeoGPT</h1>
              <p className='text-sm text-white'>The page you are looking for is not Found </p>
              <Link to={'/'} className=' block mx-auto px-4 py-2 rounded-md leading-none text-black bg-white border-none hover:bg-white/80 transition-colors duration-300 cursor-pointer'>Go  Home</Link>
      </div>
    </div>
  )
}

export default PageNotFound
