import { Button } from '@/components/ui/button'
import { setuser } from '@/redux/userSlice'
import axios from 'axios'
import { ShoppingCart } from 'lucide-react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const Navbar = () => {
const {user}=useSelector((store)=>store.user)
const {cart}=useSelector((store)=>store.product)
const dispatch=useDispatch()
const navigate = useNavigate();
const admin=user?.role==="admin" ? true:false;
  const accessToken=localStorage.getItem("accessToken")


  const logoutHandler=async()=>{ 
  try{ 
    const res = await axios.post("http://localhost:3005/api/v1/user/logout", {}, { 
      headers: { // Fixed the typo here
        Authorization: `Bearer ${accessToken}` 
      } 
    }) 
    if(res.data.success){ 
      dispatch(setuser(null)) 
      toast.success(res.data.message) 
      navigate("/login")
    } 
  }catch(err){ 
    console.log("error while logout", err) 
  } 
}

  return (
    <header className="bg-pink-100 fixed w-full h-[80px] z-20 border-pink-200">
      <div className='max-w-7xl flex justify-between items-center py-3'>
{/* logo section */}
<div>
  <img src="/weblogo.jpeg" alt="" className='w-[50px] ml-3 rounded-2xl mb-0' />
</div>
{/* nav section */}
<nav className='flex gap-3 justify-between items-center'>
  <ul className='flex gap-7 items-center text-xl font-semibold'>
    <Link to={'/'}><li>Home</li></Link>
    <Link to={'/products'}><li>Products</li></Link>
    {
      user && <Link to={`/profile/${user._id}`}><li>Hello, {user.firstName}</li></Link>
    }
    {
      admin && <Link to={'/dashboard/sales'}><li>dashboard</li></Link>
    }
  </ul>
<Link to={'/cart'} className='relative'>
<ShoppingCart></ShoppingCart>
<span className='bg-pink-500 rounded-full absolute text-white -top-3 right-2 px-2'>{cart?.items?.length || 0}</span>
</Link>
{
  user ? <Button onClick={logoutHandler} className='bg-pink-600 text-white cursor-pointer '>Logout</Button> :
   <Button className='bg-gradient-to-tl from-blue-500 to-purple-600 text-white cursor-pointer '><Link to={'/login'}>Login</Link></Button>
}

</nav>
      </div>
      
    </header>
  )
}

export default Navbar
