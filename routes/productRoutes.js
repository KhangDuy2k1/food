import express, { Router } from 'express'
import {
    getAllProducts,
    getProduct,
    addProduct,
    editProduct,
    deleteProduct,
    searchProducts,
    bestSell
} from '../controller/productController.js'
const router = express.Router();

router.get('/getAllProducts', getAllProducts)
router.get('/getProduct/:productid', getProduct)
router.get('/searchProducts/:name', searchProducts)
router.post('/add', addProduct)
router.put('/update/:productid', editProduct)
router.delete('/delete/:productid', deleteProduct)
router.get('/product-best-sell', bestSell)
export default router