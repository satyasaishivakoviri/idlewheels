import React from 'react'
import { assets } from '../assets/assets'

const Banner = () => {
  return (
    <div className='flex flex-col items-center justify-between md:flex-row px-12 py-16 bg-gradient-to-br from-primary to-[#5089ff] max-w-7xl mx-6 md:mx-auto rounded-[3rem] overflow-hidden shadow-2xl relative group'>
        <div className='absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-150 transition-transform duration-1000'></div>
        <div className='text-white z-10'>
            <h2 className='text-4xl md:text-5xl font-black tracking-tighter'>List Your Car</h2>
            <p className='mt-4 text-white/80 font-medium text-lg max-w-md leading-relaxed'>
                Monetize your idle vehicle by listing it on <span className='font-black text-white'>IdleWheels</span>. 
            </p>
            <p className='mt-2 text-white/60 font-bold uppercase text-xs tracking-[0.2em]'>
                Join 10,000+ Verified Owners
            </p>
            <button 
                onClick={() => window.location.href='/owner/add-ride'}
                className='px-10 py-5 bg-white text-primary rounded-2xl font-black text-lg mt-10 shadow-xl shadow-black/10 hover:shadow-white/20 transition-all transform hover:scale-[1.05] active:scale-[0.95] cursor-pointer'
            >
                START LISTING
            </button>
        </div>
        <img 
            src={assets.banner_car_image} 
            alt="car" 
            className='max-h-64 mt-12 md:mt-0 z-10 group-hover:translate-x-4 transition-transform duration-700 drop-shadow-2xl' 
        />
    </div>
  )
}

export default Banner
