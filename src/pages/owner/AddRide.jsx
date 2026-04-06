import React, { useState, useContext } from 'react'
import Title from '../../components/owner/Title'
import { assets, cityList } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { useNavigate } from 'react-router-dom'

const AddRide = () => {
  const { addRide, currency, user } = useContext(AppContext);
  const navigate = useNavigate();
  const [mediaFiles, setMediaFiles] = useState([]);
  const [ride, setRide]=useState({
    carName:'',
    brand:'',
    model:'',
    location:'',
    fuelType:'Petrol',
    transmission:'Manual',
    seatingCapacity:'5',
    pricePerDay:'',
    description:'',
  })

  const onSubmitHandler = async (e)=>{
    e.preventDefault();
    
    const imageFiles = mediaFiles.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length < 4) {
      alert("Please upload a minimum of 4 photos for the car.");
      return;
    }

    // Create new car object
    const newRide = {
      ...ride,
      _id: Date.now().toString(),
      image: mediaFiles.length > 0 && mediaFiles[0].type.startsWith('image/') ? URL.createObjectURL(mediaFiles[0]) : "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=400",
      mediaContent: mediaFiles.map(file => URL.createObjectURL(file)),
      seatingCapacity: Number(ride.seatingCapacity),
      pricePerDay: Number(ride.pricePerDay),
      ownerId: user?._id || user?.email || "anonymous",
      ownerName: user?.name || "Owner",
      status: "active",
      isAvailable: true,
      createdAt: new Date().toISOString(),
    };

    addRide(newRide);
    alert("Car listed successfully!");
    navigate('/owner/manage-rides');
  }

  return (
    <div className='px-6 pt-12 md:px-12 flex-1 bg-[#FAFAFB] min-h-screen pb-32'>
      <div className='flex flex-col md:flex-row justify-between items-end gap-6 mb-16'>
        <Title title="Fleet Expansion" subTitle="List your premium vehicle on IdleWheels and join our elite network of owners." />
        <div className='bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4'>
            <div className='w-2 h-2 bg-primary rounded-full animate-pulse'></div>
            <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]'>Owner Identity verified</p>
        </div>
      </div>

      <form onSubmit={onSubmitHandler} className='max-w-4xl mx-auto space-y-10'>
        
        {/* Section 1: Visual Identity */}
        <div className='bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm'>
          <div className='flex items-center gap-4 mb-8'>
              <div className='w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-primary font-black'>01</div>
              <h2 className='text-2xl font-black text-gray-900 tracking-tight'>Visual Identity</h2>
          </div>
          
          <div className='flex flex-col gap-6 w-full p-8 bg-gray-50/50 border border-gray-100 rounded-[2.5rem]'>
            <div className='flex flex-col md:flex-row items-center gap-8'>
              <label htmlFor="car-media" className='shrink-0 group'>
                <div className='h-32 w-32 bg-white border-4 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer group-hover:border-primary group-hover:bg-primary/5 transition-all duration-500'>
                  <img src={assets.upload_icon} alt="" className='h-8 w-8 opacity-20 group-hover:opacity-100 transition-opacity' />
                  <span className='text-[8px] font-black tracking-[0.3em] text-gray-400 mt-2 uppercase group-hover:text-primary transition-colors'>Upload Files</span>
                </div>
                <input type="file" id='car-media' accept='image/*,video/*' multiple hidden onChange={(e) => {
                  const files = Array.from(e.target.files);
                  setMediaFiles(prev => [...prev, ...files]);
                }}/>
              </label>
              <div>
                <p className='font-black text-gray-900 text-lg'>Car Media (Photos & Videos)</p>
                <p className='text-sm text-gray-500 font-medium leading-relaxed max-w-lg mt-1'>Upload high-resolution images and a 360-degree demo video to showcase your car's true potential to elite renters.</p>
              </div>
            </div>
            
            {mediaFiles.length > 0 && (
              <div className='flex gap-4 overflow-x-auto pb-6 mt-4 max-w-full custom-scrollbar'>
                {mediaFiles.map((file, index) => (
                  <div key={index} className='relative shrink-0 group rounded-[2rem] overflow-hidden shadow-lg border-4 border-white'>
                    {file.type.startsWith('video/') ? (
                      <video src={URL.createObjectURL(file)} className='h-40 w-60 object-cover' muted></video>
                    ) : (
                      <img src={URL.createObjectURL(file)} alt="" className='h-40 w-60 object-cover' />
                    )}
                    <div className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm'>
                      <button type="button" onClick={() => setMediaFiles(prev => prev.filter((_, i) => i !== index))} className='bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center cursor-pointer shadow-2xl hover:scale-110 active:scale-95 transition-all'>
                         <img src={assets.close_icon} alt="Delete" className='w-4 h-4 invert brightness-200' />
                      </button>
                    </div>
                    {file.type.startsWith('video/') && (
                      <div className='absolute bottom-4 right-4 bg-gray-900/80 text-white text-[8px] uppercase tracking-[0.3em] font-black px-3 py-1.5 rounded-full backdrop-blur-md'>
                        360 Demo
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Basic Information */}
        <div className='bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm'>
            <div className='flex items-center gap-4 mb-10'>
                <div className='w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-primary font-black'>02</div>
                <h2 className='text-2xl font-black text-gray-900 tracking-tight'>Basic Information</h2>
            </div>
            <div className='space-y-8'>
                <div className='flex flex-col w-full'>
                    <label className='font-black text-[10px] uppercase tracking-[0.2em] text-primary mb-3'>Vehicle Display Name</label>
                    <input type="text" placeholder='e.g. Premium Maruti Swift 2023...' required className='px-6 py-4 bg-gray-50 border border-transparent rounded-[1.5rem] outline-none focus:bg-white focus:border-primary/20 transition-all duration-500 text-gray-900 font-bold placeholder:opacity-30' value={ride.carName} onChange={e=> setRide({...ride, carName: e.target.value})}/>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                    <div className='flex flex-col w-full'>
                        <label className='font-black text-[10px] uppercase tracking-[0.2em] text-primary mb-3'>Brand</label>
                        <input type="text" placeholder='e.g. Maruti, Toyota...' required className='px-6 py-4 bg-gray-50 border border-transparent rounded-[1.5rem] outline-none focus:bg-white focus:border-primary/20 transition-all duration-500 text-gray-900 font-bold placeholder:opacity-30' value={ride.brand} onChange={e=> setRide({...ride, brand: e.target.value})}/>
                    </div>
                    <div className='flex flex-col w-full'>
                        <label className='font-black text-[10px] uppercase tracking-[0.2em] text-primary mb-3'>Model</label>
                        <input type="text" placeholder='e.g. Swift, Fortuner...' required className='px-6 py-4 bg-gray-50 border border-transparent rounded-[1.5rem] outline-none focus:bg-white focus:border-primary/20 transition-all duration-500 text-gray-900 font-bold placeholder:opacity-30' value={ride.model} onChange={e=> setRide({...ride, model: e.target.value})}/>
                    </div>
                </div>
            </div>
        </div>

        {/* Section 3: Vehicle Specifications */}
        <div className='bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm'>
            <div className='flex items-center gap-4 mb-10'>
                <div className='w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-primary font-black'>03</div>
                <h2 className='text-2xl font-black text-gray-900 tracking-tight'>Vehicle Specifications</h2>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <div className='flex flex-col w-full'>
                    <label className='font-black text-[10px] uppercase tracking-[0.2em] text-primary mb-3'>Location (City)</label>
                    <select required className='px-6 py-4 bg-gray-50 border border-transparent rounded-[1.5rem] outline-none focus:bg-white focus:border-primary/20 transition-all duration-500 text-gray-900 font-bold appearance-none' value={ride.location} onChange={e=> setRide({...ride, location: e.target.value})}>
                        <option value="">Select Region</option>
                        {cityList.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                </div>
                <div className='flex flex-col w-full'>
                    <label className='font-black text-[10px] uppercase tracking-[0.2em] text-primary mb-3'>Fuel Engine Type</label>
                    <select required className='px-6 py-4 bg-gray-50 border border-transparent rounded-[1.5rem] outline-none focus:bg-white focus:border-primary/20 transition-all duration-500 text-gray-900 font-bold' value={ride.fuelType} onChange={e=> setRide({...ride, fuelType: e.target.value})}>
                        <option value="Petrol">Petrol Synergy</option>
                        <option value="Diesel">Diesel Power</option>
                        <option value="Electric">Electric Core</option>
                        <option value="CNG">Compressed Gas</option>
                    </select>
                </div>
                <div className='flex flex-col w-full'>
                    <label className='font-black text-[10px] uppercase tracking-[0.2em] text-primary mb-3'>Transmission</label>
                    <select required className='px-6 py-4 bg-gray-50 border border-transparent rounded-[1.5rem] outline-none focus:bg-white focus:border-primary/20 transition-all duration-500 text-gray-900 font-bold' value={ride.transmission} onChange={e=> setRide({...ride, transmission: e.target.value})}>
                        <option value="Manual">Manual Drive</option>
                        <option value="Automatic">Full Automatic</option>
                    </select>
                </div>
                <div className='flex flex-col w-full'>
                    <label className='font-black text-[10px] uppercase tracking-[0.2em] text-primary mb-3'>Cabin Capacity</label>
                    <input type="number" placeholder="5" required className='px-6 py-4 bg-gray-50 border border-transparent rounded-[1.5rem] outline-none focus:bg-white focus:border-primary/20 transition-all duration-500 text-gray-900 font-bold' value={ride.seatingCapacity} onChange={e=> setRide({...ride, seatingCapacity: e.target.value})} min="1" max="10" />
                </div>
            </div>
        </div>

        {/* Section 4: Pricing & Terms */}
        <div className='bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm'>
            <div className='flex items-center gap-4 mb-10'>
                <div className='w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-primary font-black'>04</div>
                <h2 className='text-2xl font-black text-gray-900 tracking-tight'>Pricing & Excellence</h2>
            </div>
            <div className='space-y-8'>
                <div className='flex flex-col w-full'>
                    <label className='font-black text-[10px] uppercase tracking-[0.2em] text-primary mb-3'>Premium Daily Rate ({currency})</label>
                    <input type="number" placeholder="1500" required className='px-8 py-6 bg-gray-50 border border-transparent rounded-[2.5rem] outline-none focus:bg-white focus:border-primary/20 transition-all duration-500 text-4xl font-black tracking-tighter text-gray-900' value={ride.pricePerDay} onChange={e=> setRide({...ride, pricePerDay: e.target.value})} />
                </div>

                <div className='flex flex-col w-full'>
                    <label className='font-black text-[10px] uppercase tracking-[0.2em] text-primary mb-3'>Excellence Terms & Conditions</label>
                    <textarea rows={4} placeholder="e.g. Please return with full tank. Professional detailing recommended." required className='px-6 py-5 bg-gray-50 border border-transparent rounded-[1.5rem] outline-none focus:bg-white focus:border-primary/20 transition-all duration-500 text-gray-900 font-medium leading-relaxed' value={ride.description} onChange={e=> setRide({...ride, description: e.target.value})}></textarea>
                </div>
            </div>
        </div>

        <div className='flex flex-col items-center pt-10'>
            <button className='group relative flex items-center justify-center gap-6 px-16 py-8 bg-gray-900 text-white rounded-[2.5rem] font-black text-lg tracking-tight overflow-hidden hover:scale-105 active:scale-95 transition-all duration-500 shadow-2xl shadow-gray-900/40'>
              <div className='absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-700'></div>
              <span className='relative z-10'>Authorize & List Vehicle</span>
              <img src={assets.tick_icon} alt="" className='relative z-10 w-6 h-6 brightness-0 invert group-hover:scale-125 transition-transform duration-500' />
            </button>
            <p className='text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em] mt-8'>Identity Verification required for new listings</p>
        </div>
      </form>
    </div>
  )
}

export default AddRide
