import React, { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom' // 1. Import useParams hook

const VerifyOtp = () => {
  // 2. Automatically grab the "email" variable straight from your route path parameter
  const { email } = useParams() 
  
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const inputRefs = useRef([])

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false

    const newOtp = [...otp]
    newOtp[index] = element.value
    setOtp(newOtp)

    if (element.value !== '' && index < 5) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const navigate = useNavigate() // 3. Initialize the navigate function
  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    
    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp]
      pastedData.split('').forEach((char, index) => {
        if (index < 6) newOtp[index] = char
      })
      setOtp(newOtp)
      
      const targetIndex = pastedData.length < 6 ? pastedData.length : 5
      inputRefs.current[targetIndex].focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    
    const otpCode = otp.join('')
    
    if (otpCode.length < 6) {
      setErrorMessage('Please enter all 6 digits.')
      return
    }

    if (!email) {
      setErrorMessage('User email parameter is missing from the URL.')
      return
    }

    setLoading(true)

    try {
      // 3. The 'email' variable matches your path variable perfectly now
      const apiUrl = `http://localhost:3005/api/v1/user/verify-otp/${encodeURIComponent(email)}`
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp: otpCode }), 
      })

      const data = await response.json()

      if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Something went wrong.')
      }

      setSuccessMessage(data.message || 'OTP Verified Successfully!')
    setTimeout(()=>{
    navigate(`/change-password/${email}`)
  },2000)
      
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg space-y-6 rounded-2xl bg-white p-8 shadow-sm border border-gray-100 text-center">
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Account Verification</h2>
          <p className="text-sm text-gray-500">
            Please type the 6-digit confirmation token sent to:<br/>
            <span className="font-semibold text-gray-900">{email || 'your email'}</span>
          </p>
        </div>

        {errorMessage && (
          <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-sm font-medium text-red-600 capitalize">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="rounded-xl bg-green-50 border border-green-100 p-3 text-sm font-medium text-green-600 capitalize">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                disabled={loading}
                value={digit}
                ref={(el) => (inputRefs.current[index] = el)}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl border border-gray-200 text-center text-xl font-semibold text-gray-900 shadow-sm outline-none transition-all focus:border-pink-500 focus:ring-2 focus:ring-pink-100 disabled:opacity-50"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-pink-600 py-3 text-sm font-semibold text-white shadow-sm hover:bg-pink-700 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 disabled:bg-pink-400"
          >
            {loading ? 'Validating Token...' : 'Verify OTP'}
          </button>
        </form>

        <div className="text-sm">
          <span className="text-gray-500">Didn't receive code? </span>
          <button 
            type="button"
            disabled={loading}
            className="font-semibold text-pink-600 hover:text-pink-700 transition-colors disabled:opacity-50"
          >
            Resend Code
          </button>
        </div>

      </div>
    </div>
  )
}

export default VerifyOtp
