import React, {useEffect, useState, useContext} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets';
import Loader from '../components/Loader';
import { AppContext } from '../context/AppContext';
import { validateAadhaar } from '../utils/validation';
import { useToast } from '../context/ToastContext';

const RideDetails = ({ setShowLogin }) => {
  
  const {id}= useParams();
  const navigate = useNavigate();
  const { rides, addBooking, currency, user } = useContext(AppContext);
  const { showToast } = useToast();

  const [ride, setRide] = useState(null);
  
  const getToday = () => new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(getToday());
  const [endDate, setEndDate] = useState(getToday());
  const [numDays, setNumDays] = useState(1);

  // Sync dates with numDays if dates change directly via picker
  useEffect(() => {
    if (startDate && endDate) {
      if (new Date(endDate) < new Date(startDate)) {
        setEndDate(startDate);
      } else {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setNumDays(diffDays + 1);
      }
    }
  }, [startDate, endDate]);

  const handleDurationChange = (delta) => {
    const newDays = Math.max(1, numDays + delta);
    if (newDays > 30) {
      showToast("Maximum rental duration is 30 days!", "error");
      return;
    }
    setNumDays(newDays);
    if (startDate) {
      const start = new Date(startDate);
      start.setDate(start.getDate() + newDays - 1);
      setEndDate(start.toISOString().split('T')[0]);
    }
  };
  
  // Verification States
  const [showAadhaarModal, setShowAadhaarModal] = useState(false);
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [aadhaarImage, setAadhaarImage] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [aadhaarError, setAadhaarError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Auth Guard
    if (!user) {
      showToast("Authentication Required! Please login to book your seat.", "error");
      setShowLogin(true);
      return;
    }

    if (numDays > 30) {
        showToast("Maximum rental duration is 30 days!", "error");
        return;
    }

    setShowAadhaarModal(true);
  }

  const handleConfirmBooking = async () => {
    if (!validateAadhaar(aadhaarNumber)) {
      setAadhaarError("Please enter a valid 12-digit Aadhaar number.");
      return;
    }
    if (!aadhaarImage) {
      setAadhaarError("Please upload a clear photo of your Aadhaar card.");
      return;
    }

    setAadhaarError("");
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      setIsSuccess(true);

      const totalPrice = ride.pricePerDay * numDays;

      const newBooking = {
        _id: Date.now().toString(),
        carId: ride._id,
        carName: ride.carName,
        location: ride.location,
        dateTime: new Date().toISOString(),
        pickupDate: startDate,
        returnDate: endDate,
        numDays: Number(numDays),
        totalPrice: totalPrice,
        ownerId: ride.ownerId,
        userName: user.name,
        userEmail: user.email,
        status: "pending",
        aadhaarNumber: aadhaarNumber,
        aadhaarImage: URL.createObjectURL(aadhaarImage),
        createdAt: new Date().toISOString(),
      };

      addBooking(newBooking);
      showToast("Rental Request Sent Successfully!", "success");

      setTimeout(() => {
        navigate('/my-bookings');
      }, 2000);

    }, 2000);
  }

  useEffect(() => {
    if (rides && id) {
      setRide(rides.find(r => r._id === id)); 
    }
  }, [id, rides]);

  return ride ? (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16 min-h-[85vh] bg-white'>
      <button className='flex items-center gap-2 mb-8 text-gray-400 hover:text-primary transition-all cursor-pointer group font-bold text-xs uppercase tracking-widest' onClick={() => navigate(-1)}>
        <img src={assets.arrow_icon} alt="" className='rotate-180 opacity-45 group-hover:opacity-100 transition-all w-4' />
        Back to listings
      </button>
      
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16'>
        <div className='lg:col-span-2'>
          <div className='relative group'>
            <img src={ride.image} alt="" className='w-full h-auto md:max-h-120 object-cover rounded-[2.5rem] mb-10 shadow-2xl transition-all duration-700' />
            <div className='absolute top-6 left-6 flex gap-3'>
                <span className='bg-white/90 backdrop-blur-md text-primary text-xs font-black px-5 py-2 rounded-full shadow-lg uppercase tracking-widest'>
                    {ride.brand} {ride.model}
                </span>
            </div>
          </div>

          <div className='space-y-10'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
              <div>
                <h1 className='text-4xl md:text-6xl font-black text-gray-900 tracking-tighter flex items-center gap-4'>
                    {ride.carName}
                </h1>
                <p className='text-primary text-xl mt-3 font-black uppercase tracking-[0.2em]'>
                    Available in {ride.location}
                </p>
              </div>
              <div className='flex items-center gap-2 bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100'>
                <img src={assets.star_icon} className='h-5 w-5' alt="" />
                <span className='font-black text-gray-800 text-lg'>4.9</span>
                <span className='text-gray-400 text-sm font-bold ml-1'>Verified Owner</span>
              </div>
            </div>

            <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
              {[
                { icon:assets.users_icon, text: `${ride.seatingCapacity} Seats`, label: 'Capacity' },
                { icon:assets.fuel_icon, text: ride.fuelType, label: 'Fuel Type' },
                { icon:assets.location_icon, text: ride.location, label: 'Location' },
                { icon:assets.car_icon, text: ride.transmission, label: 'Transmission' },
              ].map(({icon, text, label}) => (
                <div key={label} className='flex flex-col items-start bg-gray-50/50 border border-gray-100 p-6 rounded-[2rem] hover:bg-white hover:shadow-xl hover:border-primary/10 transition-all group'>
                  <div className='w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
                    <img src={icon} alt="" className='h-5'/>
                  </div>
                  <p className='text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1'>{label}</p>
                  <p className='text-sm font-black text-gray-800 truncate w-full'>{text}</p>
                </div>
              ))}
            </div>

            <div className='prose max-w-none'>
              <h2 className='text-3xl font-black text-gray-900 tracking-tight mb-4'>Description</h2>
              <p className='text-gray-500 leading-relaxed text-lg font-medium'>{ride.description}</p>
            </div>

            <div className='bg-primary/5 p-10 rounded-[3rem] border border-primary/10 relative overflow-hidden'>
              <div className='absolute -right-10 -bottom-10 opacity-5 pointer-events-none'>
                <img src={assets.logo} alt="" className='w-64' />
              </div>
              <h2 className='text-2xl font-black mb-6 text-gray-900 flex items-center gap-3'>
                Why IdleWheels?
              </h2>
              <ul className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                {[
                    "Direct Owner Access", 
                    "Lowest Price Guarantee", 
                    "Fully Insured Vehicles", 
                    "24/7 Roadside Assist", 
                    "Verified Identity", 
                    "No Hidden Charges"
                ].map((item) => (
                  <li key={item} className='flex items-center text-gray-700 font-bold text-sm uppercase tracking-wide'>
                    <div className='w-8 h-8 rounded-full bg-white flex items-center justify-center mr-4 shadow-sm'>
                      <img src={assets.tick_icon} className='h-3 w-3' alt="" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Booking Form Widget */}
        <div className='lg:relative'>
          <form onSubmit={handleSubmit} className='bg-white shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] border border-gray-100 h-max lg:sticky lg:top-24 rounded-[3rem] p-10 space-y-8'>
            <div className='flex items-baseline justify-between'>
              <p className='text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]'>Price per day</p>
              <div className='text-right'>
                <span className='text-5xl font-black text-gray-900 tracking-tighter'>{currency}{ride.pricePerDay}</span>
              </div>
            </div>

            <div className='space-y-6'>
              <div className='flex gap-4 w-full'>
                <div className='flex flex-col gap-3 flex-1'>
                  <label className='font-black text-gray-400 text-[10px] uppercase tracking-widest flex items-center gap-2'>
                    <div className='w-1.5 h-1.5 rounded-full bg-primary'></div>
                    PICKUP DATE
                  </label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} min={getToday()} className='bg-gray-50/50 p-3 rounded-2xl border border-gray-100 font-black text-gray-800 text-sm outline-none focus:border-primary focus:bg-white w-full transition-all' />
                </div>
                <div className='flex flex-col gap-3 flex-1'>
                  <label className='font-black text-gray-400 text-[10px] uppercase tracking-widest flex items-center gap-2'>
                    <div className='w-1.5 h-1.5 rounded-full bg-primary'></div>
                    RETURN DATE
                  </label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} min={startDate} className='bg-gray-50/50 p-3 rounded-2xl border border-gray-100 font-black text-gray-800 text-sm outline-none focus:border-primary focus:bg-white w-full transition-all' />
                </div>
              </div>

              <div className='flex flex-col gap-3 mt-6'>
                <label className='font-black text-gray-400 text-[10px] uppercase tracking-widest flex items-center gap-2'>
                  <div className='w-1.5 h-1.5 rounded-full bg-primary'></div>
                  RENTAL DURATION (DAYS)
                </label>
                <div className='flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-100'>
                    <button 
                        type="button" 
                        onClick={() => handleDurationChange(-1)}
                        className='w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center font-black text-xl hover:bg-primary hover:text-white transition-all cursor-pointer'
                    >-</button>
                    <span className='flex-1 text-center text-2xl font-black text-gray-800'>{numDays}</span>
                    <button 
                        type="button" 
                        onClick={() => handleDurationChange(+1)}
                        className='w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center font-black text-xl hover:bg-primary hover:text-white transition-all cursor-pointer'
                    >+</button>

                </div>
                <p className='text-[10px] text-center text-gray-400 font-bold'>Book now for immediate confirmation</p>
              </div>
            </div>

            <div className='pt-4 border-t border-gray-50 flex justify-between items-center'>
                <p className='text-sm font-bold text-gray-400 uppercase tracking-widest'>Total Amount</p>
                <p className='text-3xl font-black text-primary'>{currency}{ride.pricePerDay * numDays}</p>
            </div>

            <button className='w-full bg-primary hover:bg-primary-dull text-white py-6 rounded-[2rem] font-black text-xl shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all transform active:scale-95 cursor-pointer'>
              Reserve Now
            </button>
            
            <div className='flex items-center gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100'>
                <div className='w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0'>
                    <img src={assets.tick_icon} className='w-3 h-3 brightness-200' alt="" />
                </div>
                <p className='text-[10px] font-bold text-primary leading-snug'>
                    Safe, secure, and verified car rentals by <span className='font-black'>IdleWheels</span>.
                </p>
            </div>
          </form>
        </div>
      </div>

      {/* Aadhaar Verification Modal */}
      {showAadhaarModal && (
        <div className='fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] px-4 animate-fade-in'>
          <div className={`bg-white rounded-[3rem] max-w-lg w-full shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-500 ${isSuccess ? 'scale-105 border-4 border-green-500' : 'scale-100'}`}>
            
            {/* Modal Header */}
            <div className={`p-10 pb-6 flex justify-between items-start ${isVerifying ? 'opacity-50 pointer-events-none' : ''}`}>
              <div>
                <h2 className='text-4xl font-black text-gray-900 tracking-tighter'>Safety First</h2>
                <p className='text-gray-400 mt-2 font-bold uppercase text-[10px] tracking-widest'>Identity Verification required</p>
              </div>
              {!isSuccess && !isVerifying && (
                <button onClick={() => setShowAadhaarModal(false)} className='p-3 hover:bg-gray-100 rounded-2xl transition-colors'>
                  <img src={assets.close_icon} alt="Close" className='w-6 h-6 opacity-30' />
                </button>
              )}
            </div>

            {/* Modal Content */}
            <div className='p-10 pt-4 space-y-8'>
              
              {isSuccess ? (
                <div className='text-center py-12 animate-scale-up'>
                  <div className='w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-200'>
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <h3 className='text-4xl font-black text-gray-900 tracking-tighter'>Request Sent!</h3>
                  <p className='text-gray-500 font-medium text-lg mt-3'>The car owner will be notified. Redirecting...</p>
                </div>
              ) : isVerifying ? (
                <div className='text-center py-16 flex flex-col items-center justify-center space-y-8'>
                  <div className='relative w-24 h-24'>
                    <div className='absolute inset-0 border-[6px] border-gray-100 rounded-full'></div>
                    <div className='absolute inset-0 border-[6px] border-primary border-t-transparent rounded-full animate-spin'></div>
                  </div>
                  <div className='space-y-3'>
                    <p className='text-2xl font-black text-gray-900 tracking-tight'>SECURE UPLOAD...</p>
                    <p className='text-gray-400 font-bold text-xs uppercase tracking-widest'>Encrypting & Sending Documents</p>
                  </div>
                </div>
              ) : (
                <div className='space-y-8'>
                  <div className='space-y-3'>
                    <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1'>Enter Aadhaar Number</label>
                    <div className='relative'>
                      <input 
                        type="text" 
                        maxLength={12}
                        autoFocus
                        placeholder='0000 0000 0000' 
                        className={`w-full px-6 py-6 bg-gray-50/50 border-2 rounded-3xl outline-none text-2xl font-black tracking-[0.25em] transition-all text-gray-800 ${aadhaarError ? 'border-red-500 bg-red-50' : 'border-gray-100 focus:border-primary focus:bg-white'}`}
                        value={aadhaarNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          setAadhaarNumber(val);
                          if (aadhaarError) setAadhaarError("");
                        }}
                      />
                    </div>
                  </div>

                  <div className='space-y-3'>
                    <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1'>Upload Identity Proof</label>
                    <label className={`flex flex-col items-center justify-center w-full min-h-[160px] border-2 border-dashed rounded-3xl cursor-pointer transition-all ${aadhaarImage ? 'border-green-300 bg-green-50/30' : 'border-gray-200 hover:border-primary hover:bg-gray-50'}`}>
                      {aadhaarImage ? (
                        <div className='flex items-center gap-4 px-6 py-3 bg-white rounded-2xl shadow-xl border border-green-100'>
                          <img src={assets.tick_icon} className='h-5 w-5 brightness-50' alt="" />
                          <p className='text-sm font-black text-green-700 truncate max-w-[220px]'>{aadhaarImage.name}</p>
                        </div>
                      ) : (
                        <div className='text-center'>
                          <div className='w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-3'>
                            <img src={assets.upload_icon} alt="" className='w-6 h-6 opacity-30' />
                          </div>
                          <p className='text-sm font-black text-gray-800'>Choose File</p>
                          <p className='text-[10px] text-gray-400 font-bold uppercase mt-1'>Front face of Identity Card</p>
                        </div>
                      )}
                      <input type="file" className='hidden' accept='image/*,.pdf' onChange={(e) => setAadhaarImage(e.target.files[0])} />
                    </label>
                  </div>

                  {aadhaarError && (
                    <div className='flex items-center gap-3 text-red-600 bg-red-50 px-6 py-4 rounded-2xl border border-red-100 animate-shake'>
                      <div className='w-2 h-2 rounded-full bg-red-600 animate-pulse'></div>
                      <p className='text-xs font-black uppercase tracking-wide'>{aadhaarError}</p>
                    </div>
                  )}

                  <button 
                    onClick={handleConfirmBooking}
                    disabled={aadhaarNumber.length !== 12 || !aadhaarImage}
                    className={`w-full py-6 rounded-[2rem] font-black text-xl transition-all shadow-2xl ${
                      (aadhaarNumber.length === 12 && aadhaarImage) && !aadhaarError
                      ? 'bg-primary text-white shadow-primary/30 hover:shadow-primary/40' 
                      : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    Confirm My Identity
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
    </div>
  ) : <Loader />
}

export default RideDetails
