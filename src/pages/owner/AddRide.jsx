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
      createdAt: new Date().toISOString(),
    };

    addRide(newRide);
    alert("Car listed successfully!");
    navigate('/owner/manage-rides');
  }

  return (
    <div className='px-4 py-10 md:px-10 flex-1 bg-white'>
      <Title title="List Your Car" subTitle="Turn your idle vehicle into earnings with IdleWheels." />
      <form onSubmit={onSubmitHandler} className='flex flex-col gap-6 text-gray-500 text-sm mt-8 max-w-2xl'>
        <div className='flex flex-col gap-4 w-full p-6 bg-gray-50/50 border border-gray-100 rounded-3xl'>
          <div className='flex items-center gap-4'>
            <label htmlFor="car-media" className='shrink-0 group'>
              <div className='h-20 w-20 bg-white border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer group-hover:border-primary group-hover:bg-primary/5 transition-all'>
                <img src={assets.upload_icon} alt="" className='h-6 w-6 opacity-40 group-hover:opacity-100 transition-opacity' />
                <span className='text-[10px] font-black tracking-widest text-gray-400 mt-1 uppercase group-hover:text-primary transition-colors'>Upload</span>
              </div>
              <input type="file" id='car-media' accept='image/*,video/*' multiple hidden onChange={(e) => {
                const files = Array.from(e.target.files);
                setMediaFiles(prev => [...prev, ...files]);
              }}/>
            </label>
            <div>
              <p className='font-black text-gray-800 text-base'>Car Media (Photos & Videos)</p>
              <p className='text-sm text-gray-500 font-medium leading-relaxed max-w-lg mt-1'>Upload a comprehensive 360-degree view around the car, including at least 3-4 photos/videos of the interior and exterior to easily verify your vehicle.</p>
            </div>
          </div>
          
          {mediaFiles.length > 0 && (
            <div className='flex gap-4 overflow-x-auto pb-4 mt-2 max-w-full custom-scrollbar'>
              {mediaFiles.map((file, index) => (
                <div key={index} className='relative shrink-0 group rounded-2xl overflow-hidden shadow-sm'>
                  {file.type.startsWith('video/') ? (
                    <video src={URL.createObjectURL(file)} className='h-32 w-48 object-cover' muted></video>
                  ) : (
                    <img src={URL.createObjectURL(file)} alt="" className='h-32 w-48 object-cover' />
                  )}
                  <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                    <button type="button" onClick={() => setMediaFiles(prev => prev.filter((_, i) => i !== index))} className='bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center cursor-pointer shadow-xl hover:scale-110 active:scale-95 transition-all'>
                       <img src={assets.delete_icon || assets.close_icon} alt="Delete" className='w-4 h-4 invert brightness-200' />
                    </button>
                  </div>
                  {file.type.startsWith('video/') && (
                    <div className='absolute bottom-2 right-2 bg-black/70 text-white text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-lg backdrop-blur-sm'>
                      Video
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className='flex flex-col w-full'>
          <label className='font-bold text-xs uppercase tracking-widest text-primary mb-2'>Vehicle Display Name</label>
          <input type="text" placeholder='e.g. Premium Maruti Swift 2023...' required className='px-4 py-3 border border-bordercolor rounded-xl outline-none focus:border-primary transition-all' value={ride.carName} onChange={e=> setRide({...ride, carName: e.target.value})}/>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col w-full'>
            <label className='font-bold text-xs uppercase tracking-widest text-primary mb-2'>Brand</label>
            <input type="text" placeholder='e.g. Maruti, Toyota, Honda...' required className='px-4 py-3 border border-bordercolor rounded-xl outline-none focus:border-primary' value={ride.brand} onChange={e=> setRide({...ride, brand: e.target.value})}/>
          </div>
          <div className='flex flex-col w-full'>
            <label className='font-bold text-xs uppercase tracking-widest text-primary mb-2'>Model</label>
            <input type="text" placeholder='e.g. Swift, Fortuner, City...' required className='px-4 py-3 border border-bordercolor rounded-xl outline-none focus:border-primary' value={ride.model} onChange={e=> setRide({...ride, model: e.target.value})}/>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col w-full'>
            <label className='font-bold text-xs uppercase tracking-widest text-primary mb-2'>Location (City)</label>
            <select required className='px-4 py-3 border border-bordercolor rounded-xl outline-none focus:border-primary' value={ride.location} onChange={e=> setRide({...ride, location: e.target.value})}>
                <option value="">Select City</option>
                {cityList.map(city => <option key={city} value={city}>{city}</option>)}
            </select>
          </div>
          <div className='flex flex-col w-full'>
            <label className='font-bold text-xs uppercase tracking-widest text-primary mb-2'>Fuel Type</label>
            <select required className='px-4 py-3 border border-bordercolor rounded-xl outline-none focus:border-primary' value={ride.fuelType} onChange={e=> setRide({...ride, fuelType: e.target.value})}>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="CNG">CNG</option>
            </select>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='flex flex-col w-full'>
            <label className='font-bold text-xs uppercase tracking-widest text-primary mb-2'>Transmission</label>
            <select required className='px-4 py-3 border border-bordercolor rounded-xl outline-none focus:border-primary' value={ride.transmission} onChange={e=> setRide({...ride, transmission: e.target.value})}>
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
            </select>
          </div>
          <div className='flex flex-col w-full'>
            <label className='font-bold text-xs uppercase tracking-widest text-primary mb-2'>Seating Capacity</label>
            <input type="number" placeholder="5" required className='px-4 py-3 border border-bordercolor rounded-xl outline-none focus:border-primary' value={ride.seatingCapacity} onChange={e=> setRide({...ride, seatingCapacity: e.target.value})} min="1" max="10" />
          </div>
          <div className='flex flex-col w-full'>
            <label className='font-bold text-xs uppercase tracking-widest text-primary mb-2'>Price Per Day ({currency})</label>
            <input type="number" placeholder="1500" required className='px-4 py-3 border border-bordercolor rounded-xl outline-none focus:border-primary' value={ride.pricePerDay} onChange={e=> setRide({...ride, pricePerDay: e.target.value})} />
          </div>
        </div>

        <div className='flex flex-col w-full'>
            <label className='font-bold text-xs uppercase tracking-widest text-primary mb-2'>Car Description / Rental Terms</label>
            <textarea rows={4} placeholder="e.g. Fastag available. Please return with full tank. No smoking inside." required className='px-4 py-3 border border-bordercolor rounded-xl outline-none focus:border-primary transition-all' value={ride.description} onChange={e=> setRide({...ride, description: e.target.value})}></textarea>
        </div>

        <button className='flex items-center justify-center gap-3 px-8 py-4 mt-4 bg-primary text-white rounded-2xl font-bold w-max cursor-pointer hover:shadow-xl hover:shadow-primary/20 transition-all'>
          <img src={assets.tick_icon} alt="" className='w-5 h-5 brightness-200' />
          List My Car
        </button>
      </form>
    </div>
  )
}

export default AddRide
