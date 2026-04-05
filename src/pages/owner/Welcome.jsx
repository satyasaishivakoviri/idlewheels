import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const Welcome = () => {
  const navigate = useNavigate()
  const { user } = useContext(AppContext)

  return (
    <div className='w-full max-w-4xl mx-auto'>
      <div className='bg-white p-10 md:p-16 rounded-[2.5rem] shadow-xl border border-gray-100 mt-10 text-center animate-fade-in'>
        <div className='w-24 h-24 bg-primary/10 rounded-full flex flex-col items-center justify-center mx-auto mb-8 border-4 border-primary/20'>
          {user?.image ? (
            <img src={user.image} alt="User" className='w-full h-full object-cover rounded-full' />
          ) : (
            <span className='text-primary text-4xl font-black'>{user?.name?.charAt(0).toUpperCase()}</span>
          )}
        </div>
        
        <h1 className='text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4'>
          Welcome to the Portal
        </h1>
        <p className='text-gray-500 font-medium text-lg max-w-xl mx-auto mb-12 leading-relaxed'>
          What would you like to do today? You can browse our collection to find a car to rent or list your own car to start earning.
        </p>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <button 
            onClick={() => navigate('/rides')} 
            className='group p-8 bg-blue-50 hover:bg-blue-100 rounded-[2rem] border-2 border-blue-200 hover:border-blue-400 transition-all flex flex-col items-center shadow-sm hover:shadow-xl'
          >
            <div className='w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-md'>
              <img src={assets.search_icon} alt="Find" className='w-8 h-8 opacity-70 group-hover:scale-110 transition-transform' />
            </div>
            <h2 className='text-2xl font-black text-gray-900 mb-2'>Find a Car</h2>
            <p className='text-gray-500 font-medium'>Browse available cars and book your next journey.</p>
          </button>

          <button 
            onClick={() => navigate('/owner/add-ride')} 
            className='group p-8 bg-green-50 hover:bg-green-100 rounded-[2rem] border-2 border-green-200 hover:border-green-400 transition-all flex flex-col items-center shadow-sm hover:shadow-xl'
          >
            <div className='w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-md'>
              <img src={assets.addIconColored} alt="Add" className='w-8 h-8 opacity-70 group-hover:scale-110 transition-transform' />
            </div>
            <h2 className='text-2xl font-black text-gray-900 mb-2'>Add a Car</h2>
            <p className='text-gray-500 font-medium'>List your idle car and start earning passive income.</p>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Welcome
