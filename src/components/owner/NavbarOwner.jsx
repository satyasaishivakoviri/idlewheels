import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'

const NavbarOwner = () => {
  const { user, logout } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  }

  return (
    <div className='flex items-center justify-between px-6 md:px-10 py-4 text-gray-500 border-b border-bordercolor bg-white transition-all sticky top-0 z-50'>
      <Link to='/'>
        <img src={assets.logo} alt="Logo" className='h-7 hover:opacity-80 transition-opacity'/>
      </Link>
      
      <div className='flex items-center gap-6'>
        {user && (
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs'>
              {user.name.charAt(0)}
            </div>
            <p className='text-sm font-medium text-gray-700 hidden sm:block'>Welcome back, <span className='font-bold text-primary'>{user.name}</span></p>
          </div>
        )}
        <button 
          onClick={handleLogout}
          className='bg-gray-50 hover:bg-red-50 hover:text-red-600 text-xs font-bold px-4 py-2 rounded-xl border border-gray-100 transition-all cursor-pointer'
        >
          Logout Portal
        </button>
      </div>
    </div>
  )
}

export default NavbarOwner
