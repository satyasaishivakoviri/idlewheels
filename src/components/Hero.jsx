import React, { useState } from 'react'
import { assets, cityList } from '../assets/assets'
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate = useNavigate();
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/rides?location=${location}&date=${date}`);
    }

    return (
        <div className='min-h-[90vh] flex flex-col items-center justify-center gap-10 bg-light text-center px-4'>
            <div className='space-y-4'>
                <h1 className='text-5xl md:text-7xl font-black tracking-tighter text-gray-900'>
                    IDLEWHEELS
                </h1>
                <p className='text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto uppercase tracking-widest'>
                    Premium Rentals, Effortless Journeys
                </p>
            </div>

            <form onSubmit={handleSearch} className='flex flex-col lg:flex-row items-center justify-between p-2 lg:p-4 rounded-3xl lg:rounded-full w-full max-w-5xl bg-white shadow-[0px_20px_50px_rgba(0,0,0,0.1)] border border-white/50 backdrop-blur-sm'>
                <div className='flex flex-col lg:flex-row items-center gap-6 lg:gap-12 w-full lg:px-8 py-4 lg:py-0'>
                    
                    {/* Location Section */}
                    <div className='flex flex-col items-start gap-1 w-full lg:w-1/2'>
                        <label className='text-[10px] font-bold uppercase text-primary tracking-widest ml-1 cursor-text'>Where</label>
                        <input 
                            type="text"
                            required 
                            placeholder="City or Neighborhood"
                            className='bg-transparent text-gray-800 font-bold outline-none w-full placeholder-gray-400 text-lg'
                            value={location} 
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>

                    <div className='hidden lg:block h-12 w-[1px] bg-gray-200 rounded-full'></div>

                    {/* Date Section */}
                    <div className='flex flex-col items-start gap-1 w-full lg:w-1/2'>
                        <label className='text-[10px] font-bold uppercase text-primary tracking-widest ml-1 cursor-pointer'>When</label>
                        <input 
                            type='date' 
                            required 
                            className='bg-transparent text-gray-800 font-bold outline-none cursor-pointer w-full text-lg'
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            min={new Date().toISOString().split("T")[0]} 
                        />
                    </div>
                </div>

                <button type="submit" className='flex items-center justify-center gap-3 text-white px-12 py-5 w-full lg:w-auto bg-primary hover:bg-primary-dull rounded-2xl lg:rounded-full cursor-pointer transition-all shadow-xl shadow-primary/20 font-bold'>
                    <img src={assets.search_icon} alt="Search" className='w-5 h-5 brightness-200' />
                    Find Cars
                </button>
            </form>

            <div className='relative mt-10'>
                <div className='absolute inset-0 bg-primary/20 blur-[120px] rounded-full scale-150'></div>
                <img src={assets.main_car} alt="RideShare" className='relative max-h-72 object-contain' />
            </div>
        </div>
    )
}

export default Hero
