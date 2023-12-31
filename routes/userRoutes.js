import express from 'express'
import {
  getAllUsers,
  signin,
  signup,
  updateAddress,
  updateUser,
  deleteUser
} from '../controller/usersController.js'
const router = express.Router()

router.post('/signup', signup)
router.post('/signin', signin)
router.delete('/delete', deleteUser)
router.put('/update/:userid', updateUser)
router.put('/address/:userid', updateAddress)

router.get('/getall', getAllUsers)

export default router
//đã sửa