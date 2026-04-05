import React, {useState, useContext, useEffect} from 'react'
import { useLocation } from 'react-router-dom'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import RideCard from '../components/RideCard'
import { AppContext } from '../context/AppContext'

const RideListings = () => {
  const { rides } = useContext(AppContext);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  const fromParam = searchParams.get('from') || "";
  const toParam = searchParams.get('to') || "";
  const dateParam = searchParams.get('date') || "";

  const [input, setInput] = useState("");
  const [filteredRides, setFilteredRides] = useState(rides);

  useEffect(() => {
    let filtered = rides;

    // Filter by Route Params from Hero
    if (fromParam) {
        filtered = filtered.filter(ride => ride.from.toLowerCase().includes(fromParam.toLowerCase()));
    }
    if (toParam) {
        filtered = filtered.filter(ride => ride.to.toLowerCase().includes(toParam.toLowerCase()));
    }
    if (dateParam) {
        filtered = filtered.filter(ride => ride.dateTime.includes(dateParam));
    }

    // Filter by manual search input
    if (input.trim() !== "") {
      const lowercasedInput = input.toLowerCase();
      filtered = filtered.filter(ride => 
        ride.carName.toLowerCase().includes(lowercasedInput) || 
        ride.from.toLowerCase().includes(lowercasedInput) || 
        ride.to.toLowerCase().includes(lowercasedInput)
      );
    }
    
    setFilteredRides(filtered);
  }, [input, rides, fromParam, toParam, dateParam]);

  return (
    <div className='bg-white min-h-screen pb-20'>
      <div className='flex flex-col items-center py-20 bg-light max-md:px-4'>
        <Title 
            title={fromParam && toParam ? `${fromParam} to ${toParam}` : 'Available Cars'} 
            subTitle={fromParam && toParam ? `Found ${filteredRides.length} cars for this route` : 'Browse all premium cars and book your journey'} 
        />
        <div className='flex items-center bg-white px-6 mt-8 max-w-2xl w-full h-16 rounded-3xl shadow-xl shadow-primary/5 border border-bordercolor/50'>
          <img src={assets.search_icon} alt="" className='w-5 h-5 mr-3 opacity-30' />
          <input 
            type="text" 
            placeholder='Search by brand, model or city...' 
            className='w-full h-full outline-none text-gray-600 font-medium' 
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className='h-6 w-[1px] bg-gray-200 mx-4'></div>
          <img src={assets.filter_icon} alt="" className='w-5 h-5 opacity-30 cursor-pointer hover:opacity-100 transition-opacity' />
        </div>
      </div>

      <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-12 max-w-7xl mx-auto'>
        <div className='flex items-center justify-between mb-8 px-2'>
            <p className='text-sm text-gray-400 font-bold uppercase tracking-widest'>
                Showing {filteredRides.length} {filteredRides.length === 1 ? 'Ride' : 'Rides'}
            </p>
            <div className='flex items-center gap-2 text-xs font-bold text-primary cursor-pointer border-b-2 border-primary'>
                Sort by Price
            </div>
        </div>
        
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10'>
          {filteredRides.map((ride, index) => (
            <div key={ride._id || index} className='animate-fadeIn' style={{animationDelay: `${index * 0.1}s`}}>
              <RideCard ride={ride} />
            </div>
          ))}
        </div>

        {filteredRides.length === 0 && (
          <div className='text-center py-32 bg-gray-50 rounded-3xl border border-dashed border-bordercolor mt-10'>
            <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                <img src={assets.search_icon} alt="" className='w-8 h-8 opacity-20' />
            </div>
            <h3 className='text-xl font-bold text-gray-800'>No rides found</h3>
            <p className='text-gray-400 mt-2 max-w-xs mx-auto'>Try adjusting your search or explore all available rides across India.</p>
            <button onClick={() => window.location.href='/rides'} className='mt-8 px-8 py-3 bg-primary text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-primary/20 transition-all'>
                View All Rides
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default RideListings
