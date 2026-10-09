import { FrameIcon, LayoutDashboard, ListOrdered, PackagePlus, PackageSearch, Users } from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router-dom'

const SideBar = () => {
  return (
    <div className="hidden fixed md:block border-r bg-pink-50 border-pink-200 z-10 w-[300px] p-6 space-y-2 h-screen">
      {/* Brand or Header Area */}
      <div className="px-4 py-4 mb-4">
        <h2 className="text-xl font-bold text-pink-700 tracking-wide">Admin Panel</h2>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-2">
        <NavLink 
          to="/dashboard/sales" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive 
                ? 'bg-pink-600 text-white shadow-sm' 
                : 'text-gray-600 hover:bg-pink-100 hover:text-pink-700'
            }` 
          }
        >
          {/* Icon and label sit side-by-side */}
          <LayoutDashboard className="w-5 h-5 shrink-0" />
          <span className="capitalize">Dashboard</span>
        </NavLink>
      </div>



       <div className="flex flex-col gap-2">
        <NavLink 
          to="/dashboard/add-product" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive 
                ? 'bg-pink-600 text-white shadow-sm' 
                : 'text-gray-600 hover:bg-pink-100 hover:text-pink-700'
            }` 
          }
        >
          {/* Icon and label sit side-by-side */}
          <PackagePlus className="w-5 h-5 shrink-0" />
          <span className="capitalize">Add Products</span>
        </NavLink>
      </div>

       <div className="flex flex-col gap-2">
        <NavLink 
          to="/dashboard/products" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive 
                ? 'bg-pink-600 text-white shadow-sm' 
                : 'text-gray-600 hover:bg-pink-100 hover:text-pink-700'
            }` 
          }
        >
          {/* Icon and label sit side-by-side */}
          <PackageSearch className="w-5 h-5 shrink-0" />
          <span className="capitalize">Products</span>
        </NavLink>
      </div>
       <div className="flex flex-col gap-2">
        <NavLink 
          to="/dashboard/users" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive 
                ? 'bg-pink-600 text-white shadow-sm' 
                : 'text-gray-600 hover:bg-pink-100 hover:text-pink-700'
            }` 
          }
        >
          {/* Icon and label sit side-by-side */}
          <Users className="w-5 h-5 shrink-0" />
          <span className="capitalize">Users</span>
        </NavLink>
      </div>
       <div className="flex flex-col gap-2">
        <NavLink 
          to="/dashboard/orders" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive 
                ? 'bg-pink-600 text-white shadow-sm' 
                : 'text-gray-600 hover:bg-pink-100 hover:text-pink-700'
            }` 
          }
        >
          {/* Icon and label sit side-by-side */}
          <ListOrdered className="w-5 h-5 shrink-0" />
          <span className="capitalize">orders</span>
        </NavLink>
      </div>
    </div>
  )
}

export default SideBar
