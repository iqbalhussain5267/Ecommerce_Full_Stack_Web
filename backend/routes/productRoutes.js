import express from "express"
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js"
import { addpost, deletepost, getallpost, updatedproducts } from "../controllers/productController.js"
import { multipleUpload, singleUpload } from "../middleware/multer.js"

const router=express.Router()

router.post("/add",isAuthenticated,isAdmin,multipleUpload,addpost)
router.get("/getallproducts",getallpost)
router.delete('/delete/:productId',isAuthenticated,isAdmin,deletepost)
router.put('/update/:productId',isAuthenticated,isAdmin,multipleUpload,updatedproducts)

export default router;