import React, { useContext, useState } from 'react'
import Title from '../../components/owner/Title'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const ManageBookings = () => {
  const { bookings, updateBookingStatus, currency, user } = useContext(AppContext);
  const [selectedIdentity, setSelectedIdentity] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Filter bookings for the current owner's cars
  const myRiderBookings = bookings.filter(booking => booking.ownerId === user?._id || booking.ownerId === user?.email);

  const closeModal = () => {
    setIsVerifying(false);
    setIsSuccess(false);
    setSelectedIdentity(null);
  }

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsSuccess(true);
      updateBookingStatus(selectedIdentity._id, 'confirmed');
      setTimeout(() => {
        closeModal();
      }, 2000);
    }, 1500);
  }

  const handleReject = () => {
    updateBookingStatus(selectedIdentity._id, 'cancelled');
    closeModal();
  }

  return (
    <div className='px-4 pt-10 md:px-10 w-full bg-white min-h-screen'>
      <Title title="Manage Rental Bookings" subTitle="View and confirm rental requests for your cars." />
      
      <div className='max-w-6xl w-full rounded-2xl overflow-hidden border border-bordercolor mt-8 bg-white shadow-sm overflow-x-auto'>
        <table className='w-full border-collapse text-left text-sm text-gray-600 min-w-[900px]'>
          <thead className='bg-light text-gray-400 uppercase text-[10px] font-bold tracking-widest'>
            <tr>
              <th className='p-5'>Renter</th>
              <th className='p-5'>Car / Location</th>
              <th className='p-5'>Duration</th>
              <th className='p-5'>Earned</th>
              <th className='p-5'>Status</th>
              <th className='p-5 text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {myRiderBookings.length > 0 ? myRiderBookings.map((booking, index) => (
              <tr key={booking._id || index} className='border-t border-bordercolor hover:bg-gray-50 transition-colors'>
                <td className='p-5'>
                  <div className='flex items-center gap-3'>
                    <img src={assets.user_profile} alt="" className='w-10 h-10 rounded-full border-2 border-primary/10 p-0.5' />
                    <div>
                        <p className='font-bold text-gray-800'>{booking.userName || "Renter"}</p>
                        <p className='text-[10px] text-gray-400 font-medium uppercase tracking-tighter'>{booking.userEmail}</p>
                    </div>
                  </div>
                </td>
                <td className='p-5'>
                  <div>
                    <p className='font-bold text-gray-800'>{booking.carName}</p>
                    <div className='flex items-center gap-1 mt-1 font-bold text-[10px] text-primary uppercase tracking-widest'>
                        <span>{booking.location || "Visakhapatnam"}</span>
                    </div>
                  </div>
                </td>
                <td className='p-5'>
                  <span className='px-3 py-1 bg-primary/5 text-primary rounded-lg font-black text-xs border border-primary/10'>
                    {booking.numDays || booking.numSeats} Days
                  </span>
                </td>
                <td className='p-5 font-black text-gray-800'>
                  {currency}{booking.totalPrice}
                </td>
                <td className='p-5'>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-black border ${
                    booking.status === 'confirmed' ? 'border-green-200 text-green-600 bg-green-50' : 
                    booking.status === 'cancelled' ? 'border-red-200 text-red-600 bg-red-50' : 
                    'border-orange-200 text-orange-600 bg-orange-50'
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className='p-5'>
                  <div className='flex items-center justify-center gap-3'>
                    <button 
                      onClick={() => setSelectedIdentity(booking)} 
                      className='p-2 hover:bg-blue-50 rounded-xl text-blue-600 transition-all group'
                      title='View Identity Proof'
                    >
                      <img src={assets.eye_icon || assets.search_icon} alt="View Identity" className='w-4 h-4 opacity-70 group-hover:opacity-100'/>
                    </button>
                    {booking.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                          className='p-2 hover:bg-green-50 rounded-xl text-green-600 transition-all group'
                          title="Confirm Booking"
                        >
                          <img src={assets.tick_icon} alt="Confirm" className='w-4 h-4' />
                        </button>
                        <button 
                          onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                          className='p-2 hover:bg-red-50 rounded-xl text-red-600 transition-all group'
                          title="Reject Request"
                        >
                          <img src={assets.close_icon} alt="Cancel" className='w-4 h-4' />
                        </button>
                      </>
                    )}
                    {booking.status !== 'pending' && <span className='text-gray-300 font-bold'>---</span>}
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className='p-20 text-center text-gray-400 italic text-sm'>
                  No rental requests for your cars yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedIdentity && (
        <div className='fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] px-4 animate-fade-in'>
          <div className='bg-white rounded-[2.5rem] max-w-md w-full shadow-2xl overflow-hidden p-10 relative'>
            <button onClick={closeModal} className='absolute top-8 right-8 p-3 rounded-full hover:bg-gray-100 transition-colors'>
              <img src={assets.close_icon} alt="Close" className='w-4 h-4 opacity-50' />
            </button>
            <h2 className='text-3xl font-black text-gray-900 tracking-tight mb-2'>Identity Proof</h2>
            <p className='text-gray-500 font-medium mb-8 text-sm leading-relaxed'>Review the renter's Aadhaar details carefully before confirming the booking.</p>
            
            {isSuccess ? (
              <div className='text-center py-10 animate-scale-up'>
                <div className='w-28 h-28 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-200'>
                  <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h3 className='text-3xl font-black text-gray-900 tracking-tighter'>Verified!</h3>
                <p className='text-gray-500 font-medium text-base mt-2'>The booking is now confirmed.</p>
              </div>
            ) : isVerifying ? (
              <div className='text-center py-12 flex flex-col items-center justify-center space-y-6'>
                <div className='relative w-20 h-20'>
                  <div className='absolute inset-0 border-[5px] border-gray-100 rounded-full'></div>
                  <div className='absolute inset-0 border-[5px] border-primary border-t-transparent rounded-full animate-spin'></div>
                </div>
                <div className='space-y-2'>
                  <p className='text-xl font-black text-gray-900 tracking-tight'>VERIFYING DOCS...</p>
                  <p className='text-gray-400 font-bold text-[10px] uppercase tracking-widest'>Checking Aadhaar Credentials</p>
                </div>
              </div>
            ) : (
              <div className='space-y-6'>
                <div>
                  <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Aadhaar Number</label>
                  <div className='font-black text-2xl tracking-[0.1em] text-gray-800 bg-gray-50/50 p-5 rounded-2xl border border-gray-100 mt-2 text-center'>
                    {selectedIdentity.aadhaarNumber || "Not Provided"}
                  </div>
                </div>
                <div>
                  <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block'>Document Photo</label>
                  {selectedIdentity.aadhaarImage ? (
                    <img src={selectedIdentity.aadhaarImage} alt="Identity Proof" className='w-full h-auto max-h-56 object-cover rounded-2xl border border-gray-200 shadow-sm' />
                  ) : (
                    <div className='w-full h-32 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col items-center justify-center text-gray-400 text-sm font-bold shadow-sm'>
                      <img src={assets.cautionIconColored || assets.close_icon} className='w-6 h-6 mb-2 opacity-50 grayscale' alt="" />
                      No Image Uploaded
                    </div>
                  )}
                </div>
                
                <div className='flex gap-4 mt-8 pt-4 border-t border-gray-50'>
                  {selectedIdentity.status === 'pending' ? (
                    <>
                      <button onClick={handleReject} className='flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-black text-sm py-4 rounded-[1.5rem] transition-colors'>
                        Reject Doc
                      </button>
                      <button onClick={handleVerify} className='flex-1 bg-green-500 hover:bg-green-600 text-white font-black text-sm py-4 rounded-[1.5rem] transition-colors shadow-xl shadow-green-500/20'>
                        Verify & Accept
                      </button>
                    </>
                  ) : (
                    <button onClick={closeModal} className='w-full bg-gray-900 hover:bg-black text-white font-black text-sm py-4 rounded-[1.5rem] transition-colors shadow-xl'>
                      Done Reviewing
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageBookings
