import React, { useState, useContext } from 'react'
import { assets, ownerMenuLinks } from '../../assets/assets'
import {NavLink, useLocation} from 'react-router-dom'
import { AppContext } from '../../context/AppContext'

const Sidebar = () => {
  const { user } = useContext(AppContext);
  const location = useLocation()
  const [image, setImage] = useState('')

  return ( 
    <div className='relative min-h-screen md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-bordercolor bg-white text-sm'>
      <div className='group relative px-6 w-full flex flex-col items-center'>
        <label htmlFor="sidebar-image" className='relative'>
          <div className='w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-gray-50 overflow-hidden shadow-inner bg-primary/10 flex items-center justify-center text-primary text-3xl font-black'>
            {user?.image ? (
              <img src={user.image} alt="Profile" className='w-full h-full object-cover' />
            ) : (
              <span>{user?.name?.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <input type="file" id='sidebar-image' accept="image/*" hidden onChange={e=>setImage(e.target.files[0])} />
          <div className='absolute inset-0 bg-black/20 rounded-full hidden group-hover:flex items-center justify-center cursor-pointer transition-all'>
            <img src={assets.edit_icon} alt="Edit" className='w-5 h-5 invert-0' />
          </div>
        </label>
        
        <div className='mt-4 text-center max-md:hidden'>
          <p className='text-lg font-black text-gray-900 tracking-tight'>{user?.name || "Access Denied"}</p>
          <p className='text-xs font-bold text-primary uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-full mt-1 border border-primary/10'>Verified Owner</p>
        </div>
      </div>

      <div className='w-full mt-10 space-y-2'>
        {ownerMenuLinks.map((link, index) => (
          <NavLink 
            key={index} 
            to={link.path} 
            className={({ isActive }) => 
              `relative flex items-center gap-4 w-full py-4 pl-8 transition-all ${
                isActive 
                  ? 'bg-primary/5 text-primary font-bold' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`
            }
          >
            <img 
              src={location.pathname === link.path ? link.coloredIcon : link.icon} 
              alt={link.name} 
              className={`w-5 h-5 ${location.pathname === link.path ? '' : 'opacity-60'}`}
            />
            <span className='max-md:hidden text-sm uppercase tracking-wider font-bold'>{link.name}</span>
            {location.pathname === link.path && (
              <div className='absolute right-0 top-0 bottom-0 w-1.5 bg-primary rounded-l-full'></div>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
