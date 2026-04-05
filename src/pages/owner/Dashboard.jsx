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
    <div className='px-4 pt-10 md:px-10 flex-1 bg-white min-h-screen'>
      <Title 
        title={`${user?.name || "Owner"}'s Dashboard`} 
        subTitle={`Welcome back, ${user?.name?.split(' ')[0] || "Owner"}. Track your earnings and manage your fleet.`}
      />
      <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8 max-w-5xl'>
          {dashboardCards.map((card, index) => (
            <div key={index} className='flex gap-2 items-center justify-between p-5 rounded-2xl border border-bordercolor bg-white shadow-sm hover:shadow-md transition-shadow'>
              <div>
                <h1 className='text-[10px] text-gray-400 uppercase font-bold tracking-widest'>{card.title}</h1>
                <p className='text-3xl font-black text-gray-800 mt-1'>{card.value}</p>
              </div>
              <div className='flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/5 border border-primary/10'>
                <img src={card.icon} alt="" className='w-6 h-6'/>
              </div>
            </div>
          ))}
      </div>

      <div className='flex flex-wrap items-start gap-6 mb-8 w-full'>
        <div className='p-6 md:p-8 border border-bordercolor rounded-3xl max-w-2xl w-full bg-white shadow-sm'>
          <h1 className='text-xl font-black text-gray-800'>Recent Activity</h1>
          <p className='text-sm text-gray-400 font-medium'>Latest bookings for your car fleet</p>
          <div className='mt-8 space-y-6'>
            {stats.recent.length > 0 ? stats.recent.map((booking, index) => (
              <div key={booking._id || index} className='flex items-center justify-between p-4 border border-bordercolor/30 rounded-2xl hover:bg-gray-50 transition-colors'>
                <div className='flex items-center gap-4'>
                  <div className='hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-primary/5 text-primary'>
                    <img src={assets.listIconColored} alt="" className='w-5 h-5' />
                  </div>
                  <div>
                    <p className='font-bold text-gray-800'>{booking.carName}</p>
                    <p className='text-[10px] text-gray-400 font-bold uppercase tracking-widest'>{booking.location || 'Visakhapatnam'}</p>
                  </div>
                </div>
                <div className='flex items-center gap-6'>
                  <div className='text-right'>
                    <p className='font-black text-primary'>{currency}{booking.totalPrice}</p>
                    <p className='text-[10px] text-gray-400 font-bold'>{booking.numDays || booking.numSeats} Days</p>
                  </div>
                  <span className={`px-3 py-1 text-[10px] uppercase font-black rounded-full border ${
                    booking.status === 'confirmed' ? 'border-green-200 text-green-600 bg-green-50' : 
                    booking.status === 'cancelled' ? 'border-red-200 text-red-600 bg-red-50' : 
                    'border-orange-200 text-orange-600 bg-orange-50'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            )) : (
              <div className='p-10 border border-dashed border-bordercolor rounded-2xl text-center'>
                <p className='text-gray-400 italic text-sm'>No recent activity on your fleet.</p>
              </div>
            )}
          </div>
        </div>

        <div className='p-8 border border-bordercolor rounded-3xl w-full md:max-w-xs bg-white shadow-sm'>
          <h1 className='text-xl font-black text-gray-800'>Total Earnings</h1>
          <p className='text-sm text-gray-400 font-medium'>Net revenue from your rentals</p>
          <div className='mt-10'>
            <p className='text-5xl font-black text-primary tracking-tighter'>{currency}{stats.revenue.toLocaleString()}</p>
            <div className='mt-4 flex items-center gap-2 text-green-600 text-xs font-bold uppercase tracking-widest'>
              <div className='w-2 h-2 rounded-full bg-green-500 animate-pulse'></div>
              <span>Live tracking enabled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
