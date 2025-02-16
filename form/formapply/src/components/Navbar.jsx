import React from 'react'
import { Link } from 'react-router'

function Navbar() {
  return (
    <div className='border py-1.5 px-3 flex items-center '>
        <Link to="/" className='text-blue-400 font-bold text-2xl font-mono ml-8'>For Teams</Link>
        <Link to="/Admin" className='text-blue-400 font-bold text-2xl font-mono ml-8'>For Admin</Link>
    </div>
  )
}

export default Navbar