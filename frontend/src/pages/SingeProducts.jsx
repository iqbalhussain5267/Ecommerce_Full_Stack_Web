import BreadCrumb from '@/components/BreadCrumb'
import ProductDesc from '@/components/ProductDesc'
import ProductImage from '@/components/ProductImage'


import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const SingeProducts = () => {
  const params=useParams()
  const productId=params.id
  const {products}=useSelector(store=>store.product)

  const product=products.find((item)=>item._id == productId)

  return (
    <div className='pt-20 my-10  max-w-7xl mx-auto'>
<BreadCrumb product={product}></BreadCrumb>
      <div className="mt-10 grid grid-cols-2 items-start">

        <ProductImage images={product?.productImages}></ProductImage>
        <ProductDesc product={product}></ProductDesc>
      </div>
    </div>
  )
}

export default SingeProducts
