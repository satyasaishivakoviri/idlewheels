import React, { useContext, useState } from 'react'
import Title from '../../components/owner/Title'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import ChatModal from '../../components/ChatModal'

const ManageBookings = () => {
  const { bookings, updateBookingStatus, currency, user } = useContext(AppContext);
  const [selectedIdentity, setSelectedIdentity] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState(null);

  // Filter bookings for the current owner's cars
  const myRiderBookings = bookings.filter(booking => booking.ownerId === user?._id || booking.ownerId === user?.email);

  const closeModal = () => {
    setIsVerifying(false);
    setIsSuccess(false);
    setSelectedIdentity(null);
  }

  const openChat = (booking) => {
    setChatContext(booking);
    setIsChatOpen(true);
  };

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
    <div className='px-6 pt-12 md:px-12 w-full bg-[#FAFAFB] min-h-screen pb-32'>
      <div className='flex flex-col md:flex-row justify-between items-end gap-6 mb-16'>
        <Title title="Manage Fleet Requests" subTitle="Review and authorize upcoming rental requests for your premium vehicles." />
        <div className='bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4'>
            <div className='w-2 h-2 bg-primary rounded-full animate-pulse'></div>
            <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]'>{myRiderBookings.length} Active Requests</p>
        </div>
      </div>
      
      <div className='grid grid-cols-1 gap-6 max-w-7xl mx-auto'>
        {myRiderBookings.length > 0 ? myRiderBookings.map((booking, index) => (
          <div key={booking._id || index} className='group bg-white rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] transition-all duration-700 flex flex-col lg:flex-row overflow-hidden'>
            
            {/* Renter Information Section */}
            <div className='lg:w-1/3 p-10 bg-gray-50/50 border-r border-gray-100'>
                <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6'>Renter Information</p>
                <div className='flex items-center gap-6'>
                    <div className='relative group/profile'>
                        <img src={assets.user_profile} alt="" className='w-20 h-20 rounded-3xl border-4 border-white shadow-xl p-0.5 object-cover transition-transform group-hover/profile:scale-105 duration-500' />
                        <div className='absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg'>
                            <img src={assets.tick_icon} className='w-2.5 brightness-0 invert' alt="" />
                        </div>
                    </div>
                    <div>
                        <p className='text-2xl font-black text-gray-900 tracking-tighter leading-tight'>{booking.userName || "Elite Renter"}</p>
                        <p className='text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1'>{booking.userEmail}</p>
                        <div className='mt-4 flex items-center gap-2'>
                            <span className='px-3 py-1 bg-white border border-gray-100 rounded-full text-[8px] font-black text-primary uppercase tracking-[0.2em] shadow-sm'>Verified Member</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Experience Details Section */}
            <div className='lg:w-1/3 p-10 flex flex-col justify-between'>
                <div>
                     <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6'>Experience Details</p>
                     <p className='text-3xl font-black text-gray-900 tracking-tighter mb-2'>{booking.carName}</p>
                     <div className='flex items-center gap-3'>
                        <p className='px-4 py-1.5 bg-gray-900 text-white text-[10px] uppercase font-black tracking-widest rounded-full'>{booking.location || "Visakhapatnam"}</p>
                        <p className='text-[10px] font-black text-primary uppercase tracking-widest leading-loose'>{booking.numDays} Days Rental</p>
                     </div>
                </div>
                <div className='mt-10 flex items-center gap-4 text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]'>
                    <img src={assets.calendar_icon} className='w-4 opacity-30' alt="" />
                    <span>Starts {new Date(booking.pickupDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                </div>
            </div>

            {/* Status & Actions Section */}
            <div className='lg:w-1/3 p-10 bg-gray-50/10 border-l border-gray-100 flex flex-col justify-between items-end'>
                <div className='flex flex-col items-end gap-2'>
                    <span className={`px-6 py-2 rounded-full text-[10px] uppercase font-black shadow-sm border ${
                        booking.status === 'confirmed' ? 'border-green-100 text-green-600 bg-green-50' : 
                        booking.status === 'cancelled' ? 'border-red-100 text-red-600 bg-red-50' : 
                        'border-primary/10 text-primary bg-primary/5'
                    }`}>
                        {booking.status}
                    </span>
                    <p className='text-4xl font-black text-gray-900 tracking-tighter mt-2'>{currency}{booking.totalPrice}</p>
                </div>

                <div className='flex gap-3 w-full mt-10 justify-end'>
                    <button 
                         onClick={() => openChat(booking)}
                         className='p-4 bg-white border border-gray-100 hover:border-primary/30 rounded-2xl transition-all shadow-sm group flex items-center gap-2'
                         title="Message Renter"
                    >
                         <img src={assets.chatbot_icon || assets.search_icon} className='w-5 opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all' alt="" />
                         <span className='text-[10px] font-black uppercase text-gray-400 group-hover:text-primary transition-colors'>Chat</span>
                    </button>
                    <button 
                         onClick={() => setSelectedIdentity(booking)}
                         className='p-4 bg-white border border-gray-100 hover:border-primary/30 rounded-2xl transition-all shadow-sm group'
                         title="View Identity"
                    >
                         <img src={assets.search_icon} className='w-5 opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all' alt="" />
                    </button>
                    {booking.status === 'pending' && (
                        <>
                            <button 
                                onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                                className='px-8 py-4 bg-white border border-red-100 text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:bg-red-50 transition-colors'
                            >
                                Reject
                            </button>
                            <button 
                                onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                                className='px-8 py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all'
                            >
                                Confirm
                            </button>
                        </>
                    )}
                </div>
            </div>
          </div>
        )) : (
          <div className='py-40 border-2 border-dashed border-gray-100 rounded-[5rem] bg-white text-center'>
            <div className='w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-10 opacity-20'>
                <img src={assets.listIconColored} className='w-10' alt="" />
            </div>
            <h3 className='text-3xl font-black text-gray-900 tracking-tighter'>No Pending Fleet Requests</h3>
            <p className='text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-4'>Direct rental inquiries will appear here.</p>
          </div>
        )}
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
                    <div className='w-full h-32 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-gray-400 text-sm font-bold shadow-sm'>
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

      <ChatModal 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        context={chatContext}
      />
    </div>
  )
}

export default ManageBookings
