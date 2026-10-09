import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Edit, Search, Trash } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import ImageUploader from "@/components/ImageUploader";
import { setproducts } from "@/redux/productSlice";

const AdminProducts = () => {
  const dispatch = useDispatch();

  const accessToken = localStorage.getItem("accessToken");

  const { products = [] } = useSelector((store) => store.product);

  const [editproduct, seteditproducts] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // =========================
  // SEARCH + SORT
  // =========================

  const processedProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (searchTerm.trim() !== "") {
      result = result.filter((product) =>
        product?.productName?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Sort
    if (sortOrder === "LowToHigh") {
      result.sort(
        (a, b) => Number(a?.productPrice || 0) - Number(b?.productPrice || 0),
      );
    }

    if (sortOrder === "HighToLow") {
      result.sort(
        (a, b) => Number(b?.productPrice || 0) - Number(a?.productPrice || 0),
      );
    }

    return result;
  }, [products, searchTerm, sortOrder]);

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    seteditproducts((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // SAVE PRODUCT
  // =========================

  const handleSave = async (e) => {
    e.preventDefault();

    if (!editproduct) {
      toast.error("No product selected");
      return;
    }

    try {
      setIsSaving(true);

      const formData = new FormData();

      // Basic fields
      formData.append("productName", editproduct.productName || "");

      formData.append("productPrice", editproduct.productPrice || "");

      formData.append(
        "productDescription",
        editproduct.productDescription || "",
      );

      formData.append("category", editproduct.category || "");

      formData.append("brand", editproduct.brand || "");

      // =========================
      // IMAGES
      // =========================

      const images = editproduct.productImage || [];

      // Existing Cloudinary images
      const existingImages = images
        .filter((img) => !(img instanceof File) && img?.public_id)
        .map((img) => img.public_id);

      formData.append("existingImage", JSON.stringify(existingImages));

      // New uploaded images
      images
        .filter((img) => img instanceof File)
        .forEach((file) => {
          formData.append("files", file);
        });

      // =========================
      // API REQUEST
      // =========================

      const res = await axios.put(
        `http://localhost:3005/api/v1/products/update/${editproduct._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        toast.success("Product updated successfully");

        // Update Redux products
        const updatedProducts = products.map((product) =>
          product._id === editproduct._id ? res.data.product : product,
        );

        dispatch(setproducts(updatedProducts));

        // Close dialog / clear selected product
        seteditproducts(null);
      }
    } catch (error) {
      console.error("UPDATE PRODUCT ERROR:", error);

      toast.error(error?.response?.data?.message || "Failed to update product");
    } finally {
      setIsSaving(false);
    }
  };

  // =========================
  // DELETE PRODUCT
  // =========================

  const handleDelete = async (productId) => {
    try {
      const res = await axios.delete(
        `http://localhost:3005/api/v1/products/delete/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        toast.success("Product deleted successfully");

        const updatedProducts = products.filter(
          (product) => product._id !== productId,
        );

        dispatch(setproducts(updatedProducts));
      }
    } catch (error) {
      console.error("DELETE PRODUCT ERROR:", error);

      toast.error(error?.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <div className="pl-[350px] py-20 pr-20 flex flex-col gap-3 min-h-screen bg-gray-100">
      {/* =========================
          TOP BAR
      ========================= */}

      <div className="flex justify-between items-center">
        {/* Search */}
        <div className="relative bg-white rounded-lg">
          <Input
            type="text"
            placeholder="Search products..."
            className="w-[400px] pr-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
        </div>

        {/* Sort */}
        <Select
          value={sortOrder}
          onValueChange={(value) => setSortOrder(value)}
        >
          <SelectTrigger className="w-[200px] bg-white">
            <SelectValue placeholder="Sort by price" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectItem value="LowToHigh">Price low to high</SelectItem>

              <SelectItem value="HighToLow">Price high to low</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* =========================
          PRODUCT LIST
      ========================= */}

      {processedProducts.length > 0 ? (
        processedProducts.map((product, index) => (
          <Card key={product?._id || index} className="p-4">
            <div className="flex items-center justify-between">
              {/* Product information */}
              <div className="flex gap-4 items-center">
                {/* Image */}
                <img
                  src={
                    product?.productImages?.[0]?.url ||
                    "https://placehold.co/100x100"
                  }
                  alt={product?.productName || "Product"}
                  className="w-20 h-20 object-cover rounded"
                />

                {/* Name */}
                <div>
                  <h1 className="font-semibold text-lg">
                    {product?.productName}
                  </h1>

                  <p className="text-sm text-gray-500">{product?.brand}</p>

                  <p className="text-sm text-gray-500">{product?.category}</p>
                </div>
              </div>

              {/* Price + buttons */}
              <div className="flex items-center gap-5">
                <h1 className="font-semibold text-gray-800">
                  PKR {product?.productPrice}
                </h1>

                <div className="flex gap-3">
                  {/* =========================
                      EDIT DIALOG
                  ========================= */}

                  <Dialog
                    onOpenChange={(open) => {
                      if (!open) {
                        seteditproducts(null);
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          seteditproducts({
                            ...product,
                            productImages: product.productImages || [],
                          })
                        }
                      >
                        <Edit className="text-green-500" />
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-md">
                      <form onSubmit={handleSave}>
                        <DialogHeader>
                          <DialogTitle>Edit Product</DialogTitle>

                          <DialogDescription>
                            Make changes to your product here. Click save when
                            you're done.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-1">
                          {/* Product Name */}
                          <div className="grid gap-2">
                            <Label htmlFor="productName">Product Name</Label>

                            <Input
                              id="productName"
                              name="productName"
                              type="text"
                              value={editproduct?.productName || ""}
                              onChange={handleChange}
                              required
                            />
                          </div>

                          {/* Price + Brand */}
                          <div className="grid grid-cols-2 gap-4">
                            {/* Price */}
                            <div className="grid gap-2">
                              <Label htmlFor="productPrice">Price</Label>

                              <Input
                                id="productPrice"
                                name="productPrice"
                                type="number"
                                value={editproduct?.productPrice || ""}
                                onChange={handleChange}
                                required
                              />
                            </div>

                            {/* Brand */}
                            <div className="grid gap-2">
                              <Label htmlFor="brand">Brand</Label>

                              <Input
                                id="brand"
                                name="brand"
                                type="text"
                                value={editproduct?.brand || ""}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>

                          {/* Category */}
                          <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>

                            <Input
                              id="category"
                              name="category"
                              type="text"
                              value={editproduct?.category || ""}
                              onChange={handleChange}
                              required
                            />
                          </div>

                          {/* Description */}
                          <div className="grid gap-2">
                            <Label htmlFor="productDescription">
                              Description
                            </Label>

                            <textarea
                              id="productDescription"
                              name="productDescription"
                              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              value={editproduct?.productDescription || ""}
                              onChange={handleChange}
                            />
                          </div>

                          {/* Image uploader */}
                          <div className="grid gap-2">
                            <Label>Product Images</Label>

                            <ImageUploader
                              product={editproduct}
                              setproduct={seteditproducts}
                            />
                          </div>
                        </div>

                        {/* Footer */}
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant="outline">
                              Cancel
                            </Button>
                          </DialogClose>

                          <Button type="submit" disabled={isSaving}>
                            {isSaving ? "Saving..." : "Save changes"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>

                  {/* =========================
                      DELETE BUTTON
                  ========================= */}

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(product._id)}
                  >
                    <Trash className="text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))
      ) : (
        <div className="text-center py-10 text-gray-500">
          No products found.
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
