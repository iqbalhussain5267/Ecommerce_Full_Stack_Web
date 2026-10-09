import { Cart } from "../model/cartModel.js";
import { Product } from "../model/productModel.js";




export const getCart = async (req, res) => {
  try {
   
    const userId = req.id; 

   
    const cart = await  Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: { items: [], totalPrice: 0 } 
      });
    }

    return res.status(200).json({
      success: true,
      message:"fetch products",
      cart,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


export const addtocart = async (req, res) => {
try {
const userId = req.id;
const { productId } = req.body; 

// 1. Check if the product exists in the database
const product = await Product.findById(productId);
if (!product) {
return res.status(404).json({
success: false,
message: "Product not found",
});
}

// 2. Find the user's cart if it exists
let cart = await Cart.findOne({ userId });

// 3. Create a new cart if it does not exist
if (!cart) {
cart = new Cart({
userId,
items: [
{
productId,
quantity: 1,
price: product.productPrice,
},
],
});
} else {
// 4. If cart exists, check if the product is already in the cart
const itemIndex = cart.items.findIndex(
(item) => item.productId.toString() === productId
);

if (itemIndex > -1) {
// 5. Product exists in cart, increase the quantity
cart.items[itemIndex].quantity += 1;
} else {
// 6. Product is not in cart, add it as a new item
cart.items.push({
productId,
quantity: 1,
price: product.productPrice,
});
}
cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

}

// 7. Save the cart changes to the database
await cart.save();

const populatedCart=await Cart.findById(cart._id).populate("items.productId");

// 8. Send back a successful response
return res.status(200).json({
success: true,
message: "Item added to cart successfully",
cart: populatedCart,
});

} catch (err) {
// 9. Handle any unexpected errors
return res.status(500).json({
success: false,
message: err.message,
});
}
};

// export const updatedquantity=async (req, res) => {
//   try{
//     const userId=req.id;
//     const { productId, type} = req.body;

//     let cart=await Cart.findOne({ userId });
//     if(!cart){
//       return res.status(404).json({
//         success: false,
//         message: "Cart not found",
//       });
//     }


//     const item=cart.items.find(item => item.productId.toString() === productId);
//     if(!item){
//       return res.status(404).json({
//         success: false,
//         message: "Item not found in cart",
//       });
//     }

//     if(type === "increment"){
//       item.quantity += 1;
//     } else if(type === "decrement"){
//       item.quantity -= 1;
//       // if(item.quantity <= 0){
//       //   cart.items = cart.items.filter(item => item.productId.toString() !== productId);
//       // }
//     }

//     cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

//     await cart.save();
//     cart=await Cart.findById(cart._id).populate("items.productId");

//     return res.status(200).json({
//       success: true,
//       message: "Cart updated successfully",
//       cart,
//     });

//   }catch(err){
//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// }


export const updatedquantity = async (req, res) => {
  try {
    const userId = req.id;
    const { productId, type } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId.toString()
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    if (type === "increment") {
      item.quantity += 1;
    } else if (type === "decrement") {
      item.quantity -= 1;

      if (item.quantity <= 0) {
        cart.items = cart.items.filter(
          (item) => item.productId.toString() !== productId.toString()
        );
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid quantity update type",
      });
    }

    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await cart.save();

    cart = await Cart.findById(cart._id).populate("items.productId");

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
export const removefromcart=async (req, res) => {
  try{
const userId=req.id;
const { productId } = req.body;

let cart=await Cart.findOne({ userId });
if(!cart){
  return res.status(404).json({
    success: false,
    message: "Cart not found",
  });
}

cart.items = cart.items.filter(item => item.productId.toString() !== productId);
cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

await cart.save();
cart=await Cart.findById(cart._id).populate("items.productId");

return res.status(200).json({
  success: true,
  message: "Item removed from cart successfully",
  cart,
});
  }catch(err){
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}