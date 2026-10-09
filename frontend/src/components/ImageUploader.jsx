import React, { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { X } from "lucide-react";

const ImageUploader = ({ product, setproduct }) => {
  const [previews, setPreviews] = useState([]);

  // ==========================================
  // CREATE PREVIEWS
  // ==========================================

  useEffect(() => {
    if (!product?.productImages?.length) {
      setPreviews([]);
      return;
    }

    const objectUrls = [];

    const previewImages = product.productImages.map((image) => {
      // New uploaded File
      if (image instanceof File) {
        const url = URL.createObjectURL(image);
        objectUrls.push(url);

        return {
          url,
          isNew: true,
        };
      }

      // Existing Cloudinary image
      if (image?.url) {
        return {
          url: image.url,
          isNew: false,
        };
      }

      // Existing image as string
      if (typeof image === "string") {
        return {
          url: image,
          isNew: false,
        };
      }

      return null;
    });

    setPreviews(previewImages.filter(Boolean));

    // Cleanup newly created object URLs
    return () => {
      objectUrls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [product?.productImages]);

  // ==========================================
  // SELECT NEW FILES
  // ==========================================

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) {
      return;
    }

    setproduct((prev) => ({
      ...prev,
      productImages: [
        ...(prev?.productImages || []),
        ...files,
      ],
    }));

    // Allow selecting the same file again
    e.target.value = "";
  };

  // ==========================================
  // REMOVE IMAGE
  // ==========================================

  const handleRemoveImage = (indexToRemove) => {
    setproduct((prev) => ({
      ...prev,
      productImages: (prev?.productImages || []).filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  return (
    <div className="grid gap-2">
      <Label>Product Images</Label>

      {/* ======================================
          FILE INPUT
      ====================================== */}

      <Input
        type="file"
        id="product-file-uploader"
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleFileChange}
      />

      <Button
        variant="outline"
        asChild
        type="button"
      >
        <label
          htmlFor="product-file-uploader"
          className="cursor-pointer w-full h-10 flex items-center justify-center"
        >
          Upload Images
        </label>
      </Button>

      {/* ======================================
          IMAGE PREVIEWS
      ====================================== */}

      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mt-3 sm:grid-cols-3">
          {previews.map((image, index) => (
            <Card
              key={`${image.url}-${index}`}
              className="relative group overflow-hidden"
            >
              <CardContent className="p-2 relative">

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() =>
                    handleRemoveImage(index)
                  }
                  className="absolute top-3 right-3 bg-red-600 text-white rounded-full p-1 z-10 opacity-80 hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>

                {/* Image */}
                <img
                  src={image.url}
                  alt={`product-preview-${index}`}
                  className="w-full h-32 object-cover rounded-md"
                />

                {/* New image label */}
                {image.isNew && (
                  <span className="absolute bottom-3 left-3 bg-green-600 text-white text-xs px-2 py-1 rounded">
                    New
                  </span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No images */}
      {previews.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          No images selected
        </p>
      )}
    </div>
  );
};

export default ImageUploader;