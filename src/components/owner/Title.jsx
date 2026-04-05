import React from 'react'

const Title = ({title, subTitle}) => {
  return (
    <>
      <h1 className='font-medium text-3xl'>{title}</h1>
      <p className='text-sm text-gray-500/90 md:text-base mt-2 max-w-156'>{subTitle}</p>
    </>
  )
}

export default Title
