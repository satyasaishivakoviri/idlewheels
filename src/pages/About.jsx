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
      <div className='relative h-[80vh] flex items-center justify-center overflow-hidden bg-[#0A0A0B]'>
        <div className='absolute inset-0 bg-gradient-to-br from-primary/20 via-black to-black z-0'></div>
        <div className='absolute inset-0 opacity-20 bg-[url("https://www.transparenttextures.com/patterns/carbon-fibre.png")] z-1'></div>
        
        {/* Animated Background Element */}
        <div className='absolute top-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse'></div>
        <div className='absolute bottom-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse transition-all duration-1000'></div>

        <div className='relative z-10 text-center px-6 max-w-5xl mx-auto'>
            <div className='inline-flex items-center gap-2 mb-8 px-5 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md'>
                <span className='w-1.5 h-1.5 bg-primary rounded-full'></span>
                <p className='text-[10px] text-white/60 font-black uppercase tracking-[0.3em]'>Modernizing Mobility</p>
            </div>
            <h1 className='text-6xl md:text-8xl font-black text-white tracking-tighter mb-10 leading-[0.9] uppercase'>
                The Future of <br/> <span className='text-transparent bg-clip-text bg-gradient-to-r from-primary to-white/40'>Premium Sharing</span>
            </h1>
            <p className='text-white/60 text-lg md:text-2xl font-bold max-w-3xl mx-auto leading-relaxed uppercase tracking-widest'>
                IdleWheels is reimagining the road. We transform idle luxury vehicles into 
                seamless, curated experiences for the modern explorer.
            </p>
        </div>
      </div>

      {/* Impact Stats (Glassmorphism) */}
      <div className='px-6 md:px-16 lg:px-24 xl:px-32 -mt-32 relative z-20'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {[
                { label: 'Authorized Fleet', val: rides.length + "+", icon: assets.car_icon },
                { label: 'Elite Members', val: bookings.length + 50 + "+", icon: assets.users_icon },
                { label: 'Service Hubs', val: uniqueCities, icon: assets.location_icon },
            ].map((stat) => (
                <div key={stat.label} className='bg-white/90 backdrop-blur-2xl p-12 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] border border-white/40 flex flex-col items-center text-center group hover:-translate-y-4 transition-all duration-700'>
                    <div className='w-20 h-20 bg-gray-900 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl'>
                        <img src={stat.icon} alt="" className='w-8 brightness-0 invert opacity-80' />
                    </div>
                    <h2 className='text-5xl font-black text-gray-900 tracking-tighter mb-2'>{stat.val}</h2>
                    <p className='text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]'>{stat.label}</p>
                </div>
            ))}
        </div>
      </div>

      {/* Story Section */}
      <div className='px-6 md:px-16 lg:px-24 xl:px-32 py-40 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center'>
        <div className='relative order-2 lg:order-1'>
            <div className='absolute -inset-8 bg-gray-50 rounded-[5rem] -rotate-3 z-0'></div>
            <div className='relative z-10 overflow-hidden rounded-[4rem] shadow-2xl border-8 border-white group'>
                <img src="/cars/tesla.png" alt="Luxury Experience" className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000' />
                <div className='absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-overlay cursor-pointer'></div>
            </div>
            <div className='absolute -bottom-10 -right-10 w-48 h-48 bg-primary rounded-full flex items-center justify-center text-white p-10 text-center shadow-2xl transform rotate-12 hover:rotate-0 transition-all duration-700 cursor-pointer hidden md:flex'>
                <p className='font-black text-sm uppercase tracking-widest'>Born from Innovation</p>
            </div>
        </div>
        <div className='order-1 lg:order-2 space-y-12'>
            <div className='space-y-4'>
                <p className='text-primary font-black uppercase tracking-[0.3em] text-xs'>Our Origin</p>
                <h2 className='text-5xl md:text-6xl font-black text-gray-900 tracking-tighter leading-tight'>
                    Bridging the <br/> Luxury Gap.
                </h2>
            </div>
            <div className='space-y-8 text-gray-500 font-medium text-xl leading-relaxed'>
                <p>
                    Millions of premium vehicles across India sit idle for over 22 hours a day. Meanwhile, discerning travellers struggle to find reliable, high-performance rentals at fair prices.
                </p>
                <div className='flex items-start gap-6 group'>
                    <div className='w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-primary transition-colors'>
                        <img src={assets.tick_icon} className='h-4 w-4 group-hover:brightness-200 transition-all' alt="" />
                    </div>
                    <p className='flex-1 text-gray-900 font-bold leading-snug'>
                        <span className='font-black text-primary'>IdleWheels</span> was built to solve this—creating a win-win ecosystem by connecting verified owners with trusted renters.
                    </p>
                </div>
                <div className='pt-8'>
                    <button className='group relative px-12 py-6 bg-gray-900 text-white rounded-[2rem] font-black text-lg overflow-hidden transition-all active:scale-95'>
                        <span className='relative z-10'>The Full Story</span>
                        <div className='absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500'></div>
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* Core Values (Dark Grid) */}
      <div className='bg-[#0A0A0B] py-40 px-6 md:px-16 lg:px-24 xl:px-32 relative overflow-hidden'>
        <div className='absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[150px] -rotate-12 translate-x-1/2'></div>
        <div className='relative z-10 text-center mb-32 space-y-4'>
            <p className='text-primary font-black uppercase tracking-[0.4em] text-xs'>Excellence First</p>
            <h2 className='text-5xl md:text-7xl font-black text-white tracking-tighter'>The IdleWheels Standard.</h2>
        </div>
        <div className='relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8'>
            {[
                { title: 'Trust & Safety', desc: 'Comprehensive coverage and multi-stage identity verification for total peace of mind.', icon: assets.tick_icon },
                { title: 'Elite Platform', desc: 'A curated marketplace of vetted high-end vehicles, ensuring absolute quality.', icon: assets.fuel_icon },
                { title: 'Concierge Support', desc: 'Wait-free dedicated support and roadside assistance for every member of the community.', icon: assets.users_icon },
            ].map((value) => (
                <div key={value.title} className='bg-white/5 backdrop-blur-sm p-14 rounded-[4rem] border border-white/5 hover:border-primary/20 hover:bg-white/10 transition-all duration-700 group'>
                    <div className='w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-10 group-hover:rotate-12 group-hover:bg-primary transition-all duration-500'>
                        <img src={value.icon} alt="" className='w-6 brightness-0 invert group-hover:scale-110 transition-transform' />
                    </div>
                    <h3 className='text-3xl font-black text-white mb-6 tracking-tight'>{value.title}</h3>
                    <p className='text-white/40 font-bold leading-relaxed text-sm tracking-wide'>{value.desc}</p>
                </div>
            ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className='py-48 text-center px-6 bg-white relative'>
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none'></div>
        <div className='relative z-10'>
            <h2 className='text-6xl md:text-8xl font-black text-gray-900 tracking-tighter mb-10 uppercase leading-[0.8]'>
                Ready to redefine <br/> <span className='text-primary'>your journey?</span>
            </h2>
            <p className='text-gray-400 text-sm md:text-xl font-bold uppercase tracking-[0.4em] mb-16'>Book your elite experience in minutes.</p>
            <div className='flex flex-wrap justify-center gap-8'>
                <button onClick={() => window.location.href='/rides'} className='px-16 py-8 bg-primary text-white rounded-[2.5rem] font-black text-2xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all transform hover:-translate-y-2 active:scale-95'>
                    Find an Experience
                </button>
                <button onClick={() => window.location.href='/owner/add-ride'} className='px-16 py-8 bg-gray-900 text-white rounded-[2.5rem] font-black text-2xl shadow-2xl shadow-black/20 hover:bg-black transition-all transform hover:-translate-y-2 active:scale-95'>
                    Monetize Your Car
                </button>
            </div>
        </div>
      </div>
    </div>
  )
}

export default About
