import React, { useState, useContext } from "react";
import { assets, menuLinks } from "../assets/assets";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = ({setShowLogin}) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useContext(AppContext);

  return (
    <div
      className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-bordercolor relative transition-all z-[60] ${
        location.pathname === "/" && "bg-light"
      }`}
    >
      <Link to="/" className="z-50">
        <img src={assets.logo} alt="Logo" className="h-8" />
      </Link>

      <div
        className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-bordercolor right-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-50 ${
          location.pathname === "/" ? "bg-light" : "bg-white"
        } ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}
      >
        {menuLinks.map((link, index) => (
          <Link 
            to={link.path} 
            key={index} 
            className={`font-medium hover:text-primary transition-colors ${location.pathname === link.path ? 'text-primary border-b-2 border-primary' : ''}`}
          >
            {link.name}
          </Link>
        ))}


        <div className='hidden lg:flex items-center text-sm gap-2 border border-bordercolor px-4 py-2 rounded-full max-w-56 bg-white/50 focus-within:border-primary transition-all'>
            <input type="text" className="w-full bg-transparent outline-none placeholder-gray-400 font-medium" placeholder="Search Cars"/>
            <img src={assets.search_icon} alt="Search" className="w-4 h-4 opacity-50" />
        </div>

        <div className='flex max-sm:flex-col items-start sm:items-center gap-6'>
            <button onClick={() => navigate('/owner')} className="cursor-pointer font-bold text-gray-800 hover:text-primary transition-all">Owner Portal</button>
            {user ? (
              <div className="flex items-center gap-4">
                <span className="hidden lg:block text-xs font-black uppercase tracking-widest text-primary bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10">Hi, {user.name.split(' ')[0]}</span>
                <button 
                  onClick={() => { logout(); navigate('/'); }} 
                  className="cursor-pointer px-6 py-2 border-2 border-bordercolor hover:border-red-100 hover:text-red-500 transition-all font-bold rounded-xl text-gray-800"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowLogin(true)} 
                className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all text-white font-bold rounded-xl"
              >
                Sign In
              </button>
            )}
        </div>
      </div>


      <button className='sm:hidden cursor-pointer p-2' aria-label="Menu"  onClick={() => setOpen(!open)}>
        <img src={open ? assets.close_icon : assets.menu_icon} alt="Menu" className="w-6 h-6"/>
      </button>
    </div>
  );
};

export default Navbar;