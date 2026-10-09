import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { setcart } from "@/redux/productSlice";
import axios from "axios";
import { ShoppingCart, Trash, Trash2 } from "lucide-react";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Cart = () => {
  const navigate = useNavigate();
  const { cart } = useSelector((store) => store.product);

  const subtotal = cart?.totalPrice;

  const shipping = subtotal > 50000 ? 0 : 150;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

const API = "http://localhost:3005/api/v1/cart";
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();

  // const handleUpdatQuantity = async (productId, type) => {
  //   try {
  //     const res = await axios.put(
  //       `${API}/update-quantity`,
  //       { productId, type },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       },
  //     );
  //     if (res.data.success) {
  //       toast("updated quantity");
  //       dispatch(setcart(res.data.cart));
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("error while updating quantity");
  //   }
  // };


  const handleUpdateQuantity = async (productId, type) => {
  try {
    const res = await axios.put(
      `${API}/update-quantity`,
      {
        productId,
        type,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (res.data.success) {
      toast.success("Quantity updated");
      dispatch(setcart(res.data.cart));
    }
  } catch (error) {
    console.log("UPDATE CART ERROR:", error.response?.data || error.message);
    toast.error(
      error.response?.data?.message || "Error while updating quantity"
    );
  }
};
const handleRemoveFromCart = async (productId) => {
  try {
    const res = await axios.delete(`${API}/remove-from-cart`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: { productId },
    });

    if (res.data.success) {
      toast.success("Item removed from cart");
      dispatch(setcart(res.data.cart));
    }
  } catch (error) {
    console.log("REMOVE FROM CART ERROR:", error.response?.data || error.message);
    toast.error(
      error.response?.data?.message || "Error while removing item from cart"
    );
  }
};


// Wrap getcart in useCallback to prevent it from recreating on every render
const getcart = useCallback(async () => {
  try {
    const res = await axios.get(`${API}/get-cart`,{
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    if (res.data.success) {
      toast.success(res.data.message)
      dispatch(setcart(res.data.cart))
    }
  } catch (error) {
    console.log(error)
  }
}, [accessToken, dispatch]) // Re-run only if these change

useEffect(() => {
  getcart()
}, [getcart]) // Safe to depend on getcart now

  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      {cart?.items?.length ? (
        <div className="max-w-7xl mx-auto">
          <h1 className="text-1xl font-bold mt-5 text-gray-800 mb-7">
            SHOPPING CART
          </h1>
          <div className="max-w-7xl mx-auto flex gap-7">
            <div className="flex flex-col gap-5 flex-1">
              {cart?.items.map((product, index) => {
                return (
                  <Card key={index} className="">
                    <div className="flex justify-between items-center pt-7">
                      <div className="flex items-center w-[550x] ">
                        <img
                          src={product?.productId?.productImages?.[0]?.url}
                          alt=""
                        />
                        <div className="w-[280px]">
                          <h1 className="font-semibold truncate">
                            {" "}
                            {product?.productId?.productName}
                          </h1>
                          <p className="">
                            PKR {product?.productId?.productPrice}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4 items-center">
                        <Button
                          onClick={() =>
                            handleUpdateQuantity(product?.productId?._id, "decrement")
                          }
                          variant="outline"
                        >
                          -
                        </Button>
                        <span>{product?.quantity}</span>
                        <Button
                          onClick={() =>
                            handleUpdateQuantity(product?.productId?._id, "increment")
                          }
                          variant="outline"
                        >
                          +
                        </Button>
                      </div>
                      <p>
                        {product?.productId?.productPrice * product?.quantity}
                      </p>
                      <p className="flex text-red-500 items-center gap-1 cursor-pointer "
                        onClick={() => handleRemoveFromCart(product?.productId?._id)}
                      >
                        <Trash2 className="w-4 h-4"></Trash2>Remove
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>
            <div>
              <Card className="w-[400px]">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({cart?.items?.length} items)</span>
                    <span>pkr {cart?.totalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>pkr {shipping}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (5%)</span>
                    <span>pkr {tax}</span>
                  </div>
                  <Separator></Separator>

                  <div className="space-y-3 pt-4">
                    <div className="flex space-x-2">
                      <Input placeholder="Promo Code"></Input>
                      <Button variant="outline">Apply</Button>
                    </div>
                    <Button className="w-full bg-pink-600 ">Place Order</Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Link to={"/products"}>Continue Shopping</Link>
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground pt-4">
                    <p>* Free Shipping On Order Over 50000</p>
                    <p>* 30 Days Return Policy</p>
                    <p>* Secure Checkout With SSL Encrpytion</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h[60vh] p-6  text-center ">
          <div className="bg-pink-100 p-6 rounded-full flex flex-col items-center justify-center">
            <ShoppingCart className="w-16 h-16 text-pink-600 "></ShoppingCart>
            <h2 className="mt-6 text-2xl font-bold text-gray-800">
              Your Cart Is Empty{" "}
            </h2>
            <p className="mt-2 text-gray-600 ">
              looks like you haven't added anything to your cart yet
            </p>
            <Button
              onClick={() => navigate("/products")}
              className="mt-6 cursor-pointer bg-pink-600 text-center"
            >
              products
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
