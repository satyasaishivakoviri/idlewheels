import React, {useContext, useState} from 'react'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import { AppContext } from '../context/AppContext';
import ChatModal from '../components/ChatModal';

const MyBookings = () => {
  const { bookings, currency, user } = useContext(AppContext);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Filter for bookings made BY this user
  const myRides = bookings.filter(b => b.userEmail === user?.email || b.userName === user?.name || b.user === user?._id);

  const openChat = (booking) => {
    setSelectedBooking(booking);
    setIsChatOpen(true);
  };

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 max-w-7xl min-h-[70vh] mx-auto pb-32 bg-white'>
      <div className='flex flex-col md:flex-row justify-between items-end gap-6 mb-16'>
        <Title title='My Rentals' subTitle='Track your luxury car bookings and history' align="left"/>
        <div className='flex items-center gap-4 bg-gray-50 p-4 rounded-3xl border border-gray-100'>
            <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center'>
                <img src={assets.tick_icon} className='w-4 h-4 text-primary' alt="" />
            </div>
            <div>
                <p className='text-[10px] text-gray-400 font-black uppercase tracking-widest'>Total Activity</p>
                <p className='text-lg font-black text-gray-800'>{myRides.length} Bookings</p>
            </div>
        </div>
      </div>

      <div className='space-y-8'>
        {myRides.length > 0 ? myRides.map((booking, index) => (
          <div key={booking._id || index} className='group grid grid-cols-1 lg:grid-cols-12 gap-0 border border-gray-100 rounded-[3rem] bg-white hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-700 overflow-hidden'>
            
            {/* Car Image Section */}
            <div className='lg:col-span-3 relative overflow-hidden h-64 lg:h-auto'>
                <img src={booking.image || assets.hero_img} alt="" className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000' />
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60'></div>
                <div className='absolute bottom-6 left-6'>
                    <p className='text-white font-black text-2xl tracking-tighter ml-1 uppercase'>{booking.carName}</p>
                </div>
            </div>

            {/* Main Info Section */}
            <div className='lg:col-span-6 p-10 flex flex-col justify-between'>
              <div className='flex flex-wrap items-center gap-3 mb-8'>
                <span className='px-5 py-2 bg-gray-900 text-white text-[10px] font-black rounded-full uppercase tracking-widest'>
                    Booking #{booking._id.slice(-6)}
                </span>
                <span className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-full border ${
                    booking.status === 'confirmed' ? 'bg-green-50 border-green-100 text-green-600' : 
                    booking.status === 'cancelled' ? 'bg-red-50 border-red-100 text-red-600' :
                    'bg-orange-50 border-orange-100 text-orange-600 shadow-sm'
                }`}>
                    {booking.status}
                </span>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                  <div className='flex items-start gap-4'>
                    <div className='w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100'>
                        <img src={assets.location_icon} alt="" className='w-5 h-5 opacity-40' />
                    </div>
                    <div>
                        <p className='text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1'>Destination</p>
                        <p className='text-base font-black text-gray-800'>{booking.location || 'Visakhapatnam'}</p>
                    </div>
                  </div>

                  <div className='flex items-start gap-4'>
                    <div className='w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100'>
                        <img src={assets.calendar_icon} alt="" className='w-5 h-5 opacity-40' />
                    </div>
                    <div>
                        <p className='text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1'>Rental Period</p>
                        <p className='text-sm font-bold text-gray-700'>
                            {new Date(booking.pickupDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} • {new Date(booking.returnDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </p>
                        <p className='text-[10px] text-primary font-black uppercase mt-1'>{booking.numDays} Days Rental</p>
                    </div>
                  </div>
              </div>
            </div>

            {/* Payment & Actions Section */}
            <div className='lg:col-span-3 p-10 bg-gray-50/50 border-l border-gray-100 flex flex-col justify-between items-center lg:items-end text-center lg:text-right'>
                <div>
                   <p className='text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2'>Total Payment</p>
                   <p className='text-4xl font-black text-gray-900 tracking-tighter'>{currency}{booking.totalPrice}</p>
                   <p className='text-[10px] text-green-600 font-bold mt-2 uppercase tracking-widest flex items-center justify-center lg:justify-end gap-1'>
                       <span className='w-1.5 h-1.5 bg-green-500 rounded-full'></span>
                       Secure Transaction
                   </p>
                </div>

                <div className='flex flex-col gap-3 w-full mt-10'>
                    <button className='w-full py-4 bg-white border-2 border-gray-200 hover:border-primary/30 hover:bg-white text-gray-800 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-sm hover:shadow-md'>
                        View Invoice
                    </button>
                    <button 
                        onClick={() => openChat(booking)}
                        className='w-full py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-primary/20 hover:shadow-primary/40'
                    >
                        Contact Owner
                    </button>
                </div>
            </div>
          </div>
        )) : (
          <div className='text-center py-40 border-2 border-dashed border-gray-100 rounded-[4rem] bg-gray-50/30'>
            <div className='w-24 h-24 bg-white rounded-3xl shadow-xl border border-gray-50 flex items-center justify-center mx-auto mb-8 animate-bounce transition-all duration-1000'>
                <img src={assets.listIconColored} alt="" className='w-10 h-10 opacity-10' />
            </div>
            <h1 className='text-4xl font-black text-gray-900 tracking-tighter'>No Active Rentals</h1>
            <p className='text-gray-400 mt-4 font-bold uppercase text-sm tracking-widest'>Your journey starts with a single booking.</p>
            <button 
                onClick={() => window.location.href='/rides'}
                className='mt-12 px-12 py-5 bg-primary text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all transform active:scale-95'
            >
                Explore Luxury Fleet
            </button>
          </div>
        )}
      </div>

      <ChatModal 
         isOpen={isChatOpen} 
         onClose={() => setIsChatOpen(false)} 
         context={selectedBooking} 
      />
    </div>
  )
}

export default MyBookings
