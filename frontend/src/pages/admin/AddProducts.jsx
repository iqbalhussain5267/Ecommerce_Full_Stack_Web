import ImageUploader from "@/components/ImageUploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { setproducts } from "@/redux/productSlice";
import { Input } from "@base-ui/react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux"; 
import { toast } from "sonner";

const AddProducts = () => {
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();
  
  const { products } = useSelector((state) => state.product); 
  const [loading, setloading] = useState(false);
  const [product, setproduct] = useState({
    productName: "",
    productPrice: 0,
    productDescription: "",
    productImages: [], // Standardized camelCase key
    brand: "",
    category: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target; 
    setproduct((prev) => ({
      ...prev,
      [name]: name === "productPrice" ? Number(value) : value 
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (product.productImages.length === 0) {
      toast.error("Please select at least one picture");
      return;
    }

    const formData = new FormData();
    formData.append("productName", product.productName);
    formData.append("productPrice", product.productPrice);
    formData.append("productDescription", product.productDescription);
    formData.append("category", product.category);
    formData.append("brand", product.brand);

    // Append images matches server's expected key "files"
    product.productImages.forEach((img) => {
      formData.append("files", img);
    });

    try {
      setloading(true);
      const res = await axios.post("http://localhost:3005/api/v1/products/add", formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data" 
        }
      });

      if (res.data.success) {
   
        toast.success(res.data.message);
        
        if (res.data.product) {
          dispatch(setproducts([...products, res.data.product]));
        }

        // Reset all fields correctly
        setproduct({
          productName: "",
          productPrice: 0,
          productDescription: "",
          productImages: [], // Corrected key on reset
          brand: "",
          category: ""
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message );
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="pl-[530px] py-20 pr-20 mx-auto px-4 bg-gray-100">
      <Card className="w-full my-20">
        <CardHeader>
          <CardTitle>Add products</CardTitle>
          <CardDescription>Enter details below</CardDescription>
        </CardHeader>
        <form onSubmit={submitHandler}>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="grid gap-2">
                <Label>Product Name</Label>
                <Input
                  value={product.productName}
                  onChange={handleChange}
                  type="text"
                  name="productName"
                  placeholder="Ex-iphone"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>Price</Label>
                <Input
                  value={product.productPrice}
                  onChange={handleChange}
                  type="number" 
                  name="productPrice" 
                  placeholder="0"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-2">
                  <Label>Brand</Label>
                  <Input
                    value={product.brand}
                    onChange={handleChange}
                    type="text"
                    name="brand"
                    placeholder="Ex-android"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Category</Label>
                  <Input
                    value={product.category}
                    onChange={handleChange}
                    type="text"
                    name="category"
                    placeholder="Ex-mobile"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label>Description</Label>
                </div>
                <Textarea
                  value={product.productDescription}
                  onChange={handleChange}
                  name="productDescription"
                  placeholder="Enter Brief Description Of Products"
                />
              </div>
              
              {/* Image Uploader integration */}
              <ImageUploader product={product} setproduct={setproduct}/>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button 
              disabled={loading}
              className="w-full bg-pink-600" 
              type="submit"
            >
              {loading ? (
                <span className="flex gap-1 items-center ">
                  <Loader2 className="animate-spin" /> please Wait
                </span>
              ) : (
                "add products"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddProducts;
