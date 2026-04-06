import React from 'react'

const VideoModal = ({ isOpen, onClose, videoUrl, carName }) => {
    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm animate-in fade-in duration-300'>
            <div className='relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10'>
                {/* Header */}
                <div className='absolute top-0 left-0 right-0 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent z-10'>
                    <h3 className='text-white font-black text-xl tracking-tight'>{carName} <span className='text-primary ml-2'>Demo</span></h3>
                    <button 
                        onClick={onClose}
                        className='bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-md transition-colors'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Video Player */}
                <div className='aspect-video w-full'>
                    <iframe 
                        width="100%" 
                        height="100%" 
                        src={`${videoUrl}?autoplay=1`} 
                        title={`${carName} Demo`}
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                        className='w-full h-full'
                    />
                </div>
            </div>
            
            {/* Click outside to close */}
            <div className='absolute inset-0 -z-10' onClick={onClose}></div>
        </div>
    )
}

export default VideoModal
