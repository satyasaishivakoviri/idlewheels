import React, { useContext } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const About = () => {
  const { rides = [], bookings = [] } = useContext(AppContext) || {};
  const uniqueCities = new Set(rides.map(r => r.location).filter(Boolean)).size;

  return (
    <div className='bg-white'>
      {/* Hero Section */}
      <div className='relative h-[60vh] flex items-center justify-center overflow-hidden bg-primary'>
        <div className='absolute inset-0 opacity-10 bg-[url("https://www.transparenttextures.com/patterns/carbon-fibre.png")]'></div>
        <div className='relative z-10 text-center px-6'>
            <h1 className='text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 uppercase'>
                The Future of <br/> <span className='text-white/50'>Car Sharing</span>
            </h1>
            <p className='text-white/80 text-xl font-bold max-w-2xl mx-auto leading-relaxed uppercase tracking-widest'>
                IdleWheels is India's leading community-driven car rental platform. 
                We're turning idle vehicles into memorable journeys.
            </p>
        </div>
      </div>

      {/* Impact Stats */}
      <div className='px-6 md:px-16 lg:px-24 xl:px-32 -mt-20 relative z-20'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {[
                { label: 'Verified Cars', val: rides.length, icon: assets.car_icon },
                { label: 'Happy Renters', val: bookings.length, icon: assets.users_icon },
                { label: 'Cities Covered', val: uniqueCities, icon: assets.location_icon },
            ].map((stat) => (
                <div key={stat.label} className='bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-100 flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-500'>
                    <div className='w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
                        <img src={stat.icon} alt="" className='w-8' />
                    </div>
                    <h2 className='text-4xl font-black text-gray-900 tracking-tighter'>{stat.val}</h2>
                    <p className='text-gray-400 font-black uppercase tracking-widest mt-2 text-xs'>{stat.label}</p>
                </div>
            ))}
        </div>
      </div>

      {/* Story Section */}
      <div className='px-6 md:px-16 lg:px-24 xl:px-32 py-32 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center'>
        <div>
            <Title title="Why IdleWheels?" subTitle="Bridging the gap between car owners and temporary travellers." align="left" />
            <div className='space-y-6 mt-10 text-gray-600 font-medium text-lg leading-relaxed'>
                <p>
                    Millions of cars across India sit idle for over 22 hours a day. Meanwhile, thousands of travellers struggle to find reliable, high-quality rentals at fair prices.
                </p>
                <p>
                    <span className='font-black text-primary'>IdleWheels</span> was built to solve this. By connecting verified car owners with trusted renters, we create a win-win ecosystem that makes premium mobility accessible to everyone.
                </p>
                <div className='pt-8'>
                    <button className='px-10 py-5 bg-gray-900 text-white rounded-[2rem] font-black text-lg shadow-xl hover:bg-black transition-all transform active:scale-95'>
                        Learn How It Works
                    </button>
                </div>
            </div>
        </div>
        <div className='relative'>
            <div className='absolute -inset-4 bg-primary/5 rounded-[4rem] -rotate-2'></div>
            <img src={assets.main_car} alt="Experience" className='relative rounded-[4rem] shadow-2xl hover:rotate-1 transition-transform duration-700' />
        </div>
      </div>

      {/* Core Values */}
      <div className='bg-gray-50 py-32 px-6 md:px-16 lg:px-24 xl:px-32'>
        <div className='text-center mb-20'>
            <Title title="Our Core Values" subTitle="The standards that drive our platform" />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
            {[
                { title: 'Trust & Safety', desc: 'Comprehensive insurance and Aadhaar-verified users for total peace of mind.', icon: assets.tick_icon },
                { title: 'Transparency', desc: 'Upfront pricing with no hidden costs. What you see is what you pay.', icon: assets.fuel_icon },
                { title: 'Support', desc: '24/7 roadside assistance and dedicated community support for every journey.', icon: assets.users_icon },
            ].map((value) => (
                <div key={value.title} className='bg-white p-12 rounded-[3.5rem] border border-gray-100 hover:border-primary/20 hover:shadow-xl transition-all'>
                    <div className='w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center mb-8'>
                        <img src={value.icon} alt="" className='w-6' />
                    </div>
                    <h3 className='text-2xl font-black text-gray-900 mb-4 tracking-tight'>{value.title}</h3>
                    <p className='text-gray-500 font-medium leading-relaxed'>{value.desc}</p>
                </div>
            ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className='py-32 text-center px-6'>
        <h2 className='text-5xl font-black text-gray-900 tracking-tighter mb-6'>Ready to hit the road?</h2>
        <p className='text-gray-400 text-xl font-bold uppercase tracking-[0.2em] mb-12'>Book your dream car in minutes.</p>
        <div className='flex flex-wrap justify-center gap-6'>
            <button onClick={() => window.location.href='/rides'} className='px-12 py-6 bg-primary text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all transform hover:scale-105 active:scale-95'>
                Find a Car
            </button>
            <button onClick={() => window.location.href='/owner/add-ride'} className='px-12 py-6 bg-gray-900 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-black/20 hover:bg-black transition-all transform hover:scale-105 active:scale-95'>
                List Your Car
            </button>
        </div>
      </div>
    </div>
  )
}

export default About
