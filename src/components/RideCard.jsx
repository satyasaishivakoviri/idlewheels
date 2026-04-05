import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const RideCard = ({ride}) => {
    const { currency } = useContext(AppContext);
    const navigate = useNavigate();

    // Calculate simulated CO2 saving (e.g. 0.2kg per KM shared)
    const co2Saved = 12.5; 

    return (
        <div onClick={() => {navigate(`/ride-details/${ride._id}`); scrollTo(0, 0)}} className='group rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl cursor-pointer transition-all duration-500 bg-white border border-bordercolor/50 hover:border-primary/20'>
            <div className='relative h-52 overflow-hidden'>
                <img src={ride.image} alt="Car vehicle" className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110' />
                
                <div className='absolute top-4 left-4 flex flex-col gap-2'>
                    <span className='bg-white/90 backdrop-blur-md text-primary text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm uppercase tracking-widest'>
                        {ride.carName}
                    </span>
                    <span className='bg-primary/90 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm uppercase tracking-widest flex items-center gap-1'>
                        {ride.brand} {ride.model}
                    </span>
                </div>

                <div className='absolute bottom-4 right-4 bg-gray-900/90 backdrop-blur-md text-white px-4 py-2 rounded-2xl shadow-xl border border-white/10'>
                    <span className='text-xs font-bold opacity-60 mr-1'>{currency}</span>
                    <span className='text-xl font-black'>{ride.pricePerDay}</span>
                    <span className='text-[10px] font-bold opacity-60 ml-1 uppercase tracking-tighter'>/ day</span>
                </div>
            </div>

            <div className='p-6'>
                <div className='flex items-center gap-2 mb-4'>
                    <div className='flex flex-col items-start'>
                        <h3 className='text-xl font-black text-gray-800 tracking-tight flex items-center gap-2'>
                            {ride.carName} 
                            <span className='text-xs font-bold text-gray-400'>({ride.location})</span>
                        </h3>
                        <p className='text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1'>
                            Recently Updated • {new Date(ride.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </p>
                    </div>
                </div>

                <div className='h-[1px] w-full bg-gray-100 mb-5'></div>

                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <img src={assets.user_profile} alt="" className='w-8 h-8 rounded-full border-2 border-primary/10' />
                        <div>
                            <p className='text-[10px] text-gray-400 font-black uppercase tracking-widest'>Owner</p>
                            <p className='text-xs font-bold text-gray-700'>{ride.ownerName}</p>
                        </div>
                    </div>
                    
                    <div className='text-right'>
                        <p className='text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1'>Seating</p>
                        <div className='flex items-center gap-1 justify-end'>
                            <img src={assets.users_icon} alt="" className='w-3 h-3 opacity-30' />
                            <span className='text-xs font-black text-gray-800 ml-1'>{ride.seatingCapacity} Seater</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RideCard
