import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import RideCard from '../components/RideCard';
import { AppContext } from '../context/AppContext';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapController = ({ rides, hoveredRideId }) => {
  const map = useMap();
  
  // Fit bounds to all rides when filter changes
  useEffect(() => {
    const mapRides = rides.filter(r => r.latitude && r.longitude);
    if (mapRides.length > 0) {
      if (mapRides.length === 1) {
         map.flyTo([mapRides[0].latitude, mapRides[0].longitude], 13, { duration: 1.5 });
      } else {
         const bounds = L.latLngBounds(mapRides.map(r => [r.latitude, r.longitude]));
         map.flyToBounds(bounds, { padding: [50, 50], maxZoom: 14, duration: 1.5 });
      }
    }
  }, [rides, map]);

  // Pan to specific hovered ride
  useEffect(() => {
    if (hoveredRideId) {
      const hoveredRide = rides.find(r => r._id === hoveredRideId);
      if (hoveredRide && hoveredRide.latitude && hoveredRide.longitude) {
        map.panTo([hoveredRide.latitude, hoveredRide.longitude], {
          animate: true,
          duration: 0.5
        });
      }
    }
  }, [hoveredRideId, rides, map]);

  return null;
}

const RideListings = () => {
  const { rides } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  
  const locationParam = searchParams.get('location') || "";
  const dateParam = searchParams.get('date') || "";

  const [input, setInput] = useState(locationParam);
  const [filteredRides, setFilteredRides] = useState(rides);
  const [hoveredRideId, setHoveredRideId] = useState(null);

  useEffect(() => {
    let filtered = rides;

    if (input.trim() !== "") {
      const lowercasedInput = input.toLowerCase();
      filtered = filtered.filter(ride => 
        ride.carName.toLowerCase().includes(lowercasedInput) || 
        ride.location.toLowerCase().includes(lowercasedInput)
      );
    }
    
    setFilteredRides(filtered);
  }, [input, rides, dateParam]);

  const mapCenter = filteredRides.filter(r => r.latitude && r.longitude).length > 0 
    ? [filteredRides.find(r => r.latitude).latitude, filteredRides.find(r => r.longitude).longitude]
    : [17.3850, 78.4867]; // Default to Hyderabad if no map coordinates

  return (
    <div className='bg-white min-h-[calc(100vh-80px)] flex flex-col md:flex-row overflow-hidden pb-0'>
      {/* Left side: Cars List */}
      <div className='flex-1 md:w-3/5 lg:w-1/2 p-4 md:p-8 overflow-y-auto max-h-[calc(100vh-80px)] bg-light/50'>
        <div className='mb-6'>
          <h1 className='text-3xl md:text-4xl font-black tracking-tight text-gray-900'>Available Cars</h1>
          <p className='text-xs md:text-sm text-gray-500 mt-2 font-bold tracking-widest uppercase'>Explore {filteredRides.length} nearby cars based on your search</p>
        </div>

        <div className='flex items-center bg-white px-5 mb-8 w-full h-14 rounded-full shadow-[0px_10px_30px_rgba(0,0,0,0.05)] border border-bordercolor'>
          <img src={assets.search_icon} alt="Search" className='w-4 h-4 mr-3 opacity-40' />
          <input 
            type="text" 
            placeholder='Search by city or car string...' 
            className='w-full h-full outline-none text-gray-700 font-bold placeholder-gray-400' 
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        
        <div className='flex flex-col gap-6 w-full'>
          {filteredRides.map((ride, index) => (
            <div 
              key={ride._id || index} 
              className='animate-fadeIn w-full max-w-full cursor-pointer transition-transform duration-300 hover:-translate-y-1'
              onMouseEnter={() => setHoveredRideId(ride._id)}
              onMouseLeave={() => setHoveredRideId(null)}
              onClick={() => navigate(`/ride-details/${ride._id}`)}
            >
              <RideCard ride={ride} />
            </div>
          ))}
        </div>

        {filteredRides.length === 0 && (
          <div className='text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200 mt-4'>
            <div className='w-20 h-20 bg-gray-50 shadow-sm border border-gray-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                <img src={assets.search_icon} alt="" className='w-8 h-8 opacity-20' />
            </div>
            <h3 className='text-xl font-black text-gray-800'>No cars found nearby</h3>
            <p className='text-gray-400 mt-2 font-medium'>Try searching a different location or check spelling.</p>
          </div>
        )}
      </div>

      {/* Right side: Map View */}
      <div className='hidden md:block flex-1 md:w-2/5 lg:w-1/2 relative bg-gray-100 h-[calc(100vh-80px)] border-l border-gray-200'>
        <div className="absolute top-6 left-6 z-[1000] bg-white text-[10px] font-black px-4 py-2 rounded-full shadow-lg text-primary tracking-widest uppercase flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Dynamic Map Selection
        </div>
        <MapContainer center={mapCenter} zoom={12} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          {filteredRides.filter(r => r.latitude && r.longitude).map((ride, index) => {
            const isHovered = hoveredRideId === ride._id;
            const baseClasses = "flex items-center justify-center px-4 py-2 rounded-xl font-black text-sm shadow-xl transition-all duration-300 transform whitespace-nowrap";
            const modeClasses = isHovered 
              ? "bg-gray-900 text-white scale-110 z-50 ring-4 ring-gray-900/20" 
              : "bg-white text-gray-900 ring-2 ring-gray-100 hover:scale-105";
              
            const customIcon = L.divIcon({
              className: 'custom-marker-transparent',
              html: `<div class="${baseClasses} ${modeClasses}">₹${ride.pricePerDay}/day</div>`,
              iconSize: [100, 40],
              iconAnchor: [50, 20],
              popupAnchor: [0, -25]
            });

            return (
              <Marker 
                key={ride._id || index} 
                position={[ride.latitude, ride.longitude]}
                icon={customIcon}
                zIndexOffset={isHovered ? 1000 : 0}
              >
                <Popup className="custom-popup">
                  <div className='font-sans min-w-[240px] rounded-2xl overflow-hidden bg-white shadow-2xl border border-gray-100'>
                    <div className='relative'>
                      <img src={ride.image} alt={ride.carName} className='w-full h-32 object-cover' />
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur shadow-sm px-3 py-1 rounded-full text-[10px] font-black text-primary tracking-widest uppercase">
                        {ride.brand}
                      </div>
                    </div>
                    <div className="p-4 bg-white">
                        <p className='font-black text-gray-900 text-lg leading-tight'>{ride.carName}</p>
                        <div className="flex items-center gap-1.5 text-gray-500 mt-1.5 mb-4">
                          <img src={assets.location_icon} alt="Location" className="w-3.5 h-3.5 opacity-50" />
                          <p className='text-xs font-bold uppercase tracking-wider'>{ride.location}</p>
                        </div>
                        <button 
                          onClick={() => navigate(`/ride-details/${ride._id}`)}
                          className='w-full bg-primary text-white font-black py-2.5 rounded-xl text-xs uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30'
                        >
                          Book Now
                        </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
          <MapController rides={filteredRides} hoveredRideId={hoveredRideId} />
        </MapContainer>
      </div>
    </div>
  )
}

export default RideListings;
