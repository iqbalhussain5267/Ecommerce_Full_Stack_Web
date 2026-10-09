import { Input } from '@/components/ui/input'
import axios from 'axios'
import {
  ArrowLeft,
  Camera,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
  RefreshCw,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import logo from '../../assets/logo.png'

const AdminEditUser = () => {
  const { userId } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [profileFile, setProfileFile] = useState(null)
  const [profilePreview, setProfilePreview] = useState('')

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  })

  // =========================================================
  // GET USER
  // =========================================================
  const getUser = async () => {
    const accessToken = localStorage.getItem('accessToken')

    if (!userId) {
      setError('User ID is missing.')
      setLoading(false)
      return
    }

    if (!accessToken) {
      setError('Authentication token not found. Please login again.')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')

      console.log('Getting user:', userId)

      const res = await axios.get(
        `http://localhost:3005/api/v1/user/getuser/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          timeout: 10000,
        }
      )

      console.log('User response:', res.data)

      if (!res.data?.success) {
        throw new Error(
          res.data?.message || 'Unable to get user information.'
        )
      }

      /*
       * Your backend may return:
       *
       * res.data.user
       *
       * If your controller returns the user directly,
       * this also handles that case.
       */
      const user =
        res.data?.user ||
        res.data?.data ||
        null

      if (!user) {
        throw new Error('User information was not found.')
      }

      // -------------------------------------------------------
      // SET FORM
      // -------------------------------------------------------
      setFormData({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        city: user?.city || '',
        state: user?.state || '',
        zipCode: user?.zipCode || '',
      })

      // -------------------------------------------------------
      // PROFILE IMAGE
      // -------------------------------------------------------
      setProfilePreview(
        user?.profilePic ||
        user?.profilePi ||
        user?.profileImage ||
        ''
      )

    } catch (err) {
      console.log('GET USER ERROR:', err)

      if (err.code === 'ECONNABORTED') {
        setError(
          'The server took too long to respond. Please check that your backend is running.'
        )
      } else if (err.response) {
        console.log('Status:', err.response.status)
        console.log('Response:', err.response.data)

        setError(
          err.response?.data?.message ||
          `Server error (${err.response.status}).`
        )
      } else if (err.request) {
        setError(
          'Unable to connect to the server. Make sure your backend is running on port 3005.'
        )
      } else {
        setError(
          err.message ||
          'Unable to load user information.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  // =========================================================
  // LOAD USER
  // =========================================================
  useEffect(() => {
    getUser()

    // Cleanup object URL when component unmounts
    return () => {
      if (profilePreview?.startsWith('blob:')) {
        URL.revokeObjectURL(profilePreview)
      }
    }
  }, [userId])

  // =========================================================
  // INPUT CHANGE
  // =========================================================
  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Remove old messages when editing
    setError('')
    setSuccess('')
  }

  // =========================================================
  // PROFILE IMAGE
  // =========================================================
  const handleProfileChange = (e) => {
    const file = e.target.files?.[0]

    if (!file) return

    // Check image
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.')
      return
    }

    // 5MB max
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB.')
      return
    }

    setError('')
    setSuccess('')

    // Remove previous preview URL
    if (profilePreview?.startsWith('blob:')) {
      URL.revokeObjectURL(profilePreview)
    }

    const preview = URL.createObjectURL(file)

    setProfileFile(file)
    setProfilePreview(preview)
  }

  // =========================================================
  // SAVE USER
  // =========================================================
  const handleSubmit = async (e) => {
    e.preventDefault()

    const accessToken = localStorage.getItem('accessToken')

    if (!accessToken) {
      setError('Authentication token not found. Please login again.')
      return
    }

    if (!userId) {
      setError('User ID is missing.')
      return
    }

    // Basic validation
    if (!formData.firstName.trim()) {
      setError('First name is required.')
      return
    }

    if (!formData.lastName.trim()) {
      setError('Last name is required.')
      return
    }

    if (!formData.email.trim()) {
      setError('Email address is required.')
      return
    }

    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const data = new FormData()

      data.append(
        'firstName',
        formData.firstName.trim()
      )

      data.append(
        'lastName',
        formData.lastName.trim()
      )

      data.append(
        'email',
        formData.email.trim()
      )

      data.append(
        'phone',
        formData.phone.trim()
      )

      data.append(
        'address',
        formData.address.trim()
      )

      data.append(
        'city',
        formData.city.trim()
      )

      data.append(
        'state',
        formData.state.trim()
      )

      data.append(
        'zipCode',
        formData.zipCode.trim()
      )

      // Only send image when changed
      if (profileFile) {
        data.append('profilePic', profileFile)
      }

      console.log('Updating user:', userId)

      const res = await axios.put(
        `http://localhost:3005/api/v1/user/update/${userId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          timeout: 15000,
        }
      )

      console.log('Update response:', res.data)

      if (!res.data?.success) {
        throw new Error(
          res.data?.message ||
          'Unable to update user.'
        )
      }

      setSuccess(
        res.data?.message ||
        'User information updated successfully.'
      )

      // Clear selected image
      setProfileFile(null)

      // Go back after success
      setTimeout(() => {
        navigate('/dashboard/users')
      }, 1200)

    } catch (err) {
      console.log('UPDATE USER ERROR:', err)

      if (err.code === 'ECONNABORTED') {
        setError(
          'The server took too long to respond.'
        )
      } else if (err.response) {
        console.log(
          'Update status:',
          err.response.status
        )

        console.log(
          'Update response:',
          err.response.data
        )

        setError(
          err.response?.data?.message ||
          `Unable to update user (${err.response.status}).`
        )
      } else if (err.request) {
        setError(
          'No response from server. Please check your backend.'
        )
      } else {
        setError(
          err.message ||
          'Unable to update user.'
        )
      }
    } finally {
      setSaving(false)
    }
  }

  // =========================================================
  // LOADING SCREEN
  // =========================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pl-[350px] pt-[140px] pr-10">

        <div className="
          flex
          min-h-[500px]
          items-center
          justify-center
        ">

          <div className="
            flex
            flex-col
            items-center
            gap-5
          ">

            <div className="
              h-12
              w-12
              animate-spin
              rounded-full
              border-4
              border-pink-100
              border-t-pink-500
            " />

            <p className="
              text-sm
              font-medium
              text-slate-500
            ">
              Loading user information...
            </p>

          </div>

        </div>

      </div>
    )
  }

  // =========================================================
  // MAIN PAGE
  // =========================================================
  return (
    <div className="
      min-h-screen
      bg-slate-50
      pl-[350px]
      pt-[140px]
      pr-10
      pb-12
    ">

      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="
        mb-8
        flex
        items-center
        justify-between
      ">

        <div className="
          flex
          items-center
          gap-4
        ">

          <button
            type="button"
            onClick={() => navigate('/dashboard/users')}
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              border
              border-slate-200
              bg-white
              text-slate-600
              shadow-sm
              transition
              hover:border-pink-200
              hover:bg-pink-50
              hover:text-pink-500
            "
          >
            <ArrowLeft size={19} />
          </button>

          <div>

            <h1 className="
              text-3xl
              font-bold
              tracking-tight
              text-slate-900
            ">
              Edit User
            </h1>

            <p className="
              mt-1
              text-sm
              text-slate-500
            ">
              Update user account information
            </p>

          </div>

        </div>

        {/* Refresh */}
        <button
          type="button"
          onClick={getUser}
          disabled={loading}
          className="
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-slate-200
            bg-white
            px-4
            py-2.5
            text-sm
            font-medium
            text-slate-600
            shadow-sm
            transition
            hover:bg-slate-50
          "
        >
          <RefreshCw size={16} />

          Refresh
        </button>

      </div>

      {/* =====================================================
          SUCCESS MESSAGE
      ====================================================== */}
      {success && (
        <div className="
          mb-6
          rounded-xl
          border
          border-green-200
          bg-green-50
          px-5
          py-4
          text-sm
          font-medium
          text-green-600
        ">
          {success}
        </div>
      )}

      {/* =====================================================
          ERROR MESSAGE
      ====================================================== */}
      {error && (
        <div className="
          mb-6
          rounded-xl
          border
          border-red-200
          bg-red-50
          px-5
          py-4
          text-sm
          font-medium
          text-red-600
        ">

          <p>{error}</p>

          <button
            type="button"
            onClick={getUser}
            className="
              mt-2
              text-sm
              font-semibold
              text-red-700
              underline
            "
          >
            Try again
          </button>

        </div>
      )}

      {/* =====================================================
          FORM
      ====================================================== */}
      <form onSubmit={handleSubmit}>

        <div className="
          grid
          grid-cols-1
          gap-6
          xl:grid-cols-3
        ">

          {/* =================================================
              PROFILE CARD
          ================================================== */}
          <div className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
          ">

            <h2 className="
              text-lg
              font-semibold
              text-slate-900
            ">
              Profile
            </h2>

            <p className="
              mt-1
              text-sm
              text-slate-400
            ">
              Manage user profile
            </p>

            {/* IMAGE */}
            <div className="
              mt-8
              flex
              flex-col
              items-center
            ">

              <div className="relative">

                <img
                  src={profilePreview || logo}
                  alt="User profile"
                  className="
                    h-32
                    w-32
                    rounded-full
                    border-4
                    border-pink-100
                    bg-slate-100
                    object-cover
                    shadow-sm
                  "
                  onError={(e) => {
                    e.currentTarget.src = logo
                  }}
                />

                {/* Camera */}
                <label
                  htmlFor="profilePic"
                  className="
                    absolute
                    bottom-1
                    right-1
                    flex
                    h-10
                    w-10
                    cursor-pointer
                    items-center
                    justify-center
                    rounded-full
                    border-2
                    border-white
                    bg-pink-500
                    text-white
                    shadow-md
                    transition
                    hover:bg-pink-600
                  "
                >

                  <Camera size={17} />

                  <input
                    id="profilePic"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    className="hidden"
                    onChange={handleProfileChange}
                  />

                </label>

              </div>

              <p className="
                mt-4
                text-center
                text-xs
                text-slate-400
              ">
                JPG, PNG or WEBP
                <br />
                Maximum 5MB
              </p>

              <h3 className="
                mt-4
                text-lg
                font-semibold
                capitalize
                text-slate-900
              ">
                {formData.firstName || 'User'}{' '}
                {formData.lastName}
              </h3>

              <p className="
                mt-1
                max-w-[220px]
                truncate
                text-sm
                text-slate-400
              ">
                {formData.email || 'No email'}
              </p>

            </div>

            {/* USER ID */}
            <div className="
              mt-8
              rounded-xl
              bg-slate-50
              p-4
            ">

              <p className="
                text-xs
                font-medium
                text-slate-400
              ">
                User ID
              </p>

              <p className="
                mt-1
                break-all
                text-xs
                font-medium
                text-slate-600
              ">
                {userId}
              </p>

            </div>

          </div>

          {/* =================================================
              INFORMATION CARD
          ================================================== */}
          <div className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
            xl:col-span-2
          ">

            {/* PERSONAL INFORMATION */}
            <div>

              <h2 className="
                text-lg
                font-semibold
                text-slate-900
              ">
                Personal Information
              </h2>

              <p className="
                mt-1
                text-sm
                text-slate-400
              ">
                Update the user's basic information
              </p>

            </div>

            <div className="
              mt-6
              grid
              grid-cols-1
              gap-5
              md:grid-cols-2
            ">

              {/* FIRST NAME */}
              <div>

                <label className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-slate-700
                ">
                  First Name
                </label>

                <div className="relative">

                  <User
                    size={17}
                    className="
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <Input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    className="
                      h-11
                      rounded-xl
                      border-slate-200
                      pl-10
                      focus-visible:border-pink-400
                      focus-visible:ring-pink-100
                    "
                  />

                </div>

              </div>

              {/* LAST NAME */}
              <div>

                <label className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-slate-700
                ">
                  Last Name
                </label>

                <div className="relative">

                  <User
                    size={17}
                    className="
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <Input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    className="
                      h-11
                      rounded-xl
                      border-slate-200
                      pl-10
                      focus-visible:border-pink-400
                      focus-visible:ring-pink-100
                    "
                  />

                </div>

              </div>

              {/* EMAIL */}
              <div>

                <label className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-slate-700
                ">
                  Email Address
                </label>

                <div className="relative">

                  <Mail
                    size={17}
                    className="
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    className="
                      h-11
                      rounded-xl
                      border-slate-200
                      pl-10
                      focus-visible:border-pink-400
                      focus-visible:ring-pink-100
                    "
                  />

                </div>

              </div>

              {/* PHONE */}
              <div>

                <label className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-slate-700
                ">
                  Phone Number
                </label>

                <div className="relative">

                  <Phone
                    size={17}
                    className="
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <Input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    className="
                      h-11
                      rounded-xl
                      border-slate-200
                      pl-10
                      focus-visible:border-pink-400
                      focus-visible:ring-pink-100
                    "
                  />

                </div>

              </div>

            </div>

            {/* =================================================
                ADDRESS
            ================================================== */}
            <div className="
              mt-8
              border-t
              border-slate-100
              pt-8
            ">

              <h2 className="
                text-lg
                font-semibold
                text-slate-900
              ">
                Address Information
              </h2>

              <p className="
                mt-1
                text-sm
                text-slate-400
              ">
                Update the user's address
              </p>

              {/* ADDRESS */}
              <div className="mt-6">

                <label className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-slate-700
                ">
                  Address
                </label>

                <div className="relative">

                  <MapPin
                    size={17}
                    className="
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Street address"
                    className="
                      h-11
                      rounded-xl
                      border-slate-200
                      pl-10
                      focus-visible:border-pink-400
                      focus-visible:ring-pink-100
                    "
                  />

                </div>

              </div>

              {/* CITY / STATE / ZIP */}
              <div className="
                mt-5
                grid
                grid-cols-1
                gap-5
                md:grid-cols-3
              ">

                {/* CITY */}
                <div>

                  <label className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-slate-700
                  ">
                    City
                  </label>

                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="
                      h-11
                      rounded-xl
                      border-slate-200
                      focus-visible:border-pink-400
                      focus-visible:ring-pink-100
                    "
                  />

                </div>

                {/* STATE */}
                <div>

                  <label className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-slate-700
                  ">
                    State
                  </label>

                  <Input
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    className="
                      h-11
                      rounded-xl
                      border-slate-200
                      focus-visible:border-pink-400
                      focus-visible:ring-pink-100
                    "
                  />

                </div>

                {/* ZIP */}
                <div>

                  <label className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-slate-700
                  ">
                    ZIP Code
                  </label>

                  <Input
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="ZIP code"
                    className="
                      h-11
                      rounded-xl
                      border-slate-200
                      focus-visible:border-pink-400
                      focus-visible:ring-pink-100
                    "
                  />

                </div>

              </div>

            </div>

            {/* =================================================
                ACTIONS
            ================================================== */}
            <div className="
              mt-8
              flex
              items-center
              justify-end
              gap-3
              border-t
              border-slate-100
              pt-6
            ">

              {/* CANCEL */}
              <button
                type="button"
                onClick={() => navigate('/dashboard/users')}
                disabled={saving}
                className="
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  text-slate-600
                  transition
                  hover:bg-slate-50
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              {/* SAVE */}
              <button
                type="submit"
                disabled={saving}
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-pink-500
                  px-6
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-pink-600
                  active:scale-[0.98]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >

                {saving ? (
                  <>
                    <div className="
                      h-4
                      w-4
                      animate-spin
                      rounded-full
                      border-2
                      border-white/30
                      border-t-white"
                    />

                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={17} />

                    Save Changes
                  </>
                )}

              </button>

            </div>

          </div>

        </div>

      </form>

    </div>
  )
}

export default AdminEditUser
