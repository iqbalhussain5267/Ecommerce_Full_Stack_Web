import { Input } from '@/components/ui/input'
import axios from 'axios'
import {
  Search,
  Mail,
  Users,
  UserRound,
  Pencil,
  Eye,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  // =========================
  // GET ALL USERS
  // =========================
  const getAllUser = async () => {
    const accessToken = localStorage.getItem('accessToken')

    try {
      setLoading(true)

      const res = await axios.get(
        'http://localhost:3005/api/v1/user/allusers',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      if (res.data.success) {
        setUsers(res.data.users || [])
      }
    } catch (error) {
      console.log('Error getting users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllUser()
  }, [])

  // =========================
  // SEARCH USERS
  // =========================
  const filteredUsers = users.filter((user) => {
    const firstName = user?.firstName || ''
    const lastName = user?.lastName || ''
    const email = user?.email || ''

    const fullName = `${firstName} ${lastName}`.toLowerCase()
    const searchValue = search.toLowerCase()

    return (
      fullName.includes(searchValue) ||
      email.toLowerCase().includes(searchValue)
    )
  })

  // =========================
  // EDIT USER
  // =========================
  const handleEditUser = (userId) => {
    if (!userId) {
      console.log('User ID not found')
      return
    }

    navigate(`/dashboard/user/${userId}`)
  }

  // =========================
  // VIEW USER
  // =========================
  const handleViewUser = (userId) => {
    if (!userId) {
      console.log('User ID not found')
      return
    }

    navigate(`/dashboard/user/${userId}`)
  }

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pl-[350px] pt-[140px] pr-10">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-200 border-t-pink-500" />

            <p className="text-sm text-slate-500">
              Loading users...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pl-[350px] pt-[140px] pr-10 pb-12">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}
      <div className="mb-8 flex items-start justify-between gap-6">

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Users Management
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            View and manage all registered users
          </p>
        </div>

        {/* Total users */}
        <div className="flex shrink-0 items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-100">
            <Users
              size={19}
              className="text-pink-500"
            />
          </div>

          <div>
            <p className="text-xs text-slate-400">
              Total users
            </p>

            <p className="text-lg font-bold text-slate-800">
              {users.length}
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          SEARCH
      ====================================================== */}
      <div className="mb-8 flex items-center gap-6">

        <div className="relative w-full max-w-2xl">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="
              h-12
              w-full
              rounded-xl
              border-slate-200
              bg-white
              pl-12
              pr-4
              text-sm
              shadow-sm
              transition
              focus-visible:border-pink-300
              focus-visible:ring-2
              focus-visible:ring-pink-100
            "
          />
        </div>

        <p className="shrink-0 whitespace-nowrap text-sm text-slate-500">
          Showing{' '}
          <span className="font-semibold text-slate-700">
            {filteredUsers.length}
          </span>{' '}
          {filteredUsers.length === 1 ? 'user' : 'users'}
        </p>
      </div>

      {/* =====================================================
          USERS
      ====================================================== */}
      {filteredUsers.length > 0 ? (

        <div className="
          grid
          grid-cols-1
          gap-6
          xl:grid-cols-2
          2xl:grid-cols-3
        ">

          {filteredUsers.map((user, index) => {

            const profileImage =
              user?.profilePic ||
              user?.profilePi ||
              logo

            const firstName =
              user?.firstName || 'Unknown'

            const lastName =
              user?.lastName || 'User'

            return (
              <div
                key={user?._id || index}
                className="
                  group
                  min-w-0
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-6
                  shadow-sm
                  transition-all
                  duration-200
                  hover:-translate-y-1
                  hover:border-pink-200
                  hover:shadow-lg
                "
              >

                {/* =================================================
                    USER HEADER
                ================================================== */}
                <div className="flex min-w-0 items-start justify-between gap-4">

                  <div className="flex min-w-0 items-center gap-4">

                    {/* Profile */}
                    <div className="relative shrink-0">

                      <img
                        src={profileImage}
                        alt={`${firstName} ${lastName}`}
                        className="
                          h-16
                          w-16
                          rounded-full
                          border-2
                          border-pink-100
                          object-cover
                        "
                        onError={(e) => {
                          e.currentTarget.src = logo
                        }}
                      />

                      <span
                        className="
                          absolute
                          bottom-0
                          right-0
                          h-4
                          w-4
                          rounded-full
                          border-2
                          border-white
                          bg-green-500
                        "
                      />
                    </div>

                    {/* Name */}
                    <div className="min-w-0">

                      <h2 className="
                        truncate
                        text-lg
                        font-semibold
                        capitalize
                        text-slate-900
                      ">
                        {firstName} {lastName}
                      </h2>

                      <p className="mt-1 text-sm text-slate-400">
                        User #{index + 1}
                      </p>

                    </div>
                  </div>

                  {/* Status */}
                  <span className="
                    shrink-0
                    rounded-full
                    bg-green-50
                    px-3
                    py-1.5
                    text-xs
                    font-semibold
                    text-green-600
                  ">
                    Active
                  </span>

                </div>

                {/* Divider */}
                <div className="my-6 border-t border-slate-100" />

                {/* =================================================
                    EMAIL
                ================================================== */}
                <div className="
                  flex
                  min-w-0
                  items-center
                  gap-3
                  rounded-xl
                  bg-slate-50
                  p-4
                ">

                  <div className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-pink-100
                  ">
                    <Mail
                      size={18}
                      className="text-pink-500"
                    />
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="text-xs text-slate-400">
                      Email address
                    </p>

                    <p
                      title={user?.email}
                      className="
                        mt-1
                        truncate
                        text-sm
                        font-medium
                        text-slate-700
                      "
                    >
                      {user?.email || 'No email available'}
                    </p>

                  </div>
                </div>

                {/* =================================================
                    FOOTER BUTTONS
                ================================================== */}
                <div className="mt-5 flex items-center justify-between gap-3">

                  {/* Registered user */}
                  <div className="
                    flex
                    min-w-0
                    items-center
                    gap-2
                    text-sm
                    text-slate-400
                  ">
                    <UserRound
                      size={16}
                      className="shrink-0"
                    />

                    <span className="truncate">
                      Registered user
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="flex shrink-0 items-center gap-2">

                    {/* View */}
                    {/* <button
                      type="button"
                      onClick={() => handleViewUser(user?._id)}
                      className="
                        flex
                        items-center
                        gap-1.5
                        rounded-lg
                        border
                        border-slate-200
                        bg-white
                        px-3
                        py-2
                        text-xs
                        font-medium
                        text-slate-600
                        transition
                        hover:border-slate-300
                        hover:bg-slate-50
                      "
                    >
                      <Eye size={14} />

                      View
                    </button> */}

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => handleEditUser(user?._id)}
                      className="
                        flex
                        items-center
                        gap-1.5
                        rounded-lg
                        bg-pink-500
                        px-3
                        py-2
                        text-xs
                        font-semibold
                        text-white
                        transition
                        hover:bg-pink-600
                        active:scale-95
                      "
                    >
                      <Pencil size={14} />

                      Edit
                    </button>
   <button
                      type="button"
                      onClick={() => handleEditUser(user?._id)}
                      className="
                        flex
                        items-center
                        gap-1.5
                        rounded-lg
                        bg-pink-500
                        px-3
                        py-2
                        text-xs
                        font-semibold
                        text-white
                        transition
                        hover:bg-pink-600
                        active:scale-95
                      "
                    >
                      <Pencil size={14} />

                   show  orders
                    </button>
                  </div>
                </div>

              </div>
            )
          })}

        </div>

      ) : (

        /* =====================================================
           EMPTY STATE
        ====================================================== */
        <div className="
          flex
          min-h-[350px]
          flex-col
          items-center
          justify-center
          rounded-2xl
          border
          border-dashed
          border-slate-300
          bg-white
        ">

          <div className="
            mb-4
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-full
            bg-pink-50
          ">
            <Users
              size={28}
              className="text-pink-400"
            />
          </div>

          <h2 className="
            text-lg
            font-semibold
            text-slate-800
          ">
            No users found
          </h2>

          <p className="
            mt-1
            text-sm
            text-slate-400
          ">
            {search
              ? 'Try changing your search.'
              : 'There are no registered users yet.'}
          </p>

        </div>
      )}

    </div>
  )
}

export default AdminUsers
