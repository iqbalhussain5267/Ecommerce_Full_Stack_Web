import express from 'express'
import { addtocart, getCart, removefromcart, updatedquantity } from '../controllers/cartControllers.js';
import { isAuthenticated } from '../middleware/isAuthenticated.js';


const router = express.Router();

router.post('/add-to-cart', isAuthenticated, addtocart);
router.put('/update-quantity', isAuthenticated, updatedquantity);
router.delete('/remove-from-cart', isAuthenticated, removefromcart);
router.get('/get-cart', isAuthenticated, getCart);

export default router;