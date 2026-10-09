import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { setcart } from "@/redux/productSlice";
import axios from "axios";
import { ShoppingCart } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ProductsCard = ({ product, loading }) => {
  const { productImages, productPrice, productName } = product;


  const accessToken = localStorage.getItem("accessToken");
 const {cart}=useSelector(store => store.product)
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const addToCart=async(productId)=>{
    try{
const res=await axios.post(`http://localhost:3005/api/v1/cart/add-to-cart`,{productId},{
  headers:{
    Authorization:`Bearer ${accessToken}`
  }
  
})
if(res.data.success){
  toast.success("product added to cart")
  dispatch(setcart(res.data.cart))
}
    }catch(error){
      console.log(error)
      toast.error("error while product added to cart")
    }
  }
  return (
    <div className="shadow-lg rounded-lg overflow-hidden h-max">
      <div className="w-full h-full aspect-square overflow-hidden">
        {loading ? (
          <Skeleton></Skeleton>
        ) : (
          <img
          onClick={()=>navigate(`/products/${product._id}`)}
            src={productImages[0]?.url}
            alt=""
            className="w-full h-full transition-transform duration-300 hover:scale-150"
          />
        )}
        {/* <img
          src={productImages[0]?.url}
          alt=""
          className="w-full h-full transition-transform duration-300 hover:scale-150"
        /> */}
      </div>
      {
        loading ? <div className="px-2 space-y-2 my-2">
          <Skeleton className='w-[200px] h-4'> </Skeleton>
          <Skeleton className='w-[200px] h-4'> </Skeleton>
          <Skeleton className='w-[200px] h-4'> </Skeleton>
           </div> :<div className="px-2 space-y-1">
        <h1 className="font-semibold  h-12 line-clamp-2">{productName}</h1>
        <h2 className="font-semibold">PKR {productPrice} </h2>
        {/* shadcn button  and shoppincart*/}
        <Button onClick={()=>addToCart(product._id)} className="bg-pink-600 mb-3 w-full">
          <ShoppingCart></ShoppingCart>Add To Cart
        </Button>
      </div>
      }
      
    </div>
  );
};

export default ProductsCard;
