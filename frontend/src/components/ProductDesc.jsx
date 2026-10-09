import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { setcart } from '@/redux/productSlice'
import axios from 'axios'

const ProductDesc = ({ product }) => {
  const [quantity, setQuantity] = useState(1)
  const dispatch = useDispatch()

  const addToCart = async (productId) => {
    // 1. Fetch token directly inside the function to get the freshest value
    const accessToken = localStorage.getItem('accessToken')

    // 2. Client-side check for the token
    if (!accessToken) {
      toast.error('Please log in to add items to your cart.')
      return
    }

    try {
      // 3. Updated URL to match your backend error route: /api/v1/cart/add-to-cart
      const res = await axios.post(
        'http://localhost:3005/api/v1/cart/add-to-cart',
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )
      if (res.data.success) {
        toast.success(res.data.message)
        dispatch(setcart(res.data.cart))
      }
    } catch (error) {
      console.error(error)
      // Display the specific error message from your backend if available
      const errorMsg = error.response?.data?.message || 'Failed to add item to cart'
      toast.error(errorMsg)
    }
  }

  return (
    <div className="max-w-xl p-6 bg-white rounded-xl shadow-sm border border-pink-100 flex flex-col gap-4">
      <p className="text-xs font-semibold tracking-wider uppercase text-pink-600 bg-pink-50 self-start px-2.5 py-1 rounded-full">
        {product.category} &bull; {product.brand}
      </p>

      <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
        {product.productName}
      </h1>

      <div className="text-3xl font-extrabold text-pink-600">
        {product.productPrice}
      </div>

      <hr className="border-pink-50 my-1" />

      <p className="text-sm leading-relaxed text-gray-600">
        {product.productDescription}
      </p>

      <div className="flex gap-2 items-center w-[300px]">
        <p className="text-gray-800 font-semibold">Quantity</p>
        <Input 
          type="number" 
          className="w-16" 
          value={quantity} 
          min={1}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </div>

      <Button onClick={() => addToCart(product._id)} className="bg-pink-600 w-max">
        Add To Cart
      </Button>
    </div>
  )
}

export default ProductDesc
