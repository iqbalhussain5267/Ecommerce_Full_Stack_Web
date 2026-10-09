import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true // Fixed: Changed string "true" to boolean true
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
      price: {
        type: Number,
        required: true
      }
    }
  ],
  totalPrice: { // Fixed: Changed to camelCase for standard naming conventions
    type: Number,
    default: 0,
  }
}, { timestamps: true });

// Fixed: Changed .Model() to lowercase .model()
export const Cart = mongoose.model("Cart", cartSchema);
