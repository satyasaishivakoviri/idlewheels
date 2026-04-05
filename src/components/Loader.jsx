import React from 'react'

const Loader = () => {
  return (
    <div className='flex items-center justify-center h-[80vh]'>
      <div className='animate-spin rounded-ful w-14 h-14 border-4 border-gray-300 border-t-primary'></div>
    </div>
  )
}

export default Loader
