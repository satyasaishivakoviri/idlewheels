import React, { useState, useContext } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { useToast } from '../context/ToastContext';

const LoginModal = ({ showLogin, setShowLogin }) => {
  const { login } = useContext(AppContext);
  const { showToast } = useToast();
  
  const [currentState, setCurrentState] = useState('Login');
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setUserData(data => ({ ...data, [name]: value }));
  }

  const onLogin = (event) => {
    event.preventDefault();
    
    // Get existing users from localStorage
    const savedUsers = JSON.parse(localStorage.getItem('idle_registered_users') || '[]');

    if (currentState === "Sign Up") {
      // 1. Check if user already exists
      const existingUser = savedUsers.find(u => u.email === userData.email);
      if (existingUser) {
        showToast("An account with this email already exists. Please login.", "error");
        setCurrentState("Login");
        return;
      }

      // 2. Register New User
      const newUser = {
        name: userData.name || userData.email.split('@')[0],
        email: userData.email,
        password: userData.password,
        role: 'user',
        image: null
      };

      const updatedUsers = [...savedUsers, newUser];
      localStorage.setItem('idle_registered_users', JSON.stringify(updatedUsers));
      
      login(newUser);
      setShowLogin(false);
      showToast(`Welcome ${newUser.name}! Your account has been created.`, "success");

    } else {
      // 3. Handle Login
      const user = savedUsers.find(u => u.email === userData.email && u.password === userData.password);

      if (user) {
        login(user);
        setShowLogin(false);
        showToast(`Welcome back, ${user.name}!`, "success");
      } else {
        showToast("Invalid email or password. Please try again.", "error");
      }
    }
  }

  if (!showLogin) return null;

  return (
    <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-fade-in'>
      <form 
        onSubmit={onLogin} 
        className='bg-white w-full max-w-md rounded-3xl p-10 shadow-2xl flex flex-col gap-6 animate-scale-up border border-gray-100'
      >
        <div className='flex justify-between items-center'>
          <h2 className='text-3xl font-black text-gray-900 tracking-tight'>{currentState}</h2>
          <button 
            type="button" 
            onClick={() => setShowLogin(false)} 
            className='p-2 hover:bg-gray-100 rounded-full transition-all cursor-pointer'
          >
            <img src={assets.close_icon} alt="Close" className='w-6 opacity-60' />
          </button>
        </div>

        <div className='flex flex-col gap-4 mt-2'>
          <div className='flex flex-col gap-1'>
             <label className='text-xs font-black text-gray-400 uppercase tracking-widest ml-1'>Username</label>
             <input 
              name='name' 
              onChange={onChangeHandler} 
              value={userData.name} 
              type="text" 
              placeholder='Enter your username' 
              required 
              className='w-full border-2 border-gray-100 px-4 py-3.5 rounded-2xl outline-none focus:border-primary focus:bg-gray-50/30 transition-all font-medium'
            />
          </div>
          
          <div className='flex flex-col gap-1'>
            <label className='text-xs font-black text-gray-400 uppercase tracking-widest ml-1'>Email Address</label>
            <input 
              name='email' 
              onChange={onChangeHandler} 
              value={userData.email} 
              type="email" 
              placeholder='your@email.com' 
              required 
              className='w-full border-2 border-gray-100 px-4 py-3.5 rounded-2xl outline-none focus:border-primary focus:bg-gray-50/30 transition-all font-medium'
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-xs font-black text-gray-400 uppercase tracking-widest ml-1'>Password</label>
            <input 
              name='password' 
              onChange={onChangeHandler} 
              value={userData.password} 
              type="password" 
              placeholder='••••••••' 
              required 
              className='w-full border-2 border-gray-100 px-4 py-3.5 rounded-2xl outline-none focus:border-primary focus:bg-gray-50/30 transition-all font-medium'
            />
          </div>
        </div>

        <button className='w-full bg-primary hover:bg-primary-dull text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all scale-100 hover:scale-[1.02] active:scale-[0.98] mt-2 cursor-pointer'>
          {currentState === "Sign Up" ? "Create Account" : "Access Account"}
        </button>

        <div className='flex justify-between text-sm font-medium mt-2'>
          <p className='text-gray-400'>Forgot password?</p>
          {currentState === "Login"
            ? <p className='text-gray-600'>New here? <span onClick={() => setCurrentState("Sign Up")} className='text-primary cursor-pointer font-bold hover:underline underline-offset-4 decoration-2'>Create Account</span></p>
            : <p className='text-gray-600'>Already have an account? <span onClick={() => setCurrentState("Login")} className='text-primary cursor-pointer font-bold hover:underline underline-offset-4 decoration-2'>Login here</span></p>
          }
        </div>
      </form>
    </div>
  );
};

export default LoginModal;
