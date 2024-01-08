import express from 'express'
import {
  deleteOrder,
  changeStatus,
  getAllOrders,
  getDetailByUserId,
  getOrderDetail,
  getOrdersByUserId,
  order,
  getOrderSort,
  findOrder
} from '../controller/ordersController.js'
const router = express.Router()

router.delete('/del', deleteOrder)
router.get('/getall', getAllOrders)
router.get('/detail/:orderid', getOrderDetail)
router.post('/add', order)
router.get('/getorderbyuserid/:userid', getOrdersByUserId)
router.post('/getdetailbyuserid', getDetailByUserId)
router.get('/find', findOrder)
router.put('/update/status/:orderid', changeStatus)
router.get('/sort-new', getOrderSort)
export default router
