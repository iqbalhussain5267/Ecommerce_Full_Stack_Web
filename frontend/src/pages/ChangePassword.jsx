import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const ResetPassword = () => {
  const { email } = useParams() 
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const { newPassword, confirmPassword } = formData

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   setErrorMessage('')
  //   setSuccessMessage('')

  //   if (!newPassword || !confirmPassword) {
  //     setErrorMessage('Please fill in all fields.')
  //     return
  //   }
  //   if (newPassword !== confirmPassword) {
  //     setErrorMessage('Passwords do not match.')
  //     return
  //   }
  //   if (!email) {
  //     setErrorMessage('User email parameter is missing from the URL.')
  //     return
  //   }

  //   setLoading(true)

  //   try {
  //     // Corrected single object request body configuration
  //     const response = await axios.post("http://localhost:3005/api/v1/user/reset-password", { 
  //       email, 
  //       newPassword,
  //       confirmPassword
  //     })

  //     setSuccessMessage(response.data.message || 'Password Updated Successfully!')
  //     setFormData({ newPassword: '', confirmPassword: '' })
      
  //     setTimeout(() => {
  //       navigate('/login')
  //     }, 2000)

  //   } catch (error) {
  //     const backendMessage = error.response?.data?.message || 'Something went wrong.'
  //     setErrorMessage(backendMessage)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    // Client-side validations
    if (!newPassword || !confirmPassword) {
      setErrorMessage('Please fill in all fields.')
      return
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.')
      return
    }
    if (!email) {
      setErrorMessage('User email parameter is missing from the URL.')
      return
    }

    setLoading(true)

    try {
      // 1. Updated URL to pass email into the path parameters so req.params works
      const apiUrl = `http://localhost:3005/api/v1/user/reset-password/${encodeURIComponent(email)}`
      
      // 2. Sent only the password data inside the request body
      const response = await axios.post(apiUrl, { 
        newPassword,
        confirmPassword
      })

      // Axios automatically parses JSON, check response data structures
      if (response.data.success) {
        setSuccessMessage(response.data.message || 'Password Updated Successfully!')
        setFormData({ newPassword: '', confirmPassword: '' })
        
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } else {
        setErrorMessage(response.data.message || 'Something went wrong.')
      }

    } catch (error) {
      const backendMessage = error.response?.data?.message || 'Something went wrong.'
      setErrorMessage(backendMessage)
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg space-y-6 rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
        
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Set New Password</h2>
          <p className="text-sm text-gray-500">
            Create a secure password for your account:<br/>
            <span className="font-semibold text-gray-900">{email || 'your email'}</span>
          </p>
        </div>

        {errorMessage && (
          <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-sm font-medium text-red-600 capitalize text-center">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="rounded-xl bg-green-50 border border-green-100 p-3 text-sm font-medium text-green-600 capitalize text-center">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">New Password</label>
            <input
              type="password"
              name="newPassword"
              placeholder="••••••••"
              disabled={loading}
              value={newPassword}
              onChange={handleChange}
              className="w-full h-12 px-4 rounded-xl border border-gray-200 text-base text-gray-900 shadow-sm outline-none transition-all focus:border-pink-500 focus:ring-2 focus:ring-pink-100 disabled:opacity-50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              disabled={loading}
              value={confirmPassword}
              onChange={handleChange}
              className="w-full h-12 px-4 rounded-xl border border-gray-200 text-base text-gray-900 shadow-sm outline-none transition-all focus:border-pink-500 focus:ring-2 focus:ring-pink-100 disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-pink-600 py-3 text-sm font-semibold text-white shadow-sm hover:bg-pink-700 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 disabled:bg-pink-400 mt-2"
          >
            {loading ? 'Updating Password...' : 'Reset Password'}
          </button>
        </form>

      </div>
    </div>
  )
}

export default ResetPassword
