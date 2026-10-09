import SideBar from '@/components/SideBar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const Dashbaord = () => {
  return (
    <div className='flex'>
   <SideBar></SideBar>
<div className="flex-1">
  <Outlet></Outlet>
</div>
    </div>
  )
}

export default Dashbaord
