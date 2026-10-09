import axios from 'axios'
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

const VerifyEmail = () => {
  const {token}=useParams()
  const [status,setStatus]=React.useState("Verifying your email...")
const navigate=useNavigate()
  
  const verifyEmail=async()=>{

    try{
const res=await axios.post("http://localhost:3005/api/v1/user/verify",{},{
  headers:{
   Authorization:`Bearer ${token}`
  }
})
if(res.data.success){
  setStatus("Email verified successfully!")
  toast.success("Email verified successfully!")
  setTimeout(()=>{
    navigate("/login")
  },2000)
}
    }catch(err){
      console.log(err)
      setStatus("Verification failed. Please try again")
      toast.error("Verification failed. Please try again")
    }
  }
  useEffect(()=>{
    verifyEmail()
  },[token])
  return (
    <div className="relative w-full h-[760px] bg-pink-100 overflow-hidden">
      <div className='min-h-screen flex items-center justify-center'>
        <div className='bg-white p-8 rounded shadow-md text-center'>
          <h1 className='text-2xl font-bold mb-4'>Email Verification</h1>
          <p className='text-gray-600'>{status}</p>
        </div>  
      </div>
      
    </div>
  )
}

export default VerifyEmail
