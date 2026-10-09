import express from "express";
import { allUsers, forgotPassword, getUserById, login, logout, register, resetPassword, reVerify, updateUser, verify, verifyOtp } from "../controllers/userContoller.js";
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";




const router=express.Router();
router.post('/signup',register)
router.post("/verify",verify)
router.post("/reverify",reVerify)
router.post("/login",login)
router.post("/logout",isAuthenticated,logout)
router.post("/forgot-password",forgotPassword)
router.post("/verify-otp/:email",verifyOtp)
router.post("/reset-password/:email",resetPassword)
router.get("/allusers",isAuthenticated,isAdmin, allUsers)
router.get("/getuser/:userid",isAuthenticated, getUserById)
router.put('/update/:id',isAuthenticated,singleUpload, updateUser)


export default router