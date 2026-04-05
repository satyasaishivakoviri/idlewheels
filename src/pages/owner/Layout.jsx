import React, { useContext } from 'react'
import NavbarOwner from '../../components/owner/NavbarOwner'
import Sidebar from '../../components/owner/Sidebar'
import { Outlet } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const Layout = ({ setShowLogin }) => {
  const { user } = useContext(AppContext);

  return (
    <div className='flex flex-col min-h-screen bg-gray-50/50'>
      <NavbarOwner />
      
      {user ? (
        /* Authenticated View */
        <div className='flex flex-1'>
          <Sidebar />
          <div className='flex-1 p-6 md:p-8 animate-fade-in'>
             <Outlet />
          </div>
        </div>
      ) : (
        /* Unauthenticated Splash Screen */
        <div className='flex-1 flex flex-col items-center justify-center p-6 text-center animate-fade-in'>
          <div className='max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100'>
            <div className='w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-8'>
              <img src={assets.lock_icon || assets.cautionIconColored} alt="Secure" className='w-10 h-10 opacity-70' />
            </div>
            <h1 className='text-3xl font-black text-gray-900 mb-4 tracking-tight uppercase'>Owner Portal Locked</h1>
            <p className='text-gray-500 mb-10 leading-relaxed font-medium'>
              You must be logged in to manage your car fleet, confirm bookings, and view earnings. Please sign in to your owner profile.
            </p>
            
            <div className='flex flex-col gap-4'>
              <button 
                onClick={() => setShowLogin(true)}
                className='w-full bg-primary hover:bg-primary-dull text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all scale-100 hover:scale-[1.02] cursor-pointer'
              >
                Sign In Now
              </button>
              <a href="/" className='text-sm font-bold text-gray-400 hover:text-primary transition-all underline underline-offset-4'>
                Back to Homepage
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Layout
