import { createSlice } from "@reduxjs/toolkit";

const productSlice=createSlice({
  name:"product",
  initialState:{
    products:[],
    cart:[],
  },
  reducers:{
    setproducts:(state,action)=>{
      state.products=action.payload
    },
    setcart:(state,action)=>{
      state.cart=action.payload;
    }
  }
})
export const {setproducts,setcart}=productSlice.actions
export default productSlice.reducer



// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   products: [],
// };

// const productSlice = createSlice({
//   name: "product",
//   initialState,
//   reducers: {
//     setproducts: (state, action) => {
//       state.products = action.payload;
//     },

//     addproduct: (state, action) => {
//       state.products.push(action.payload);
//     },

//     removeproduct: (state, action) => {
//       state.products = state.products.filter(
//         (product) => product._id !== action.payload
//       );
//     },

//     updateproduct: (state, action) => {
//       state.products = state.products.map((product) =>
//         product._id === action.payload._id ? action.payload : product
//       );
//     },

//     clearproducts: (state) => {
//       state.products = [];
//     },
//   },
// });

// export const {
//   setproducts,
//   addproduct,
//   removeproduct,
//   updateproduct,
//   clearproducts,
// } = productSlice.actions;

// export default productSlice.reducer;