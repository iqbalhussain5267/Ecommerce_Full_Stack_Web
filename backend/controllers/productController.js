// import { Product } from "../model/productModel.js";
// import cloudinary from "../utils/cloudinary.js";
// import getDataUri from "../utils/datauri.js";

// export const addpost=async(req,res)=>{
//   try{

// const {productName,productDescription,productPrice,category,brand}=req.body;
// if(!productName || !productDescription || !productPrice || !category || brand){
//   res.status(400).json({
//     success:false,
//     message:"all fields are required "
//     })
// }
// // Hnadle multiple images
// let productImages=[];
// if(req.files && req.files.length >0){
//   for (let file of req.files){
//     const fileUri=getDataUri(file);
//     const result=cloudinary.uploader.upload(fileUri,{
//       folder:"products"
//     });
//     productImages.push({
//       url:result.secure_url,
//       public_id: result.public_id
//     })


//   }
// }

// // create product in db
// const newProduct=await Product.create({
//   userId,
//   productName,
//   productDescription,
//   productPrice,
//   category,
//   brand,
//   productImages
// })
// return res.status(200).json({
//   success:true,
//   message:"products add successfully",
//   product:newProduct
// })
//   }catch(err){
//     res.status(500).json({
//       success:false,
//       message:err.message
//     })
//   }
// }


// export const getallpost=async(_,res)=>{
//   try{
// const products=await Product.find()
// if(!product){
//   return res.status(400).json({
//     success:false,
//   message:"no products available"
//   })
// }return res.status(500).json({
//   success:true,
//   products
// })
//   }catch(err){
//     res.status(500).json({
//       success:false,
//       message:err.message
//     })
//   }
// 


import { Product } from "../model/productModel.js"; 
import cloudinary from "../utils/cloudinary.js"; 
import getDataUri from "../utils/datauri.js"; 

export const addpost = async (req, res) => {
  try {
    const { productName, productDescription, productPrice, category, brand, userId } = req.body; // FIXED: Added userId extraction (or get from req.user if using auth middleware)

    // FIXED: Added missing '!' for brand validation
    if (!productName || !productDescription || !productPrice || !category || !brand) {
      return res.status(400).json({  // FIXED: Added 'return' to halt execution here
        success: false, 
        message: "All fields are required" 
      });
    }

    // Handle multiple images
    let productImages = [];
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const fileUri = getDataUri(file);
        
        // FIXED: Added 'await' to resolve the asynchronous upload promise properly
        const result = await cloudinary.uploader.upload(fileUri, { folder: "products" }); 
        
        productImages.push({ 
          url: result.secure_url, 
          public_id: result.public_id 
        });
      }
    }

    // Create product in database
    const newProduct = await Product.create({ 
      userId, // Ensure this exists or is passed down safely
      productName, 
      productDescription, 
      productPrice, 
      category, 
      brand, 
      productImages 
    });

    return res.status(200).json({ 
      success: true, 
      message: "Product added successfully", 
      product: newProduct 
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getallpost = async (_, res) => {
  try {
    const products = await Product.find();

    // FIXED: Typo variable name mismatch 'product' -> 'products'
    if (!products || products.length === 0) {
      return res.status(404).json({ success: false, message: "No products available" });
    }

    // FIXED: Corrected status code from 500 down to 200 for a successful query
    return res.status(200).json({ success: true, products });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};


export const deletepost=async(req,res)=>{
  try{
    const {productId}=req.params;
    const product=await Product.findById(productId)
   if(!product){
    return res.status(400).json({
      success:false,
      message:"products not found to delete "
    })
   }
  //  delete from cloudinary
  if(product.productImages && product.productImages.length > 0){
    for (let img of product.productImages) {
      const result=await cloudinary.uploader.destroy(img.public_id);    }
  }
  // delete form mongodb
  await Product.findByIdAndDelete(productId);
  return res.status(200).json({
    success:true,
    message:"post deleted "
  })
    }

  catch(err){
    return res.status(500).json({
      success:false,
      message:err.message
    })
  }
}


export const updatedproducts = async (req, res) => {
  try {
    const { productId } = req.params;
    const { productName, productDescription, productPrice, category, brand, existingImage } = req.body; 
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product not found to update"
      });
    }

    // 1. Initialize an array using spread syntax to avoid direct mutation of database fields
    let updatedImages = [];

    // 2. Manage existing images
    if (existingImage) {
      const keepIds = JSON.parse(existingImage);
      
      // Filter out images to keep
      updatedImages = product.productImages.filter((img) =>
        keepIds.includes(img.public_id)
      );

      // Identify and destroy removed images from Cloudinary
      const removedImages = product.productImages.filter(
        (img) => !keepIds.includes(img.public_id)
      );
      
      for (let img of removedImages) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    } else {
      // Create a shallow copy of the existing images array
      updatedImages = [...product.productImages];
    }

    // 3. Upload new images sequentially if files exist
    if (req.files && req.files.length > 0) {
      for (let file of req.files) { // Changed 'img' to 'file' to match the variable inside
        const fileUri = getDataUri(file); 
        const result = await cloudinary.uploader.upload(fileUri.content, { // Note: getDataUri usually returns an object with .content
          folder: "products"
        });
        
        updatedImages.push({
          url: result.secure_url,
          public_id: result.public_id
        });
      }
    }

    // 4. Update the database fields correctly
    product.productName = productName || product.productName;
    product.productDescription = productDescription || product.productDescription;
    product.productPrice = productPrice || product.productPrice;
    product.category = category || product.category;
    product.brand = brand || product.brand; // Fixed missing assignment
    product.productImages = updatedImages; // Fixed spelling and array reference

    // 5. Save and return response
    await product.save();
    
    return res.status(200).json({
      success: true,
      message: "Updated successfully",
      product
    });

  } catch (err) {
    return res.status(500).json({
      success: false, // Fixed typo 'fasle'
      message: err.message
    });
  }
};
