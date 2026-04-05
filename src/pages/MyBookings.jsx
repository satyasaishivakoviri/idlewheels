import React, {useContext} from 'react'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import { AppContext } from '../context/AppContext';

const MyBookings = () => {
  const { bookings, currency, user } = useContext(AppContext);

  // Filter for bookings made BY this user
  const myRides = bookings.filter(b => b.userEmail === user?.email || b.userName === user?.name || b.user === user?._id);

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl min-h-[60vh] mx-auto pb-20'>
      <Title title='Booking History' subTitle='Track your upcoming and past car rentals' align="left"/>
      <div className='mt-10'>
        {myRides.length > 0 ? myRides.map((booking, index) => (
          <div key={booking._id || index} className='group grid grid-cols-1 md:grid-cols-4 gap-8 p-8 border border-bordercolor/60 rounded-[2.5rem] mt-6 first:mt-12 bg-white hover:shadow-2xl transition-all duration-500 hover:border-primary/20'>
            <div className='md:col-span-1'>
              <div className='rounded-[2rem] overflow-hidden mb-4 shadow-sm group-hover:shadow-md transition-shadow'>
                <img src={booking.image || assets.hero_img} alt="" className='w-full h-auto aspect-video object-cover group-hover:scale-105 transition-transform duration-700' />
              </div>
              <p className='text-xl font-black text-gray-800 tracking-tight'> {booking.carName}</p>
              <div className='flex items-center gap-2 mt-2'>
                  <span className='px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-lg uppercase tracking-widest'>
                      Premium Rental
                  </span>
              </div>
            </div>
            
            <div className='md:col-span-2 flex flex-col justify-center'>
              <div className='flex items-center gap-3 mb-6'>
                <p className='px-4 py-1.5 bg-gray-50 border border-gray-100 text-gray-500 font-bold text-[10px] uppercase tracking-[0.2em] rounded-xl'> Booking #{booking._id.slice(-6)}</p>
                <p className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl border ${
                    booking.status === 'confirmed' ? 'bg-green-50 border-green-100 text-green-600' : 
                    booking.status === 'cancelled' ? 'bg-red-50 border-red-100 text-red-600' :
                    'bg-orange-50 border-orange-100 text-orange-600'
                }`}>
                    {booking.status}
                </p>
              </div>

              <div className='space-y-4'>
                  <div className='flex items-center gap-4'>
                    <div className='w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary font-black scale-90'>
                        <img src={assets.location_icon} alt="" className='w-4 h-4' />
                    </div>
                    <div>
                        <p className='text-[10px] text-gray-400 font-black uppercase tracking-widest'>Location</p>
                        <p className='text-lg font-black text-gray-800 tracking-tight'>
                            {booking.location || 'Visakhapatnam'}
                        </p>
                    </div>
                  </div>

                  <div className='flex items-center gap-4'>
                    <div className='w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary scale-90'>
                        <img src={assets.calendar_icon} alt="" className='w-4 h-4' />
                    </div>
                    <div>
                        <p className='text-[10px] text-gray-400 font-black uppercase tracking-widest'>Booking Date</p>
                        <p className='text-sm font-bold text-gray-700'>
                            {new Date(booking.dateTime || booking.createdAt).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </p>
                    </div>
                  </div>
              </div>
            </div>

            <div className='md:col-span-1 flex flex-col justify-center md:items-end text-left md:text-right border-t md:border-t-0 md:border-l border-gray-50 pt-6 md:pt-0 md:pl-8'>
              <div className='mb-6'>
                  <p className='text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1'>Rental Amount</p>
                  <p className='text-4xl font-black text-primary tracking-tighter'>{currency}{booking.totalPrice}</p>
              </div>
              <div>
                <p className='text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-tighter'>Confirmed on {new Date(booking.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )) : (
          <div className='text-center py-32 bg-gray-50 rounded-[3rem] border border-dashed border-bordercolor'>
            <div className='w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-6'>
                <img src={assets.listIconColored} alt="" className='w-8 h-8 opacity-20' />
            </div>
            <h1 className='text-2xl font-black text-gray-800 tracking-tight'>No bookings found</h1>
            <p className='text-gray-400 mt-2 font-medium'>You haven't booked any cars yet. Start your journey today!</p>
            <button 
                onClick={() => window.location.href='/rides'}
                className='mt-8 px-10 py-4 bg-primary text-white rounded-[2rem] font-black text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all transform active:scale-95'
            >
                Find a Car
            </button>
          </div>
        )}
      </div>
      
    </div>
  )
}

export default MyBookings
