import React, { useContext } from 'react'
import Title from './Title'
import { assets } from '../assets/assets'
import RideCard from './RideCard'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const FeaturedSection = () => {
  const navigate = useNavigate();
  const { rides } = useContext(AppContext);
  
  return (
    <div className='flex flex-col items-center py-32 px-6 md:px-16 lg:px-24 xl:px-32 bg-white'>
        <div className='max-w-4xl text-center'>
            <Title 
                title="Featured Car Rentals" 
                subTitle="Discover premium cars from verified owners in your city. Direct access, transparent pricing, and 24/7 support for every journey." 
            />
        </div>
        
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-16 w-full max-w-7xl'>
            {
                rides.slice(0, 6).map((ride, index) => (
                    <div key={ride._id} className='animate-fadeIn' style={{animationDelay: `${index * 0.1}s`}}>
                        <RideCard ride={ride} />
                    </div>
                ))
            }
        </div>

        <button 
            onClick={()=> {navigate('/rides'); scrollTo(0,0)}} 
            className='flex items-center justify-center gap-3 px-10 py-4 bg-primary text-white rounded-[2rem] font-black text-lg mt-20 hover:shadow-2xl hover:shadow-primary/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
        >
            Explore All Cars 
            <img src={assets.arrow_icon} alt="arrow" className='brightness-200 w-4' />
        </button>
      
    </div>
  )
}

export default FeaturedSection
