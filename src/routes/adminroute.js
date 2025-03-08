const express=require('express')
const{register,login,logout,approveVendor}=require('../controllers/admincontroller')
const router=express.Router()
const { auth, adminOnly } = require('../middlewares/auth');

router.post('/register',register)
router.post('/login',login)
router.post('/logout', logout)
router.put('/approve-vendor/:vendorId', auth, adminOnly, approveVendor); 



module.exports=router;