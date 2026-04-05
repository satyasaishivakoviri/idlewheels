import React, {useContext} from 'react'
import {assets} from '../../assets/assets'
import Title from '../../components/owner/Title'
import { AppContext } from '../../context/AppContext'

const ManageRides = () => {
  const { rides, deleteRide, currency, user } = useContext(AppContext);
  
  // Filter cars for the current owner
  const myRides = rides.filter(ride => ride.ownerId === user?._id || ride.ownerId === user?.email);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this car listing?")) {
      deleteRide(id);
    }
  }

  return (
    <div className='px-4 pt-10 md:px-10 w-full bg-white min-h-screen'>
      <Title title="Manage My Cars" subTitle="View and manage your active car rental listings." />
      <div className='max-w-5xl w-full rounded-2xl overflow-hidden border border-bordercolor mt-8 bg-white shadow-sm'>
        <table className='w-full border-collapse text-left text-sm text-gray-600'>
          <thead className='bg-light text-gray-400 uppercase text-[10px] font-bold tracking-widest'>
            <tr>
              <th className='p-5'>Vehicle</th>
              <th className='p-5'>Location</th>
              <th className='p-5'>Price/Day</th>
              <th className='p-5 text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {myRides.length > 0 ? myRides.map((ride, index)=>(
              <tr key={ride._id || index} className='border-t border-bordercolor hover:bg-gray-50 transition-colors'>
                <td className='p-5 flex items-center gap-4'>
                  <img src={ride.image} alt="" className='h-12 w-12 rounded-xl object-cover shadow-sm'/>
                  <div>
                    <p className='font-bold text-gray-800'>{ride.carName}</p>
                    <p className='text-[10px] text-gray-400 font-medium uppercase tracking-tighter'>ID: {ride._id.slice(-6)}</p>
                  </div>
                </td>
                <td className='p-5'>
                  <div className='flex items-center gap-2'>
                    <span className='font-bold text-gray-700'>{ride.location || 'Visakhapatnam'}</span>
                  </div>
                  <p className='text-[10px] text-gray-400 mt-1 font-medium'>Listed on {new Date(ride.createdAt).toLocaleDateString()}</p>
                </td>
                <td className='p-5'>
                  <div className='flex flex-col gap-1'>
                    <div className='flex items-center gap-1'>
                        <span className='text-xs font-black text-primary'>{currency}{ride.pricePerDay}</span>
                        <span className='text-[10px] text-gray-400'>/ Day</span>
                    </div>
                  </div>
                </td>
                <td className='p-5'>
                  <div className='flex items-center justify-center gap-3'>
                    <button onClick={() => handleDelete(ride._id)} className='p-2.5 hover:bg-red-50 rounded-xl transition-all group' title="Remove Listing">
                      <img src={assets.delete_icon} alt="Delete" className='w-4 h-4 opacity-40 group-hover:opacity-100' />
                    </button>
                    <button className='p-2.5 hover:bg-light rounded-xl transition-all group' title="Edit Details">
                      <img src={assets.edit_icon} alt="Edit" className='w-4 h-4 opacity-40 group-hover:opacity-100' />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className='p-20 text-center text-gray-400 italic text-sm'>
                  You haven't listed any cars yet. <br/>
                  <button onClick={() => window.location.href='/owner/add-ride'} className='text-primary font-bold hover:underline mt-2'>Add your first car</button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageRides
