import React, { useState, useEffect } from 'react'

const ProductImage = ({ images = [] }) => {
  // Use a free online placeholder if the array is empty
  const placeholder = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIVQOt-9G5UlfqH-mzgSK983qIgSI6QKyPK5w43UFIHA&s'
  
  // FIX 1: Safely handle if images[0] is an object with .url, a plain string, or missing entirely
  const getImageUrl = (img) => {
    if (!img) return placeholder;
    return typeof img === 'object' ? img.url : img;
  }

  const [mainImage, setMainImage] = useState(placeholder)

  // FIX 2: Set the image when data arrives, fallback to placeholder if empty
  useEffect(() => {
    if (images && images.length > 0) {
      setMainImage(getImageUrl(images[0]))
    } else {
      setMainImage(placeholder)
    }
  }, [images])

  // REMOVED the 'if (images.length === 0) return ...' block so the component always renders

  return (
    <div className='flex gap-5'>
      {/* Thumbnail column - only shows if you actually have images */}
      {images.length > 0 && (
        <div className="gap-5 flex flex-col">
          {images.map((img, index) => {
            const imgSrc = getImageUrl(img);
            return (
              <img 
                key={index}
                src={imgSrc} 
                alt='thumbnail' 
                onClick={() => setMainImage(imgSrc)}
                className={`cursor-pointer w-20 h-20 border shadow-lg ${mainImage === imgSrc ? 'border-blue-500' : ''}`}
              />
            )
          })}
        </div>
      )}

      {/* Main Image Display */}
      <div className="w-96 h-96 border shadow-md rounded">
        <img src={mainImage} alt="Main product" className="w-full h-full object-cover" />
      </div>
    </div>
  )
}

export default ProductImage
