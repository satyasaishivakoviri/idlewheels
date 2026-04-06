import React, {useContext} from 'react'
import { assets } from '../../assets/assets'
import Title from '../../components/owner/Title'
import { AppContext } from '../../context/AppContext'

const Dashboard = () => {
  const { rides, bookings, currency, user } = useContext(AppContext);

  // Filter cars and bookings for the current owner
  const myRides = rides.filter(ride => ride.ownerId === user?._id || ride.ownerId === user?.email);
  const myBookings = bookings.filter(booking => booking.ownerId === user?._id || booking.ownerId === user?.email);

  const stats = {
    totalCars: myRides.length,
    totalBookings: myBookings.length,
    pending: myBookings.filter(b => b.status === 'pending').length,
    confirmed: myBookings.filter(b => b.status === 'confirmed').length,
    revenue: myBookings.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0),
    recent: myBookings.slice(0, 5)
  }

  const dashboardCards = [
    {title: "Total Cars", value: stats.totalCars, icon: assets.carIconColored},
    {title: "Current Bookings", value: stats.totalBookings, icon: assets.listIconColored},
    {title: "Pending Approval", value: stats.pending, icon: assets.cautionIconColored},
    {title: "Confirmed Bookings", value: stats.confirmed, icon: assets.listIconColored},
  ]

  return (
    <div className='px-6 pt-12 md:px-12 flex-1 bg-[#FAFAFB] min-h-screen pb-24'>
      <div className='flex flex-col md:flex-row justify-between items-end gap-6 mb-12'>
        <Title 
            title={`${user?.name || "Owner"}'s Analytics`} 
            subTitle={`Welcome back, ${user?.name?.split(' ')[0] || "Owner"}. Your fleet is performing optimally today.`}
        />
        <div className='bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4'>
            <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
            <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]'>Market Status: Active</p>
        </div>
      </div>

      <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12'>
          {dashboardCards.map((card, index) => (
            <div key={index} className='group bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] transition-all duration-700 hover:-translate-y-2'>
              <div className='flex items-center justify-between mb-6'>
                <div className='w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-primary transition-colors'>
                    <img src={card.icon} alt="" className='w-6 h-6 group-hover:brightness-0 group-hover:invert transition-all'/>
                </div>
                <div className='text-[10px] font-black text-primary bg-primary/5 px-3 py-1 rounded-full uppercase tracking-widest'>+12%</div>
              </div>
              <h1 className='text-[10px] text-gray-400 uppercase font-black tracking-[0.2em] mb-1'>{card.title}</h1>
              <p className='text-4xl font-black text-gray-900 tracking-tighter'>{card.value}</p>
            </div>
          ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'>
        <div className='lg:col-span-8 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm'>
          <div className='flex justify-between items-center mb-10'>
              <div>
                <h1 className='text-2xl font-black text-gray-900 tracking-tight'>Recent Fleet Activity</h1>
                <p className='text-sm text-gray-400 font-bold uppercase tracking-widest mt-1'>Real-time rental updates</p>
              </div>
              <button className='text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:opacity-70 transition-opacity'>View All Activity</button>
          </div>
          
          <div className='space-y-4'>
            {stats.recent.length > 0 ? stats.recent.map((booking, index) => (
              <div key={booking._id || index} className='group flex items-center justify-between p-6 border border-gray-50 rounded-[2rem] hover:bg-gray-50/50 hover:border-primary/10 transition-all duration-500'>
                <div className='flex items-center gap-6'>
                  <div className='w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 group-hover:border-primary/20'>
                    <img src={assets.car_icon || assets.listIconColored} alt="" className='w-6 opacity-40 group-hover:opacity-100 transition-opacity' />
                  </div>
                  <div>
                    <p className='font-black text-gray-900 text-lg tracking-tight'>{booking.carName}</p>
                    <div className='flex items-center gap-2 mt-1'>
                        <span className='w-1 h-1 bg-gray-300 rounded-full'></span>
                        <p className='text-[10px] text-gray-400 font-black uppercase tracking-widest'>{booking.location || 'Visakhapatnam'}</p>
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-8'>
                  <div className='text-right'>
                    <p className='text-xl font-black text-gray-900 tracking-tighter'>{currency}{booking.totalPrice}</p>
                    <p className='text-[10px] text-primary font-black uppercase tracking-widest'>{booking.numDays || booking.numSeats} Days</p>
                  </div>
                  <span className={`px-5 py-2 text-[10px] uppercase font-black rounded-full border shadow-sm ${
                    booking.status === 'confirmed' ? 'border-green-100 text-green-600 bg-green-50' : 
                    booking.status === 'cancelled' ? 'border-red-100 text-red-600 bg-red-50' : 
                    'border-orange-100 text-orange-600 bg-orange-50'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            )) : (
              <div className='py-24 border-2 border-dashed border-gray-100 rounded-[2.5rem] text-center'>
                 <div className='w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 opacity-20'>
                    <img src={assets.listIconColored} alt="" className='w-8' />
                 </div>
                 <p className='text-gray-400 font-bold uppercase text-xs tracking-widest'>No recent fleet activity</p>
              </div>
            )}
          </div>
        </div>

        <div className='lg:col-span-4 space-y-8'>
            <div className='p-12 bg-gray-900 rounded-[3rem] text-white relative overflow-hidden shadow-2xl shadow-gray-900/20'>
              <div className='absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-[80px] rounded-full'></div>
              <h1 className='text-lg font-black tracking-tight mb-2 opacity-60 uppercase'>Total Earnings</h1>
              <div className='flex items-baseline gap-2'>
                <p className='text-5xl font-black tracking-tighter'>{currency}{stats.revenue.toLocaleString()}</p>
              </div>
              
              {/* Visual Performance Indicator (SVG) */}
              <div className='mt-10 h-24 w-full flex items-end gap-2'>
                  {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                      <div key={i} className='flex-1 bg-white/10 rounded-full group relative cursor-pointer hover:bg-primary transition-colors' style={{height: `${h}%`}}>
                          <div className='absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-gray-900 text-[10px] font-black px-2 py-1 rounded hidden group-hover:block'>
                              Day {i+1}
                          </div>
                      </div>
                  ))}
              </div>

              <div className='mt-8 pt-8 border-t border-white/10 flex items-center gap-3'>
                <div className='w-2 h-2 rounded-full bg-green-500 animate-pulse'></div>
                <span className='text-[10px] font-black uppercase tracking-[0.2em] opacity-60'>Live tracking enabled</span>
              </div>
            </div>

            <div className='p-10 bg-white rounded-[3rem] border border-gray-100 shadow-sm'>
                <h3 className='text-lg font-black text-gray-900 tracking-tight mb-6'>Fleet Insights</h3>
                <div className='space-y-6'>
                    <div className='flex items-center justify-between'>
                        <span className='text-sm text-gray-500 font-bold'>Utilization Rate</span>
                        <span className='text-sm font-black text-gray-900'>84%</span>
                    </div>
                    <div className='w-full h-2 bg-gray-50 rounded-full overflow-hidden'>
                        <div className='h-full bg-primary w-[84%] rounded-full'></div>
                    </div>
                    <div className='flex items-center justify-between pt-4'>
                        <span className='text-sm text-gray-500 font-bold'>Active Vehicles</span>
                        <span className='text-sm font-black text-gray-900'>{stats.totalCars} Cars</span>
                    </div>
                    <div className='w-full h-2 bg-gray-50 rounded-full overflow-hidden'>
                        <div className='h-full bg-gray-900 w-[100%] rounded-full'></div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
