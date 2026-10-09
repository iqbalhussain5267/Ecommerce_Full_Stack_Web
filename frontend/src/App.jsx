import React from "react";
import { Button } from "./components/ui/Button";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./pages/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Verify from "./pages/verify";
import VerifyEmail from "./pages/VerifyEmail";
import Footer from "./pages/Footer";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/forgotPassword";
import Verifyotp from "./pages/Verifyotp";
import changePassword from "./pages/forgotPassword";
import ChangePassword from "./pages/changePassword";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Dashbaord from "./pages/Dashbaord";
import AdminSales from "./pages/admin/AdminSales";
import AddProducts from "./pages/admin/AddProducts";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrder from "./pages/admin/AdminOrder";
import ShowUserOrders from "./pages/admin/ShowUserOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import UserInfo from "./pages/admin/AdminEditUser";
import ProtectedRoute from "./pages/protectedRoute";
import SingeProducts from "./pages/SingeProducts";
import AdminEditUser from "./pages/admin/AdminEditUser";


const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <Home />
        <Footer />
      </>
    ),
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/verify",
    element: <Verify></Verify>,
  },
  {
    path: "/verify/:token",
    element: <VerifyEmail></VerifyEmail>,
  },
  {
    path: "/profile/:userId",
    element: (
      <>
     <ProtectedRoute>   
       <Navbar />
        <Profile></Profile>
     </ProtectedRoute>
    
      </>
    ),
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword></ForgotPassword>,
  },
  {
    path: "/verify-otp/:email",
    element: <Verifyotp></Verifyotp>,
  },
  {
    path: "/change-password/:email",
    element: <ChangePassword></ChangePassword>,
  },
  {
    path: "/products",
    element: (
      <>
        <Navbar />
        <Products />
      </>
    ),
  },
    {
    path: "/products/:id",
    element: (
      <>
        <Navbar />
        <SingeProducts />
      </>
    ),
  },
  {
    path: "/cart",
    element: (
      <>
     <ProtectedRoute>
        <Navbar />
        <Cart />
        </ProtectedRoute>
      </>
    ),
  },
  {
    path: "/dashboard",
    element:
    <ProtectedRoute adminOnly={true}>
      <Navbar />
     <Dashbaord></Dashbaord>,
     
     </ProtectedRoute>,
    children: [
      {
        path: "sales",
        element: <AdminSales></AdminSales>,
      },
      {
        path: "add-product",
        element:<AddProducts></AddProducts>
      },{
        path:"products",
        element:<AdminProducts></AdminProducts>
      },{
        path:"orders",
        element:<AdminOrder></AdminOrder>
      },{
        path:"user/orders/:userId",
        element:<ShowUserOrders></ShowUserOrders>
      },{
        path:"users",
        element:<AdminUsers></AdminUsers>
      },{
        path:"user/:userId",
        element:<AdminEditUser></AdminEditUser>
      }
    ],
  },
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
